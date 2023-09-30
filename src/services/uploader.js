import multer from "multer";
import __dirname from "../utils.js";

const upload = (folderName) => {
    return multer({
      storage: multer.diskStorage({
        destination:function(req,file,cb){
            cb(null,`${__dirname}/public/img/${folderName}/`)
        },
  
        filename: function(req,file,cb){
            cb(null,`${Date.now()}-${file.originalname}`)
        }
      })
    })
  }
  /*
const storage = multer.diskStorage({
    //Carpeta
    destination:function(req,file,cb){
        cb(null,`${__dirname}/public/img/products`)
    },
    filename: function(req,file,cb){
        cb(null,`${Date.now()}-${file.originalname}`)
    }
})
*/
//const uploader = multer({storage});

export default upload;