const express = require('express');
const router = express.Router();
const BgDataEntry = require('../models/BgDataEntry');
const User = require('../models/user');
const SettingProgramForm = require('../models/settingProgramForm');

//bgForm by id-------------------------------------------------------------------------------------------
router.get('/resultFormByid/:id', async (req, res) => {

    const bgForm = await SettingProgramForm.find();
    const resultForm = await BgDataEntry.find({user_id: req.params.id});
    let convertdata = ConvertDataToPDF(bgForm,resultForm);
    res.json(convertdata);

});

//bgForm-------------------------------------------------------------------------------------------
router.get('/allResult', async (req, res) => {

    const bgForm = await SettingProgramForm.find();
    let resultForm= await BgDataEntry.find();
    let convertdata=[] ;
    resultForm.map(data=>{
        convertdata.push(ConvertDataToPDF(bgForm,[data]));
    })
    res.json(convertdata);

});

//getUser-------------------------------------------------------------------------------------------
// router.get('/getUser', async (req, res) => {
//     const users = await User.find({
//       user_type: "User",
//     });
//     res.json(users);
//   });

//post-------------------------------------------------------------------------------------------
router.post('/addBgDataEntry/:id', async (req, res) => {

    const {
        department_name,
        topic_name,
        blood_glucose_member_id,
        meter_brand,
        meter_number,
        serial_number,
        lot_strip,
        // code_item_number_typeOne,
        // code_item_number_typeTwo,
        value_item_number_typeOne,
        value_item_number_typeTwo,
        receive_date,
        analyze_date,
        auditor,
        auditor_appointment,
        // auditor_date,
        assessor,
        assessor_appointment,
        assessor_date,
    } = req.body;

    // if (!organization_name) {
    //     return res.send({
    //         success: false,
    //         message: 'Err: organization_name null'
    //     });
    // }

    //create new BgDataEntry
    const newBgDataEntry =  new BgDataEntry();

    newBgDataEntry.user_id = req.params.id;
    newBgDataEntry.department_name = department_name;
    newBgDataEntry.topic_name = topic_name;
    newBgDataEntry.blood_glucose_member_id = blood_glucose_member_id;
    newBgDataEntry.meter_brand = meter_brand;
    newBgDataEntry.meter_number = meter_number;
    newBgDataEntry.serial_number = serial_number;
    newBgDataEntry.lot_strip = lot_strip;
    // newBgDataEntry.code_item_number_typeOne = code_item_number_typeOne;
    // newBgDataEntry.code_item_number_typeTwo = code_item_number_typeTwo;
    newBgDataEntry.value_item_number_typeOne = value_item_number_typeOne;
    newBgDataEntry.value_item_number_typeTwo = value_item_number_typeTwo;
    newBgDataEntry.receive_date = receive_date;
    newBgDataEntry.analyze_date = analyze_date;
    newBgDataEntry.auditor = auditor;
    newBgDataEntry.auditor_appointment = auditor_appointment;
    // newBgDataEntry.auditor_date = auditor_date;
    newBgDataEntry.assessor = assessor;
    newBgDataEntry.assessor_appointment = assessor_appointment;
    newBgDataEntry.assessor_date = assessor_date;
    newBgDataEntry.save((err, user) => {
        if (err) {
            return  res.send({
                success: false,
                message: 'Err: server err.'
            });                
        }
        return  res.send({
            success: true,
            message: 'create BgDataEntry.'
        });
    });

    await User.findByIdAndUpdate(req.params.id, { sentBgResult: true});

});

