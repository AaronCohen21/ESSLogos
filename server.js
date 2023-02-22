//dependencies
const sharp = require('sharp');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

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

    //parse xml
    //const parsed = new xmldom.DOMParser().parseFromString(xml, 'text/xml');
    const buf = await sharp(Buffer.from(xml)).png().toBuffer({resolveWithObject: true});
    console.log(buf);
    //send the png buffer
    res.send(JSON.stringify(buf.data));
});

//start server
app.listen(3000, () => {
    console.log('Server Listening on port 3000');
});