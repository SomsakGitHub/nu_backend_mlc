const express = require('express');
const router = express.Router();
const SettingProgramForm = require('../models/settingProgramForm');

//get-------------------------------------------------------------------------------------------
router.get('/getSettingBgForm', async (req, res) => {
    const settingBgFrom = await SettingProgramForm.find();
    res.json(settingBgFrom);
});

// get by id-------------------------------------------------------------------------------------------
// router.get('/:id', async (req, res) => {
//     const users = await User.findById(req.params.id);
//     res.json(users);
// });

router.post('/settingForm', async (req, res) => {
    const { 
        document_name,
        issue_date,
        no,
        edit_times,
        topic_name, 
        PT_item_number_typeOne, 
        PT_item_number_typeTwo,
        explanation,
        form_name,
        email,
        closing_day,
        phone,
        line,
        facebook,
        company_name 
    } = req.body;

    const settingBgFrom = new SettingProgramForm();

        settingBgFrom.document_name = document_name,
        settingBgFrom.issue_date = issue_date,
        settingBgFrom.no = no,
        settingBgFrom.edit_times = edit_times,
        settingBgFrom.topic_name = topic_name, 
        settingBgFrom.PT_item_number_typeOne = PT_item_number_typeOne, 
        settingBgFrom.PT_item_number_typeTwo = PT_item_number_typeTwo,
        settingBgFrom.explanation = explanation,
        settingBgFrom.form_name = form_name,
        settingBgFrom.email = email,
        settingBgFrom.closing_day = new Date(closing_day),
        settingBgFrom.phone = phone,
        settingBgFrom.line = line,
        settingBgFrom.facebook = facebook,
        settingBgFrom.company_name = company_name 

    await settingBgFrom.save();
    res.json({status: 'settingBgFrom save'});
});
 
//put by id-------------------------------------------------------------------------------------------
router.put('/update', async (req, res) => {
    const {
        document_name,
        issue_date,
        no,
        edit_times, 
        topic_name, 
        PT_item_number_typeOne, 
        PT_item_number_typeTwo,
        explanation,
        form_name,
        email,
        closing_day,
        phone,
        line,
        facebook,
        company_name 
    } = req.body;

    console.log("issue_date ",issue_date)

    const newSettingBgFrom = {
        document_name,
        issue_date,
        no,
        edit_times, 
        topic_name, 
        PT_item_number_typeOne, 
        PT_item_number_typeTwo,
        explanation,
        form_name,
        email,
        closing_day,
        phone,
        line,
        facebook,
        company_name 
    };

    console.log("issue_datee ",newSettingBgFrom.issue_date)
    await SettingProgramForm.update(newSettingBgFrom);
    res.json({status: 'settingBgFrom Updated'});
});

module.exports = router;