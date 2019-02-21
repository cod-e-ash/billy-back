const express = require('express');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const config = require('config');
const r = require('request');

// Create PATH
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, 'bills'))
    }, 
    filename: function (req, file, cb) {
        const name = path.parse(file.originalname).name;
        const ext = path.parse(file.originalname).ext;
        cb(null, name + '-' + Date.now() + ext);
    }
});

function imageFilter(req, file, cb) {
    const extension = path.extname(file.originalname).toLowerCase();
    const mimetyp = file.mimetype;
    if (extension !== '.jpg' && extension !== '.jpeg' && extension !== '.png' &&
       mimetyp !== 'image/png' && mimetyp !== 'image/jpg' && mimetyp !== 'image/jpeg') {
        return cb('Only images allowed!', false);
    }
    cb(null, true);
}

// Set multer options
const files = multer({storage: storage, fileFilter: imageFilter});

// Get API Key
const api_key = config.get('ocr_api_key');

const router = express.Router();

router.get('', async (req,res) => {
    fs.readdir(billsFolder, (err, files) => {
        res.send(files);
    });
});

router.post('', files.single('bill'), async (req, res) => {
    if (!req.file) {
       return res.send('Error uploading file');
    }

    const data = {
        custom_file: {
            value:  fs.createReadStream(path.join(__dirname, 'bills', req.file.filename)),
            options: {
            filename: 'topsecret.jpg',
            contentType: 'image/jpeg'
            }
        },
        isTable: "true"
    }
    
    r.post({headers: {apiKey: api_key} ,url:'https://api.ocr.space/parse/image', formData: data}, (err, httpResponse, body) => {
        if (err) return res.send('Error Parsing Image', err);
        return res.status(200).json(body);
    });
});

module.exports = router;