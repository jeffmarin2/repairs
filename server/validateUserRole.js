var jwt = require('jsonwebtoken');
 
module.exports = function(req, res, next) {
  var token = req.headers['x-access-token'];
  if (token) {
    jwt.verify(token, 'reactrepairs', function(err, decoded) {
      if (err) {
        console.log('validateUserRole err:' + JSON.stringify(err));
        return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
      } else if (decoded.role != 'user') {
        res.status(400);
        res.json({
          "status": 400,
          "message": "Token not user"
        });
        return;
      } else {
        next();
      }
    })
  } else {
    res.status(401);
    res.json({
      "status": 401,
      "message": "Invalid Token"
    });
    return;
  }
};