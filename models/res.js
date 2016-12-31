var mongoose = require('mongoose');
var RegisterSchema = mongoose.Schema({

email              	  : { type: String, required: true },
mobileNumberCode      : { type: String, required: true},
mobilenumber       : { type: Number, required: true },
password              : { type: String, required: true },
confirm_password      : { type: String, required: true },
IP_address            : { type: String },
MAC_address           : { type:String },
locations             :[],
// authorization_status  : { type: String, required: true },
verifyCode             : { type: String, required: true }

})

module.exports = mongoose.model('Register', RegisterSchema);