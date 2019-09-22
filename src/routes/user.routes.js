const express = require('express');
const router = express.Router();
const User = require('../models/user');
const UserSession = require('../models/userSession');
const BgDataEntry = require('../models/BgDataEntry');

//getUser-------------------------------------------------------------------------------------------
router.get('/getUser', async (req, res) => {
  const users = await User.find({user_type: "User"}).sort('blood_glucose_member_id');
  res.json(users);
});


//getPartner-------------------------------------------------------------------------------------------
router.get('/getPartner', async (req, res) => {
  const partner = await User.find().distinct('partner');
  res.json(partner);
});

// get by id-------------------------------------------------------------------------------------------
router.get('/getUser/:id', async (req, res) => {
    const users = await User.findById(req.params.id);
    res.json(users);
});

//getSearch------------------------------------------------------------------------------------------
router.get('/getSearch/:search_name/:category_name', async (req, res) => {
  const {
    search_name,
    category_name
  } = req.params;

  let field={};
  if((search_name!="search_name_null")&&(category_name!="all")){
    if (category_name == 'blood_glucose_member_id') {
      field = { 
        $or : [{
          blood_glucose_member_id:{
            '$regex': search_name
          }
        }]
      }
    } 
    // else if (category_name == 'hct_member_id') { 
    //   field = {
    //     $or : [{
    //       hct_member_id: {
    //         '$regex': search_name
    //       }
    //     }]        
    //   }
    // } else if (category_name == 'hba1c_member_id') {
    //   field = {
    //     $or : [{
    //       hba1c_member_id: {
    //         '$regex': search_name
    //       }
    //     }]        
    //   }
    // }
    
    if(search_name!="search_name_null" && category_name != "all"){
      field.$or.push({
          department_name: {
            '$regex': search_name
        }
      });
    }

  }
  else if ((search_name!="search_name_null")&&(category_name == "all")) {
      field = {
        $or : [
          {department_name:{
            '$regex': search_name
          }},
          {blood_glucose_member_id: {
            '$regex': search_name
          }},
          // {hct_member_id: {
          //   '$regex': search_name
          // }},
          // {hba1c_member_id: {
          //   '$regex': search_name
          // }}
        ]
      }
  }
  else if((search_name=="search_name_null")&&(category_name!="all")){
      if (category_name == 'blood_glucose_member_id') {
        field = {
          blood_glucose_member_id:{
            $ne: ""
          }
      }
      } 
      // else if (category_name == 'hct_member_id') { 
      //   field = {
      //     hct_member_id: {
      //       $ne: ""
      //     }
          
      //   }
      // } else if (category_name == 'hba1c_member_id') {
      //   field = {
      //     hba1c_member_id: {
      //       $ne: ""
      //     }
      //   }
      // }
    }

  field.user_type = 'User';

  User.find(field, (err, users) => {

    let filterPT;
    if((search_name!="search_name_null")&&(category_name!="all")){
      if (category_name == 'blood_glucose_member_id') {
        filterPT = users.filter((data)=>{
          if(data.blood_glucose_member_id){
          return data
          }
        });
      } 
      // else if (category_name == 'hct_member_id') { 
      //   filterPT = users.filter((data)=>{
      //     if(data.hct_member_id){
      //     return data
      //     }
      //   });
      // } else if (category_name == 'hba1c_member_id') {
      //   filterPT = users.filter((data)=>{
      //     if(data.hba1c_member_id){
      //     return data
      //     }
      //   });
      // }
      res.json(filterPT);
      
    }else{
      res.json(users);
    }
  });
});

//Add admin****************************************************************************
router.post('/addAdmin', async (req, res) => {
  const {
    body
  } = req;

  const {
    password
  } = body;

  let {
    department_name = "Admin",
    username,
    user_type = "Admin",
    user_type_id = "1"
  } = body;

  //create new Admin------------------------------------------------------------------------------------------
  const newUser = new User();
  
  newUser.user_type = user_type;
  newUser.user_type_id = user_type_id;
  newUser.department_name = department_name;
  newUser.username = username;
  newUser.password = newUser.generateHash(password);
  newUser.save((err, user) => {
    if (err) {
      return res.send({
        status: false,
        message: "Err: server."
      });
    }
    return res.send({
      status: true,
      message: "Created user."
    });
  });
});

