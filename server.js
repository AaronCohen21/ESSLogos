//dependencies
const sharp = require('sharp');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

//setup
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//handling requests
//req should contain the svg to be processed
app.post('/', async (req, res) => {
    const xml = req.body.xml;
    const date = new Date();
    console.log(`[${date.getMonth()}/${date.getDate()}/${date.getFullYear()} - ${date.getHours()}:${date.getMinutes()}] - recieved new request: ${req.body.logo}${req.body.color}`);

    //parse xml into png file
    await sharp(Buffer.from(xml)).png().toFile('tmp/logo.png');
    res.download(path.resolve('tmp/logo.png'));
    //now that the file is sent, remove it to save space
    try {
        if (fs.existsSync(path.resolve('tmp/logo.png'))) fs.rmSync(path.resolve('tmp/logo.png'));
    } catch (err) {
        console.log("Error: cannot remove file:\n" + err);
    }
});

//start server
app.listen(3000, () => {
    console.log('Server Listening on port 3000');
    try {
        if (!fs.existsSync(path.resolve('tmp'))) {
            fs.mkdirSync(path.resolve('tmp'));
            console.log('Created tmp directory');
        }
    } catch (err) {
        console.log("Error: cannot make /tmp directoryn:\n" + err);
        return;
    }
});