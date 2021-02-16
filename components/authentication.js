const jwt = require('jsonwebtoken')

// Never do this!
let users = config.user

exports.login = function(req, res){

    let username = req.body.username
    let password = req.body.password
    
    // Neither do this!
    if (!username || !password || users[username].password !== password){
        return res.status(401).send({
            status : false,
            message : "Username & Password Harus Diisi",
            data : null
        })
    }

    //use the payload to store information about the user such as username, user role, etc.
    let payload = {username: username}

    //create the access token with the shorter lifespan
    let accessToken = jwt.sign(payload, config.jwt.ACCESS_TOKEN_SECRET, {
        algorithm: "HS256",
        expiresIn: config.jwt.ACCESS_TOKEN_LIFE
    })

    //create the refresh token with the longer lifespan
    let refreshToken = jwt.sign(payload, config.jwt.REFRESH_TOKEN_SECRET, {
        algorithm: "HS256",
        expiresIn: config.jwt.REFRESH_TOKEN_LIFE
    })

    //store the refresh token in the user array
    users[username].refreshToken = refreshToken

    console.log({
        status : true,
        message : "Success",
        data : {
            token : accessToken,
            refresh_token : refreshToken
        }
    })
    
    res.send({
        status : true,
        message : "Success",
        data : {
            token : accessToken,
            refresh_token : refreshToken
        }
    })
    
}

exports.refresh = function (req, res){

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

    if (!accessToken){
        return res.status(403).send({error : true, messages : "Access Denied!"})
    }

    let payload
    try{
        payload = jwt.verify(accessToken, config.jwt.ACCESS_TOKEN_SECRET)
    }
    catch(e){
        return res.status(401).send({error : true, messages : e})
    }

    //retrieve the refresh token from the users array
    let refreshToken = users[payload.username].refreshToken

    //verify the refresh token
    try{
        jwt.verify(refreshToken, config.jwt.REFRESH_TOKEN_SECRET)
    }
    catch(e){
        return res.status(401).send({error : true, messages : e})
    }

    let newToken = jwt.sign(payload, config.jwt.ACCESS_TOKEN_SECRET, 
    {
        algorithm: "HS256",
    })

    //create the refresh token with the longer lifespan
    refreshToken = jwt.sign(payload, config.jwt.REFRESH_TOKEN_SECRET, {
        algorithm: "HS256",
    })

    //store the refresh token in the user array
    users[payload.username].refreshToken = refreshToken

    res.send({accessToken : newToken, refreshToken : refreshToken})
}