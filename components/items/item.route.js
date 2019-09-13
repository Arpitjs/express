const router = require('express').Router()
const ItemController = require('./item.controller')
const authorize = require('./../../middlewares/authorize')
const multer = require('multer')
// var upload = multer({dest: 'uploads/'}) 
let myStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/images/')
    },
    filename: function (req, file, cb) {
        cb(null, new Date().getTime() + '-' + file.originalname)
    }
})
// function filter(req,file,cb){
//     var mimeType = file.mimetype.split('/')[0];
//     if (mimeType != 'image') {
//         req.fileError = true
//     cb(null, false)
// }else{
//     cb(null, true)
// }
// }

let upload = multer({
    storage: myStorage,
    //fileFilter: filter
})
router.get('/', ItemController.find)
router.post('/', upload.single('file'), ItemController.insert)

router.route('/:id')
    .get(ItemController.findById)
    .put(upload.single('file'), ItemController.update)
    .delete(ItemController.remove)

    router.route('/search')
    .get(ItemController.searchByGet)
    .post(ItemController.searchByPost)

module.exports = router