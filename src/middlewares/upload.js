const multer = require('multer');
const path = require('path');
const fs = require('fs');

const UPLOADS_DIR = path.join(__dirname, '..', '..', 'uploads');
const FILE_SIZE_LIMIT = 5 * 1024 * 1024;
const FORMAT_ERROR = 'Image format not allowed (only .png)';
const ALLOWED_FORMATS = /\.(png|jpg|jpeg)$/;
const ALLOWED_MIMETYPE = /^image\/(png|jpg|jpeg)$/;

if(!fs.existsSync(UPLOADS_DIR)){
    fs.mkdirSync(UPLOADS_DIR, { recursive: true});
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, UPLOADS_DIR);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const tempName = Date.now() + ext;
        cb(null, tempName);
    }
});

const fileFilter = (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const mime = file.mimetype.toLowerCase();

    if(ALLOWED_FORMATS.test(ext) && ALLOWED_MIMETYPE.test(mime)){
        cb(null, true);
    } 
    else {
        cb(new Error(FORMAT_ERROR));
    }
}

const limits = {
    fileSize: FILE_SIZE_LIMIT
};

const upload = multer({
    storage,
    fileFilter,
    limits
});

module.exports = upload;