//create a authentication token for JWT
const JWT = require('jsonwebtoken');

let authenticationToken = (req, res, next) => {
    let token = req.get("token");

    JWT.verify(token, 'ASIKOBDASHDASIDBAJSKLBDIOPBASDASJKDBNKJASDGHWADBUUAISNDNMSABDUIOPWADNAS', (err, decode) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                error: err
            });
        }

        next();
    });
}

module.exports = {
    authenticationToken
}