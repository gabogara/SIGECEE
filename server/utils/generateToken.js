const jwt = require('jsonwebtoken');

module.exports = function generateToken(id_p, name_p, email_p){
  return jwt.sign(
      {
        _id: id_p,
        name: name_p,
        email: email_p,
      },
      process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};