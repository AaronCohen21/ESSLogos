//dependencies
const sharp = require('sharp');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const { setMaxIdleHTTPParsers } = require('http');

//setup
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
const serverStats = {
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
    const fileString = () => dateString(startDate).replaceAll('/','-') + (fileIteration !== 0 ? ` (${fileIteration})` : '');
    try {
        //update iteration until the filename doesn't exist
        while(fs.existsSync(path.resolve(`tmp/${fileString()}.png`))) fileIteration++;
        //now create the file immediately to 'reserve the filename'
        fs.writeFileSync(path.resolve(`tmp/${fileString()}.png`), 'filename reserved');
    } catch (err) {
        console.log("Error checking files:\n" + err);
    }

    //parse xml into png file and send it
    const xml = req.body.xml;
    await sharp(Buffer.from(xml)).png().toFile(`tmp/${fileString()}.png`);
    res.download(path.resolve(`tmp/${fileString()}.png`), (err) => {
        if (err && res.headersSent) {
            //error sending the file
            res.status(500).end();
            console.log("An error has occurred sending the file:\n" + err);
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
                console.log("Error: cannot remove file:\n" + err);
            }
            //now that the file has been removed, log a successful completion
            console.log(`[${dateString(new Date())}] - successfully fulfilled request: ${req.body.logo}${req.body.color} (${dateString(startDate)})`);
        }
    });
});

//TODO: impliment this
app.get('/status', (req, res) => {
    const data = {
        status: 'online',
        imagesRendered: serverStats.imagesRendered
    }
    res.send(JSON.stringify(data));
    res.status(200).end();
});

//start server
app.listen(3000, () => {
    //ensure tmp directory is valid, if not create a new one
    try {
        if (!fs.existsSync(path.resolve('tmp'))) {
            fs.mkdirSync(path.resolve('tmp'));
            console.log('Created tmp directory');
        }
    } catch (err) {
        console.log("Error: cannot make /tmp directoryn:\n" + err);
        return;
    }

    //TODO: check if there are files in the tmp directory and log a warning if there are 
    
    //TODO: load proper number of imagesRendered

    //log that the server has started
    console.log('Server Listening on port 3000');
});

//TODO: make method that runs on server shutdown to save all important stats (imagesRendered)