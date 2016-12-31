var mongoose = require('mongoose');
var loginSchema = mongoose.Schema({


    email                   :       { type: String, required: true },
    password                :       { type: String, required: true },
    active                  :       { type: Boolean, required: true},
    token                   :       { type: String}, 
    pid                    :       { type: String},
    lastLogin               :       []
      });
	module.exports = mongoose.model('login', loginSchema);