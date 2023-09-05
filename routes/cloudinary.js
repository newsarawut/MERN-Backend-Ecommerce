const express = require("express");
const router = express.Router();

//controller
const { createImage, removeImage } = require('../controllers/cloudinary')

//moddleware
const { auth, adminCheck } = require('../middleware/auth')


//@Endpoint   http://localhost:5000/api/images
router.post('/images', auth, adminCheck, createImage);
router.post('/removeimages', auth, adminCheck, removeImage);


module.exports = router;