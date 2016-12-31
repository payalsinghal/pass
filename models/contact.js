
var mongoose = require('mongoose');
var ContactRegisterSchema = mongoose.Schema({

name                            :{ type: String },
dob                             :{ type: String},
pid                              :{ type: String },
contact_no                      :{ type: Number},
email                           :{ type: String },
permanent_address                :{ 
              address1           :{ type: String},
              address2           :{ type: String }
             },
verified                         :{ type: String}
});
module.exports = mongoose.model('ContactRegister', ContactRegisterSchema);