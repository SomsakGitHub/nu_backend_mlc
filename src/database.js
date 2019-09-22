const mongoose = require('mongoose');
const url = 'mongodb://localhost/nu_mlc_db';

//connect database-------------------------------------------------------------------------------------------
mongoose.connect(url)
    .then(db => console.log('DB connected'))
    .catch(err => console.error(err));

module.exports = mongoose;