ConvertDataToPDF = (bgForm,resultForm)=>{
    bgForm.map(buttomOnPdf=> {
    resultForm.map(contentOnPdf=> {
      console.log("contentOnPdf", contentOnPdf);

  function formatIssueDate(){
    let dateOriginal = bgForm.map(values => {
      return values.issue_date
    })

    const formatDate1 = new Date(dateOriginal)
    const formatDate2 = formatDate1.toLocaleDateString()

    return formatDate2
  }

  function formatAssessorDate(){
    let dateOriginal = resultForm.map(values => {
      return values.assessor_date
    })
    let docDefinition;
    console.log(dateOriginal[0])

    const formatDate1 = new Date(dateOriginal)
    console.log(formatDate1)
    const formatDate2 = formatDate1.toLocaleDateString()
    console.log(formatDate2)

    return formatDate2
  }

  const issueDate = formatIssueDate();
  const assessorDate = formatAssessorDate();

    docDefinition = {
      info: {
        title:'แบบบันทึกผล'
        },

      pageSize:'A4',
      pageOrientation:'portrait', //'landscape'
      pageMargins:[50,30,30,60],

      defaultStyle:{
        font: 'THSarabunNew'
      },

      styles: {
        top: {
          fontSize: 16,
        },
        header: {
          fontSize: 16,
          bold: true,
          alignment: 'center',
          marginTop: 30,
        },
        paragraph: {
          fontSize: 16,
          bold: true,
          alignment: 'left'
        },
        note: {
          fontSize: 16,
          bold: true,
          alignment: 'left'
        },
        auditorAndassessor: {
          fontSize: 16,
          alignment: 'center',
          width:'*',
        }
      },

      content: [
        {
          columns:[
            {
              text: "ชื่อเอกสาร: "+buttomOnPdf.document_name,
              style: 'top',
              alignment: 'left'
            },
            {
              text:buttomOnPdf.form_name,
              style: 'top',
              alignment: 'right'
            }
          ],
        },
        {
          columns:[
            {
              text: "วันที่ออกเอกสาร......."+issueDate, 
              style: 'top',
              // width:'auto',
              margin: 0,
              alignment: 'left'
            },
            {
              text: "..........ฉบับที่ "+buttomOnPdf.no+"..........",
              style: 'top',
              margin: 0,
              alignment: 'center'
            },
            {
              text:".......แก้ไขครั้งที่ "+buttomOnPdf.edit_times,
              style: 'top',
              alignment: 'right'
            }
          ]
        },
        {
          columns:[
            {
              text: "เอ็นยู เอ็มแอลซี ศูนย์ทดสอบความชำนาญห้องปฏิบัติการทางการแพทย์",
              style: 'top',
              width:'auto',
              alignment: 'left'
            },
            {
              text:'หน้า 1 / 1 หน้า',
              style: 'top',
              alignment: 'right'
            }
          ]
        },
        {
          canvas: [
            {
              type: 'line',
              x1: 0, y1: 10,
              x2: 520, y2: 10,
              lineWidth: 1
            }
          ]
        },
        { 
          text: "แบบบันทึกผล \nโปรแกรมการทดสอบความชำนาญการตรวจวัดปริมาณนํ้าตาลในเลือด ด้วยเครื่องตรวจวัดแบบพกพา \nจากผู้เข้าร่วมโปรแกรม "+buttomOnPdf.topic_name,
          style: 'header',
        },
        { 
          text: "รหัสผู้รับบริการ "+contentOnPdf.blood_glucose_member_id,
          style: 'paragraph',
          marginTop: 20,
        },
        { 
          text: "ยี่ห้อเครื่อง "+contentOnPdf.meter_brand,
          style: 'paragraph',
        },
        { 
          marginTop: 20,
          table:{
            widths:['*','auto','auto','auto','auto','auto','*'],
            
            body:[
              [{ text:"หมายเลขเครื่อง", bold:true },{ text:"Serial number", bold:true },{ text:"Lot. Strip", bold:true },{ text:"หมายเลขวัสดุทดสอบความชำนาญ", bold:true, colSpan: 2 },"",{ text:"วันที่ได้รับ", bold:true },{ text:"วันที่ตรวจวิเคราะห์", bold:true }],
              ["","","",{ text:buttomOnPdf.PT_item_number_typeOne+" (mg/dL)", bold:true },{ text:buttomOnPdf.PT_item_number_typeTwo+" (mg/dL)", bold:true },"",""]
            ],
            headerRows:1
          }
        },
        { 
          marginTop: 15,
          text: [
            {text: 'หมายเหตุ  ', style: 'note'},
            {text: '      1. กรุณารายงานผลการวิเคราะห์ เป็นทศนิยม 0 ตำแหน่ง\n', fontSize: 16},
          ]
        },
        {
          marginLeft: 70,
          text: [
            {text: '2. กรุณากรอก', fontSize: 16},
            {text: 'ตัวเลข 4 ตัวท้าย', fontSize: 16, decoration: 'underline'},
            {text: 'ของหมายเลขวัสดุทดสอบความชำนาญ ลงในช่องลำดับที่', fontSize: 16}
          ]
        },
        // { 
        //   text: '2. กรุณากรอกตัวเลข 4 ตัวท้ายของหมายเลขวัสดุทดสอบความชำนาญ ลงในช่องลำดับที่',fontSize: 16, marginLeft: 70
        // },
        // { 
        //   text: 'ตัวเลข 4 ตัวท้าย',fontSize: 16, marginLeft: 70
        // },
        {
          columns:[
            {
              text:'ผู้ทำการตรวจวิเคราะห์',
              style: 'auditorAndassessor',
              marginTop: 60,
            },
            {
              text:'ผู้ตรวจสอบ/หัวหน้าห้องปกิบัติการ',
              style: 'auditorAndassessor',
              marginTop: 60,
            }
          ]
        },
        {
          columns:[
            {
              text:contentOnPdf.auditor,
              style: 'auditorAndassessor',
            },
            {
              text:contentOnPdf.assessor,
              style: 'auditorAndassessor',
            }
          ]
        },
        {
          columns:[
            {
              text:"( "+contentOnPdf.auditor_appointment+" )",
              style: 'auditorAndassessor',
            },
            {
              text:"( "+contentOnPdf.assessor_appointment+" )",
              style: 'auditorAndassessor',
            }
          ]
        },
        {
          columns:[
            {
              text:"", //contentOnPdf.auditor_date
              style: 'auditorAndassessor',
            },
            {
              text:"วันที่ "+assessorDate,
              style: 'auditorAndassessor',
            }
          ]
        }
      ],

      footer: [
        {
          "canvas": [
            {
              "type": "line",
              "x1": 0,
              "y1": 58,
              "x2": 68,
              "y2": 58,
              "lineWidth": 10,
              "lineColor": "#FAFAFA"
            }
          ]
        },
        {
          "canvas": [
            {
              "type": "line",
              "x1": 68,
              "y1": 0,
              "x2": 135,
              "y2": 0,
              "lineWidth": 10,
              "lineColor": "#FAFAFA"
            }
          ]
        },
        {
          "columns": [
            {
              "text": [
                {
                  "text": "*******************************************หมายเหตุ*******************************************\n",
                  // "bold": true,
                  // "italics": true
                },
                {
                  "text": "ผู้รับผิดชอบกรุณารวบรวมผลและกรอกข้อมูลใน "+ buttomOnPdf.form_name +" ฉบับนี้ให้ครบถ้วน\n",
                  // "color": "#6E6E6E"
                },
                {
                  "text": "หากมีข้อซักถามประการใด กรุณาติดต่อ "+ buttomOnPdf.phone +" หรือ LINE: "+ buttomOnPdf.line +"\n",
                },
                {
                  "text": buttomOnPdf.company_name +"ขอขอบคุณอย่างยิ่ง",
                }
              ],
              "alignment": "center",
              "fontSize": "16"
            }
          ],
          "margin": [
            40,
            -140,
            40,
            0
          ]
        }
      ]
    };

    for (let index = 1; index <= resultForm[0].meter_number.length; index++) {

      function formatReceiveDate(){
        const formatDate1 = new Date(resultForm[0].receive_date[index-1])
        const formatDate2 = formatDate1.toLocaleDateString()

        return formatDate2
      }

      function formatAnalyzeDate(){
        const formatDate1 = new Date(resultForm[0].analyze_date[index-1])
        const formatDate2 = formatDate1.toLocaleDateString()
        
        return formatDate2
      }

      const ReceiveDate = formatReceiveDate();
      const AnalyzeDate = formatAnalyzeDate();

      docDefinition.content[7].table.body.push([
        resultForm[0].meter_number[index-1],
        resultForm[0].serial_number[index-1],
        resultForm[0].lot_strip[index-1],
        // resultForm[0].code_item_number_typeOne[index-1],
        resultForm[0].value_item_number_typeOne[index-1],
        // resultForm[0].code_item_number_typeTwo[index-1],
        resultForm[0].value_item_number_typeTwo[index-1],
        ReceiveDate,
        AnalyzeDate
      ])
      // console.log("docDefinition ", resultForm[0].receive_date[index-1]);
      // console.log("ReceiveDate ", ReceiveDate);
    }
})
})
    return docDefinition;
}

module.exports = router;

