const mammoth       = require("mammoth");
const express       = require('express');
const fileUpload    = require('express-fileupload');
const md5           = require('md5');

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
app.use(function(req,res,next){
    let token = req.query.token || req.body.token || req.params.token || "";
    if(token === ""){
        res.send(403)
        return;
    }
    let date = new Date();
    let hash = md5(date.getUTCHours()) + md5(date.getUTCDate);
    if (token !== hash){
        res.send(403);
        return;
    }
    next();
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