const mammoth = require("mammoth");
const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

// default options
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/',
    limits: { fileSize: 10 * 1024 * 1024 },
})
)
app.get('/', function (req, res) {
    res.send("hello")
})
app.post('/upload', function (req, res) {
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }

    let sampleFile = req.files.file;
    let path = sampleFile.tempFilePath;
    mammoth.convertToHtml({ path:path})
    .then(function (result) {
        var html = result.value; 
        res.send(html);
    })
    .done();
   
});


app.listen(8888, () => console.log(`Example app listening on port 8888`))