//post addUser----------------------------------------------------------------------------------------
router.post('/addUser', async (req, res) => {
  const {
    body
  } = req;

  const {
    blood_glucose_meter_qty,
    password
  } = body;

  let {
    partner,
    department_name,
    blood_glucose_member_id,
    // hba1c_member_id,
    // hct_member_id,
    username,
    user_type = "User",
    user_type_id = "3",
    sentBgResult = false
  } = body;

  if (!partner) {
    partner = 'ทำการลงทะเบียนเข้ามาเอง'
    }

  // department_name-----------------------------------------------------------------------------
  let departmentName = await User.find({
    department_name: department_name
  })
  if (departmentName.length > 0) {
    return res.send({
      status: false,
      message: 'This department name have had already. \n(ชื่อหน่วยงาน มีอยู่แล้ว)'
    });
  }

  // blood_glucose_member_id-----------------------------------------------------------------------
  let bloodGlucoseMemberID = await User.find({
    blood_glucose_member_id: blood_glucose_member_id
  })
  if (bloodGlucoseMemberID.length > 0) {
    if (bloodGlucoseMemberID[0].blood_glucose_member_id == "") {

    } else {
      return res.send({
        status: false,
        message: 'This Blood Glucose member id have had already. \n(รหัสผู้รับบริการชนิด Blood Glucose มีอยู่แล้ว)'
      });
    }
  }

  // hct_member_id-------------------------------------------------------------------------------------
  // let hctMemberID = await User.find({
  //   hct_member_id: hct_member_id
  // })
  // if (hctMemberID.length > 0) {
  //   if (hctMemberID[0].hct_member_id == "") {

  //   } else {
  //     return res.send({
  //       status: false,
  //       message: 'This Hct member id have had already. \n(รหัสผู้รับบริการชนิด Hct มีอยู่แล้ว)'
  //     });
  //   }
  // }

  // hba1c_member_id--------------------------------------------------------------------------------------
  // let hba1cMemberID = await User.find({
  //   hba1c_member_id: hba1c_member_id
  // })
  // if (hba1cMemberID.length > 0) {
  //   if (hba1cMemberID[0].hba1c_member_id == "") {

  //   } else {
  //     return res.send({
  //       status: false,
  //       message: 'This HbA1c member id have had already. \n(รหัสผู้รับบริการชนิด HbA1c มีอยู่แล้ว)'
  //     });
  //   }
  // }

  // username-----------------------------------------------------------------------------------------------
  let userName = await User.find({
    username: username
  })
  if (userName.length > 0) {
    return res.send({
      status: false,
      message: 'This username have had already. \n(ชื่อผู้ใช้ มีอยู่แล้ว)'
    });
  }

  //create new user------------------------------------------------------------------------------------------
  const newUser = new User();
  
  newUser.user_type = user_type;
  newUser.user_type_id = user_type_id;
  newUser.sentBgResult = sentBgResult;
  newUser.partner = partner;
  newUser.department_name = department_name;
  newUser.blood_glucose_member_id = blood_glucose_member_id;
  // newUser.hba1c_member_id = hba1c_member_id;
  // newUser.hct_member_id = hct_member_id;
  newUser.username = username;
  newUser.blood_glucose_meter_qty = parseInt(blood_glucose_meter_qty);
  // newUser.password = newUser.generateHash(password);
  newUser.password = password;
  newUser.save((err, user) => {
    if (err) {
      return res.send({
        status: false,
        message: "Err: server."
      });
    }
    return res.send({
      status: true,
      message: "Created user."
    });
  });
});

//post login-------------------------------------------------------------------------------------------
router.post('/login', async (req, res) => {
  const {
    body
  } = req;

  const {
    password
  } = body;

  let {
    username
  } = body;

  // username = username.toLowerCase();

  let users = await User.find({
    username: username,
  })
  if (users.length != 1) {
    return res.send({
      status: false,
      message: "The username that you've doesn't match any account. \n(ชื่อผู้ใช้ไม่ตรงกับบัญชีใดๆ)"
    });
  }

  const user = users[0];
  if (user.username == "admin") {
    if (!user.validPassword(password)) {
      return res.send({
        status: false,
        message: "The password that you've entered is incorrect.  \n(รหัสผ่านที่คุณป้อนไม่ถูกต้อง)"
      });
    }
  } else if (user.username != "admin") {
    if (user.password != password) {
      return res.send({
        status: false,
        message: "The password that you've entered is incorrect.  \n(รหัสผ่านที่คุณป้อนไม่ถูกต้อง)"
      });
    }
  }

  const userSession = new UserSession();
  userSession.user_id = user._id;
  userSession.save((err, doc) => {
    if (err) {
      return res.send({
        status: false,
        message: 'Err: server.'
      });
    }
    return res.send({
      status: true,
      message: 'Login success.',
      token: doc._id,
      username: user.username,
      user_type: user.user_type,
      user_type_id: user.user_type_id,
      department_name: user.department_name,
      blood_glucose_member_id: user.blood_glucose_member_id,
      blood_glucose_meter_qty: user.blood_glucose_meter_qty,
      sentBgResult: user.sentBgResult,
      _id: user._id
      // hba1c_member_id: user.hba1c_member_id,
      // hct_member_id: user.hct_member_id
    });

  });

});

