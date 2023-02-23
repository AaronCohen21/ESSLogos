//dependencies
const sharp = require('sharp');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
//const https = require('https');
require('dotenv').config()

//setup
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
let serverStats = {
    imagesRendered: 0
};

//handling requests
//req should contain the svg to be processed
app.post('/', async (req, res) => {
    //create date string and log request to server
    const startDate = new Date();
    const dateString = (date) => `${('0' + (date.getMonth() + 1)).slice(-2)}/${('0' + date.getDate()).slice(-2)}/${date.getFullYear()} - ${('0' + date.getHours()).slice(-2)}:${('0' + date.getMinutes()).slice(-2)}:${('0' + date.getSeconds()).slice(-2)}`
    console.log(`[${dateString(startDate)}] - recieved new request: ${req.body.logo}${req.body.color}`);

    //resolve file path
    let fileIteration = 0;  //updated if a file already exists (ex. "logo (1).png")
    const fileString = () => dateString(startDate).replaceAll('/', '-') + (fileIteration !== 0 ? ` (${fileIteration})` : '');
    try {
        //update iteration until the filename doesn't exist
        while (fs.existsSync(path.resolve(`tmp/${fileString()}.png`))) fileIteration++;
        //now create the file immediately to 'reserve the filename'
        fs.writeFileSync(path.resolve(`tmp/${fileString()}.png`), 'filename reserved');
    } catch (err) {
        console.error("Error checking files:\n" + err);
    }

    //parse xml into png file and send it
    const xml = req.body.xml;
    await sharp(Buffer.from(xml)).png().toFile(`tmp/${fileString()}.png`);
    res.download(path.resolve(`tmp/${fileString()}.png`), (err) => {
        if (err && res.headersSent) {
            //error sending the file
            res.status(500).end();
            console.error("An error has occurred sending the file:\n" + err);
        } else {
            //file sent successfully
            res.status(200).end();
            serverStats.imagesRendered++;
            //dispose of the file to save disk space
            try {
                if (fs.existsSync(path.resolve(`tmp/${fileString()}.png`))) {
                    fs.rmSync(path.resolve(`tmp/${fileString()}.png`));
                }
            } catch (err) {
                console.error("Error: cannot remove file:\n" + err);
            }
            //now that the file has been removed, log a successful completion
            console.log(`[${dateString(new Date())}] - successfully fulfilled request: ${req.body.logo}${req.body.color} (${dateString(startDate)})`);
        }
    });
});

//endpoint for status shield
app.get('/status', (req, res) => {
    const data = {
        "schemaVersion": 1,
        "label": "Server Status",
        "message": "online",
        "color": "green"
    }
    res.json(data);
    res.status(200).end();
});

//endpoint for images rendered shield
app.get('/rendered', (req, res) => {
    const data = {
        "schemaVersion": 1,
        "label": "Images Rendered",
        "message": serverStats.imagesRendered.toString(),
        "color": "9cf"
    }
    res.json(data);
    res.status(200).end();
});

//start https server
// const httpsServer = https.createServer({
//     key: process.env.SSL_KEY,
//     cert: process.env.SSL_CERT
// }, app);

/*
 * NOTE:
 * 
 * Cyclic automatically hosts with HTTPS, so the
 * deployment does not need to manually host with HTTPS
 * 
 * However if being hosted manually, it may be
 * neccesarry to set up an HTTPS server. If this is
 * required, uncomment line 8 and the above code on lines 91-94,
 * and replace 'app' with 'httpsServer' on line 108
 * 
*/

app.listen(process.env.PORT, () => {
    try {
        //load serverStats from JSON file if it exists
        if (fs.existsSync(path.resolve('serverstats.json')))
            serverStats = JSON.parse(fs.readFileSync(path.resolve('serverstats.json')));
        //ensure tmp directory is valid, if not create a new one
        if (!fs.existsSync(path.resolve('tmp'))) {
            fs.mkdirSync(path.resolve('tmp'));
            console.log('Created tmp directory');
        }
        //check if there are files in the tmp directory and log a warning if there are
        if (fs.readdirSync(path.resolve('tmp')).length !== 0) {  //falsy if empty
            console.warn("Warning: /tmp directory should be empty");
        }        
    } catch (err) {
        console.error("Error: cannot access FileSystem:\n" + err);
        return;
    }

    //log that the server has started
    console.log('Server Listening on port ' + process.env.PORT);
});

//on server shutdown save all important stats
process.on('exit', () => {
    try {
        fs.writeFileSync(path.resolve('serverstats.json'), JSON.stringify(serverStats));
    } catch (err) {
        console.error('Error: cannot save server stats:\n' + err);
    }
});