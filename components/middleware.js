const jwt = require('jsonwebtoken')

exports.verify = function(req, res, next){
    let accessToken = false;
    let authHeader = req.header('Authorization');
    if (authHeader) {
        if (authHeader.startsWith("Bearer ")){
            accessToken = authHeader.substring(7, authHeader.length);
        } else {
            //Error
            accessToken = false;
        }
    }

    //if there is no token stored in cookies, the request is unauthorized
    if (!accessToken){
        return res.status(403).send({
            status : false,
            message : "Akses Terlarang!",
            data : null
        })
    }

    let payload
    try{
        //use the jwt.verify method to verify the access token
        //throws an error if the token has expired or has a invalid signature
        payload = jwt.verify(accessToken, config.jwt.ACCESS_TOKEN_SECRET)
        next()
    }
    catch(e){
        //if an error occured return request unauthorized error
        return res.status(401).send({
            status : false,
            message : "Unauthorize!",
            data : null
        })
    }
}