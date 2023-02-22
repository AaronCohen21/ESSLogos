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
    console.log('recieved new request');

    //parse xml into png file
    await sharp(Buffer.from(xml)).png().toFile('tmp/logo.png');
    res.download(path.resolve('tmp/logo.png'));
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