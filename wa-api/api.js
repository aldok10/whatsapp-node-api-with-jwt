const express = require("express");
const helmet = require("helmet");
const bodyParser = require("body-parser");
const fs = require('fs');
const axios = require('axios');
const shelljs = require('shelljs');

const config = require('./config.json');
const { Client } = require('whatsapp-web.js');
const SESSION_FILE_PATH = './wa-temp/session.json';

let sessionCfg;

if (fs.existsSync(SESSION_FILE_PATH)) {
    sessionCfg = require(SESSION_FILE_PATH);
}

process.title = "Imarah Printing Whatsapp Gateway";

global.config = config;
global.client = new Client({
    puppeteer: { 
        headless : true,
        args : ['--no-sandbox','--disable-setuid-sandbox','--unhandled-rejections=strict'],
        option : {}
    },
    session: sessionCfg
});

global.authed = false;
global.status_battery = '-';
global.status_plugged = '-';
const app = express();

const port = process.env.PORT || config.port;

app.use(helmet());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
//Set Request Size Limit 50 MB
app.use(bodyParser.json({limit: '50mb'}));

// Dapat QR
client.on('qr', qr => {
    fs.writeFileSync('./wa-temp/last.qr',qr);
});

// Telah Auth
client.on('authenticated', (session) => {
    console.log("AUTH!");
    sessionCfg = session;
    fs.writeFile(SESSION_FILE_PATH, JSON.stringify(session), function(err) {
        if (err) {
            console.error(err);
        }
        authed=true;
    });
    try{
        fs.unlinkSync('./wa-temp/last.qr')
    }catch(err){}
});

// Gagal Auth
client.on('auth_failure', () => {
    console.log("AUTH Failed !")
    sessionCfg = ""
    //process.exit()
});

// Whatsapp Siap  Digunakan
client.on('ready', () => {
    console.log('Client is ready!');
});

// Pesan Diterima
client.on('message', msg => {
    console.log(msg)
    if(config.webhook.enabled){
        axios.post(config.webhook.path, {msg : msg})
    }
});

// Pesan Dikirim
client.on('message_ack', (msg, ack) => {
    switch (ack) {
        case -1:
           console.log("Error", msg);
           break;
        case 0:
           console.log("Pending", msg);
           break;
        case 1:
           console.log("Diterima Server", msg);
           break;
        case 2:
           console.log("Pesan Diterima", msg);
           break;
        case 3:
           console.log("Pesan Dibaca", msg);
           break;
        case 4:
           console.log("Pesan Dibalas", msg);
           break;
        default:
            console.log("Undefined", msg);
        break;
    }
});

client.on('change_battery', (batteryInfo) => {
    // Battery percentage for attached device has changed
    const { battery, plugged } = batteryInfo;
    console.log(`Battery: ${battery}% - Charging? ${plugged}`);

    status_battery = battery;
    status_plugged = plugged;
});

client.on('disconnected', (reason) => {
    try{
        fs.unlinkSync('./wa-temp/session.json')
        client.initialize();
    }catch(err){
        console.log({msg : "Sudah Logout"})
    }
    console.log('Client was logged out', reason);
});

client.on('change_state', (reason) => {
    console.log('Client was change state', reason);
});

client.initialize();

const chatRoute = require('./components/chatting');
const groupRoute = require('./components/group');
const authRoute = require('./components/auth');
const contactRoute = require('./components/contact');

const {login, refresh} = require('./components/authentication')
const {verify} = require('./components/middleware')

app.use(function(req, res, next){
    console.log(req.method + ' : ' + req.path);
    next();
});

app.use('/api/v1/whatsapp', verify, authRoute);
app.use('/api/v1/whatsapp/send', verify, chatRoute);
app.use('/api/v1/whatsapp/send/group', verify, groupRoute);
app.use('/api/v1/whatsapp/contact', verify, contactRoute);

app.post('/api/v1/whatsapp/auth', login)
app.post('/api/v1/whatsapp/refresh', verify, refresh)

app.use('*', function(req, res){
  res.status(404).send({
            status : false,
            message : "Page Not Found!",
            data : null
        });
});

app.listen(port, () => {
    console.log("Server Running Live on Port : " + port);
});