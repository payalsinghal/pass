var express = require('express');
var app = express();
var mongoose = require('mongoose');
var Register = require('../models/res');
var Login = require('../models/login');
var ContactRegister = require('../models/contact');
var macaddress = require('macaddress');
var router = express.Router();
var geoip = require('geoip-lite');
var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy;
var crypto = require('crypto');
var jwt = require('jsonwebtoken');
var http = require('http');
var urlencode = require('urlencode');
// var sha512 = require('js-sha512');
var Hashids = require('hashids')
var hashSalt = new Hashids('Pbm forget password');
//var flash    = require('connect-flash');

router.route('/register')
    .post(function(req, res) {

        var register = new Register();
        register.email = req.body.email;
        register.mobileNumberCode = req.body.mobileNumberCode;
        register.mobilenumber = parseInt(req.body.mobilenumber);
        register.password = req.body.password;
        register.confirm_password = req.body.confirm_password;
        register.IP_address = req.connection.remoteAddress;

        function randomString(length, chars) {
            var result = '';
            for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
            return result;
        }
        var tempCode1 = randomString(8, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');
        console.log(tempCode1)
        register.verifyCode = tempCode1;
        register.verified = "No";


        macaddress.one(function(err, mac) {
            console.log("Mac address for this host: %s", mac);
            register.MAC_address = mac;

        });


        var geo = geoip.lookup(register.IP_address);
        console.log("geo address for this host: %s", geo);
        register.locations = geo;


        Login.findOne({ email: req.body.email }, function(err, data) {
            if (data == null || data == undefined) {

                Register.findOne({ email: req.body.email }, function(err, data) {
                        if (data == null || data == undefined) {



                            register.save(function(err) {
                                if (err) {
                                    console.log(err)
                                    res.json({ success: false });
                                    res.end();
                                } else {

                                    console.log("message");
                                    res.end();
                                    
                                }
                            })

                        } else {

                            Register.remove({ email: req.body.email }, function(err) {
                                if (!err) {

                                    register.save(function(err) {
                                        if (err) {
                                            res.json({ success: false });
                                            res.end();
                                        } else {
                                             console.log("message");

                                              res.end();
                                    
                                        }
                                    })
                                } else {
                                    res.json({ success: false, message: "you cannot register!, already exist" });
                                    res.end();
                                }
                            })

                        } //else

                    }) // register
            } else {
                res.json({ success: false, message: "you cannot register!, already exist" });
                res.end();
            }

        })



    })



router.route('/verify')
    .post(function(req, res) {
        Register.findOne({ email: req.body.email }, function(err, data) {
            if (!err) {
                verCode = data.verifyCode;
                if (verCode == req.body.verifyCode) {

                    Login.findOne({ email: data.email }, function(err, logindata) {
                        if (logindata == null || logindata == undefined) {

                            var newlogin = new Login();
                            var update = new Date().getTime();
                            var pid = update;
                            newlogin.pid = pid;
                            newlogin.email = data.email;
                            newlogin.password = data.password;
                            newlogin.active = true;
                            newlogin.save(function(err) {
                                if (!err) {
                                  
                                        var contact = new ContactRegister();
                                        contact.email = data.email;
                                        contact.pid = pid;
                                         contact.verified = "Yes";
                                        contact.save()
                                        console.log("message")
                                        res.json({ success: true });
                                        res.end();
                                   


                                } else {
                                    console.log(err)
                                    console.log("error in save")
                                    res.json({ success: false });
                                    res.end();
                                }
                            });
                        } else {
                            console.log(err)
                            console.log("login is not empty")
                            res.json({ success: false });
                            res.end();
                        }
                    }); // email is not found
                } 
                else {
                    console.log(err)
                    console.log("2")
                    res.json({ success: false, message: "wrong verification code" });
                    res.end();
                }

            } else {
                console.log(err)
                console.log("3")
                res.json({ success: false, message: "Registeration not done!" });
                res.end();
            }

        })//register

    })// post




// router.route('/login')
//     .post(function(req, res) {
//         Login.findOne({ email: req.body.email }, function(error, data) {
//             if (error) {
//                 res.status(500).send({ status: 500, message: 'internal error' });
//                 res.end();
//             } else {

//                 if (data && data.active == true) {

//                     if (data.password == req.body.password) {

//                         var ip = req.ip.split(":");
//                         var clientmac;
//                         ipClient = ip[3];
                        
//                         macaddress.one(function(err, mac) {
//                         clientmac=mac
//                         })

//                         obj = { date: new Date(), ip: ipClient, mac:clientmac };
//                         data.lastLogin.push(obj);
//                         data.save();

//                         ContactRegister.update({ email: req.body.email }, { $push: { lastLogin:obj } }).exec()
//                          data.markModified('lastLogin');
//                          data.save(function(numAffected) {});

//                         stoken = {
//                             pfid: data.pfid,
//                             email: data.email,
//                             active: data.active
//                         }

//                         var token = jwt.sign(stoken, 'superSecret', { expiresIn: '1d' });

//                         Login.update({ email: req.body.email }, { $set: { token: token } }, function(err, loginuser) {
//                             if (err) {
//                                 res.json({ success: false });
//                                 res.end();
//                             } else {

//                                 res.set({
//                                     'token': token
//                                 });

//                                 res.json({ success: true });
//                                 res.end();
//                             }
//                         })
//                     } else {
//                         res.json({ success: false, message: "wrong password" });
//                         res.end();
//                     }
//                 } else {
//                     res.json({ success: false, message: "User not found" });
//                     res.end();
//                 }
//             }
//         })
//     })

 


passport.use(new LocalStrategy({
        usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true,session:false},

  function(req,email, password, done) {
    Login.findOne({ 'email' :  req.body.email  }, function(err, user) {
      if (err) { 
          console.log("e2")
        return done(err); }
      if (!user) {
          console.log("e3")
        return done(null, false, ( 'Incorrect email.' ));

      }
      if (user.password!=req.body.password) {
          console.log("e4")
        return done(null, false, ( 'Incorrect password.')  );
      }
      return done(null, user);
    });
  }
));




router.post('/login', function(req, res, next) {
  passport.authenticate('local',{ session: false }, function(err, user, info) {

    if (err) { return next(err) }
    if (!user) {
      
      return res.status(401).json({error: 'message1'})
      console.log("e1")
    }


    Login.findOne({ email: req.body.email }, function(error, data) {
     if (data && data.active == true) {

                    //if (data.password == req.body.password) {

                        var ip = req.ip.split(":");
                        var clientmac;
                        ipClient = ip[3];
                        
                        macaddress.one(function(err, mac) {
                        clientmac=mac
                        })

                        obj = { date: new Date(), ip: ipClient, mac:clientmac };
                        data.lastLogin.push(obj);
                        data.save();

                        ContactRegister.update({ email: req.body.email }, { $push: { lastLogin:obj } }).exec()
                         data.markModified('lastLogin');
                         data.save(function(numAffected) {});

                        stoken = {
                            pfid: data.pfid,
                            email: data.email,
                            active: data.active
                        }

                        var token = jwt.sign(stoken, 'superSecret', { expiresIn: '1d' });

                        Login.update({ email: req.body.email }, { $set: { token: token } }, function(err, loginuser) {
                            if (err) {
                                res.json({ success: false });
                                res.end();
                            } else {

                                res.set({
                                    'token': token
                                });

                                res.json({ success: true });
                                res.end();
                            }
                        })
                    // } else {
                    //     res.json({ success: false, message: "wrong password" });
                    //     res.end();
                    // }
                } else {
                    res.json({ success: false, message: "Data is not active" });
                    res.end();
                }
            })

  })(req, res, next);
});



passport.use('ap',new LocalStrategy({
        usernameField: 'email',
            passwordField: 'token',
            passReqToCallback: true,session:false},

  function(req,email, password, done) {
    Login.findOne({ 'email' :  req.body.email  }, function(err, user) {
      if (err) { 
          console.log("e2")
        return done(err); }
      if (!user) {
          console.log("e3")
        return done(null, false, ( 'Incorrect email.' ));

      }
      if (user.token!=req.headers.token) {
          console.log("e4")
        return done(null, false, ( 'Incorrect password.')  );
      }
      return done(null, user);
    });
  }
));



router.post('/contat_person', function(req, res, next) {
  passport.authenticate('ap',{ session: false }, function(err, user, info) {

    if (err) { return next(err) }
    if (!user) {
      
      return res.status(401).json({error: 'message1'})
      console.log("e1")
    }

ContactRegister.findOne({ email: req.body.email }, function(err, d) {
                                if (!err) {
                                    
                                    d.name = req.body.name;
                                    d.dob = req.body.dob;
                                   d.contact_no =req.body.contact_no;
                                    d.permanent_address.address1 =req.body.permanent_address1
                                    d.permanent_address.address2 =req.body.permanent_address2
                                    
                                    d.save(function(err) {
                                        if (err)
                                            res.send(err);

                                        else
                                            res.send({ message: 'log' })
                                    });
                                }
                            });

  })(req, res, next);
});



router.route('/forgotPassword')
    .post(function(req, res) {

        Login.findOne({ email: req.body.email }, function(err, data) {
            if (!err) {
                if (data != null || data != undefined) {
                    var randomNum = Math.floor((Math.random() * 10000000) + 1000000);
                    var newPassword = hashSalt.encode(randomNum);
                    console.log(newPassword)  
                    data.password = newPassword;
                    data.save(function(err) {
                        if (!err) {
                              console.log("message")
                            
                        } else {
                            res.json({ success: false });
                            res.end();
                        }
                    });
                } else {
                    res.json({ success: false, message: "user not exist" });
                    res.end();
                }
            } else {
                res.json({ success: false, message: "user not exist" });
                res.end();
            }
        })
    })







// router.route('/contact_person')
//                 .post(function(req, res) {

//         Login.findOne({ token: req.headers.token }, function(err, user) {
//                         if (err) {
//                             console.log(err);
//                             res.send(err);
//                         } else if (user === null || undefined || "") {
//                             res.json("unauthroized");
//                         } else {

//                             ContactRegister.findOne({ email: req.body.email }, function(err, d) {
//                                 if (!err) {
//                                     var contact = new ContactRegister();
//                                     contact.name = req.body.name;
//                                     contact.dob = req.body.dob;
//                                     contact.contact_no =req.body.contact_no;
//                                     contact.permanent_address.address1 =req.body.permanent_address1
//                                     contact.permanent_address.address2 =req.body.permanent_address2
                                    
//                                     contact.save(function(err) {
//                                         if (err)
//                                             res.send(err);

//                                         else
//                                             res.send({ message: 'log' })
//                                     });
//                                 }
//                             });
//                         }
//                     });

//                 });



module.exports = router;
