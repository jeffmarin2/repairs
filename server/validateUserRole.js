const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const token = req.headers['x-access-token'];
    if (token) {
        jwt.verify(token, 'reactrepairs', (err, decoded) => {
            if (err) {
                res.status(500).send({ message: 'Failed to authenticate token.' });
            } else if (decoded.role !== 'user') {
                res.status(400).send({ message: 'Token not user' });
            } else {
                next();
            }
        });
    } else {
        res.status(401).send({ message: 'Invalid Token' });
    }
};
