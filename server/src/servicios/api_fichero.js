const multer = require('multer');
const path = require("path"); 
// Multer config
module.exports = multer({
  storage: multer.diskStorage({}),
  fileFilter: (req, file, cb) => {
    let ext = path.extname(file.originalname);
      if (ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png" && ext !== ".PNG" && ext !== ".mp4") {
      cb(new Error("File type is not supported"), false);
      return;
    }
    cb(null, true);
  },
});
// const direct = __dirname.replace(`${path.sep}src${path.sep}servicios`,'');
// let storage = multer.diskStorage ({
//   destination: (req, file, cb) => {
//     cb(null,direct + '/archivos/'+req.headers.destino);
//   },
//   filename: (req, file, cb) =>{
//     let ext = path.extname(file.originalname);
//     cb(null, `${Date.now()}${ext}`);
//   }
// })
// const upload = multer({storage});
// module.exports = upload;

// const methoOverride = require('method-override');
// const GridFsStorage = require('multer-gridfs-storage');
// const crypto = require('crypto');
// const path = require('path');
// require('dotenv').config({path:'./server/variables.env'})
// const URI = process.env.DB_URL;
// const storage = new GridFsStorage({
//   url: URI,
//   file: (req, file) => {
//     return new Promise((resolve, reject) => {
//       crypto.randomBytes(16,(err, buf) => {
//         if (err) {
//           return reject(err);
//         }
//         const filename = buf.toString('hex') + path.extname(file.originalname);
//         const fileInfo = {
//           filename: filename,
//           bucketName: 'uploads'
//         };
//         resolve(fileInfo);
//       })
//     })
//   }
// })

