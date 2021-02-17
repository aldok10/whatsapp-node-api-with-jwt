const QRCode = require('qrcode');
const router = require('express').Router();
const fs = require('fs');

router.get('/health', async (req, res) => {
    client.getState().then((data) => {
        console.log({
            status_connection : data,
            status_battery : status_battery,
            status_plugged : status_plugged,
        })
        res.send({
            status_connection : data,
            status_battery : status_battery,
            status_plugged : status_plugged,
        })
    }).catch((err) => {
        if(err){
            res.send("DISCONNECTED")
            try{
                client.logout().then((data) => {
                    try{
                        fs.unlinkSync('./wa-temp/session.json')
                    }catch(err){
                        console.log({msg : "Sudah Logout"})
                    }
                    console.log({msg : "Berhasil Logout"})
                }).catch((err) => {
                    if(err){
                        try{
                            fs.unlinkSync('./wa-temp/session.json')
                        }catch(err){
                            console.log({msg : "Sudah Logout"})
                        }
                    }
                })
            }catch(err){console.log(err)}
        }
    })
});

router.get('/logout', async (req, res) => {
    client.logout().then((data) => {
        try{
            fs.unlinkSync('./wa-temp/session.json')
        }catch(err){
            console.log({msg : "Sudah Logout"})
        }
        res.send({msg : "Berhasil Logout"})
        console.log({msg : "Berhasil Logout"})
    }).catch((err) => {
        if(err){
            res.send({msg : "Berhasil Logout Ulang"})
            try{
                fs.unlinkSync('./wa-temp/session.json')
            }catch(err){
                console.log({msg : "Sudah Logout"})
            }
        }
    })
});

router.get('/login', (req,res) => {
    fs.readFile('./wa-temp/last.qr', (err,last_qr) => {
        fs.readFile('./wa-temp/session.json', (serr, sessiondata) => {
            if(err && sessiondata){
                res.send({msg : "Sudah Login"});
                res.end();
            }else if(!err && serr){
                let qr = '';
                QRCode.toDataURL(`${last_qr}`, function (err, url) {
                    res.send({
                    status : false,
                    message : "Scan QR Code",
                    data : {
                        err : err,
                        qrcode : `${url}`
                    }
                })
                res.end();
                })
            }
        })
    });
});

module.exports = router;