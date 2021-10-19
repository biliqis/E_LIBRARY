const jwt = require('jsonwebtoken');
const User = require('../models/user')


const requireAuth = (req, res, next) => {
    const token = req.headers.jwt;
  
    // check json web token exists & is verified
    if (token) {
      jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
        if (err) {
          console.error(err.message);
          res.send({"message":err.message,"error":"unauthorized!"})
        } else {
          console.log(decodedToken);
          res.send({"message":decodedToken})
          next();
        }
      });
    } else {
      res.send({"message":"invalidToken!"})
    }
  };
  module.exports= requireAuth