//put by id-------------------------------------------------------------------------------------------
router.put('/update/:id', async (req, res) => {

  const {
    partner,
    department_name,
    blood_glucose_member_id,
    blood_glucose_meter_qty,
    // hba1c_member_id,
    // hct_member_id,
    username,
    password,
    result_approve_again
  } = req.body;

  // department_name-------------------------------------------------------------------------------------
  let departmentname = await User.find({
    department_name: department_name
  })
  if (departmentname.length > 0) {
    if (departmentname[0].id == req.params.id) {

    } else {
      return res.send({
        status: false,
        message: 'This department name have had already. \n(ชื่อหน่วยงาน มีอยู่แล้ว)'
      });
    }
  }

  // blood_glucose_member_id---------------------------------------------------------------------------------
  let bloodglucosememberid = await User.find({
    blood_glucose_member_id: blood_glucose_member_id
  })
  if (bloodglucosememberid.length > 0) {
    if (bloodglucosememberid[0].id == req.params.id) {

    } else if (bloodglucosememberid[0].blood_glucose_member_id == "") {

    } else {
      return res.send({
        status: false,
        message: 'This Blood Glucose member id have had already. \n(รหัสผู้รับบริการชนิด Blood Glucose มีอยู่แล้ว)'
      });
    }
  }

  // hct_member_id------------------------------------------------------------------------------------
  // let hctmemberid = await User.find({
  //   hct_member_id: hct_member_id
  // })
  // if (hctmemberid.length > 0) {
  //   if (hctmemberid[0].id == req.params.id) {

  //   } else if (hctmemberid[0].hct_member_id == "") {

  //   } else {
  //     return res.send({
  //       status: false,
  //       message: 'This Hct member id have had already. \n(รหัสผู้รับบริการชนิด Hct มีอยู่แล้ว)'
  //     });
  //   }
  // }

  // hba1c_member_id--------------------------------------------------------------------------------------
  // let hba1cmemberid = await User.find({
  //   hba1c_member_id: hba1c_member_id
  // })
  // if (hba1cmemberid.length > 0) {
  //   if (hba1cmemberid[0].id == req.params.id) {

  //   } else if (hba1cmemberid[0].hba1c_member_id == "") {

  //   } else {
  //     return res.send({
  //       status: false,
  //       message: 'This HbA1c member id have had already. \n(รหัสผู้รับบริการชนิด HbA1c มีอยู่แล้ว)'
  //     });
  //   }
  // }

  // username---------------------------------------------------------------------------------------------------
  let userName = await User.find({
    username: username
  })
  if (userName.length > 0) {
    if (userName[0].id == req.params.id) {

    } else if (userName.length > 0) {
      return res.send({
        status: false,
        message: 'This username have had already. \n(ชื่อผู้ใช้ มีอยู่แล้ว)'
      });
    }
  }

  if (result_approve_again === true) {
    await User.findByIdAndUpdate(req.params.id, { sentBgResult: false});
    await BgDataEntry.remove({user_id: req.params.id});
  }

  const newUser = {
    partner,
    department_name,
    blood_glucose_member_id,
    blood_glucose_meter_qty,
    // hba1c_member_id,
    // hct_member_id,
    username,
    password,
  };

  // update-----------------------------------------------------------------------------------------------
  await User.findByIdAndUpdate(req.params.id, newUser);
  res.json({
    status: 'User Updated'
  });
});

// delete by id-------------------------------------------------------------------------------------------
router.delete('/delete/:id', async (req, res) => {
  await User.findByIdAndRemove(req.params.id);
  res.json({
    status: 'User Deleted'
  });
});

module.exports = router;