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
        console.log(data);

        res.send({msg : "Berhasil Logout"});
    }).catch((err) => {
        console.log(err);
        
        console.log({msg : "Berhasil Logout"});
    })
});

router.get('/login', (req,res) => {
    let type = req.query.type;

    fs.readFile('./wa-temp/last.qr', (err,last_qr) => {
        fs.readFile('./wa-temp/session.json', (serr, sessiondata) => {
            if(err && sessiondata){
                res.send({msg : "Sudah Login"});
                res.end();
            }else if(!err && serr){
                
                QRCode.toDataURL(`${last_qr}`, function (err, url) {
                    if(type!=="html"){
                        res.send({
                            status : false,
                            message : "Scan QR Code",
                            data : {
                                err : err,
                                qrcode : `${url}`
                            }
                        })
                    } else {
                        var page = `<img id="imgQrcode" src="${url}">`;
                        res.write(page)
                    }
                    res.end();
                })
            }
        })
    });
});

module.exports = router;