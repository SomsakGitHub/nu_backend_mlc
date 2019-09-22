const express = require('express');
const morgan = require('morgan');
const path = require('path');
const { mongoose } = require('./database');
const app = express();

//react allow-------------------------------------------------------------------------------------------
app.use(function(req, res, next) {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'GET, POST, DELETE, PUT');
    res.set('Access-Control-Allow-Headers', 'Origin, Accept, Content-Type, X-Requested-With, X-CSRF-Token');
    next();
});

//setting-------------------------------------------------------------------------------------------
app.set('port', process.env.PORT || 3001);

//middlewares-------------------------------------------------------------------------------------------
app.use(morgan('dev'));
app.use(express.json());

//routes-------------------------------------------------------------------------------------------
app.use('/api/user', require('./routes/user.routes'));
app.use('/api/settingProgramForm', require('./routes/settingProgramForm.routes'));
app.use('/api/BgDataEntry', require('./routes/BgDataEntry.routes'));
app.use('/api/Noti', require('./routes/noti.routes'));

app.get('/getTime', (req, res) => {
    res.json({'time': (new Date()).getTime()});
});

//static files-------------------------------------------------------------------------------------------
app.use(express.static(path.join(__dirname + '/public')));

//starting the serve-------------------------------------------------------------------------------------------
app.listen(app.get('port'), () => {
    console.log(`server on port ${app.get('port')}`);
})