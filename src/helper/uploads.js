const multer = require('multer');
const path = require('path');

// Function to configure Multer for file uploads
const configureMulter = (destinationFolder) => {
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, `src/uploads/${destinationFolder}/`); // Define destination folder
        },
        filename: function (req, file, cb) {
            cb(null, Date.now() + path.extname(file.originalname));
        }
    });

    //=====Multer upload configuration====//
    const upload = multer({
        storage: storage,
        limits: { fileSize: 1024 * 1024 * 10 } // Limit file size to 10MB
    }).single('image'); // Define field name for the image file

    // Return the upload function for use in other files
    return upload;
};

module.exports = { configureMulter };