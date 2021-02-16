const router = require('express').Router();
const fs = require('fs');
const {verify} = require('./middleware')

router.get('/health', verify, async (req, res) => {
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

router.get('/logout', verify, async (req, res) => {
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
    var qrjs = fs.readFileSync('components/qrcode.js');
    fs.readFile('./wa-temp/last.qr', (err,last_qr) => {
        fs.readFile('./wa-temp/session.json', (serr, sessiondata) => {
            if(err && sessiondata){
                res.send({msg : "Sudah Login"});
                res.end();
            }else if(!err && serr){
                var page = `
                            <script>${qrjs}</script>
                            <div id="qrcode"></div>
                            <script type="text/javascript">
                                new QRCode(document.getElementById("qrcode"), "${last_qr}");
                            </script>
                `
                res.write(page)
                res.end();
            }
        })
    });
});

module.exports = router;