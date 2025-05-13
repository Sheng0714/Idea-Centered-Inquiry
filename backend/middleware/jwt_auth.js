const jwt = require('jsonwebtoken');

const authenticateJWT = (req, res, next) => {
    const _jwt = req.cookies.jwt; // 假設使用 express 和 cookie-parser
    let token = req.header('Authorization')?.split(' ')[1];
    token = _jwt? _jwt: token;
    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) {;
                return res.status(403).send(err.toString())
                
            }
            req.user = user;
            next();
        });
    } else {
        return res.status(401).send("got token: "+token)
    }
};

module.exports = { authenticateJWT };