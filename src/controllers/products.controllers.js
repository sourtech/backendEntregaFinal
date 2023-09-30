import sharp from "sharp";
import { productService, cartService } from '../services/repositories/index.js';
//

//control de errores
import ErrorService from "../services/errors/CustomError.js";
import { productErrorIncomplete } from "../services/errors/productErrors.js";
import EErrors from "../services/errors/EErrors.js";

import MailService from '../services/MailService.js';
import Dtemplates from "../constants/DTemplates.js";

import __dirname from "../utils.js";

const getProducts = async (req, res) => {
    //limit puede llegar como query string
    const limit = req.query.limit;

    // traigo todos los productos
    const products = await productService.getProducts();

    //si tengo limit y es numerico
    if(limit && limit.match(/^[0-9]+$/) != null){
        //si el limit es superior a la cantidad no importa, muestro los que tengo
        //NUEVO
        //en la sigiente etapa el limit lo tengo que hacer directamente en MONGO no traer todo y luego limitar
        const limitProducts = products.docs.slice(0, limit);
        return res.send(limitProducts);
    }
    // sin limit
    return res.status(200).send({ products });
}

const getProductId = async (req, res) => {
    try {    
        const pid = req.params.pid;

        const product = await productService.getProductById({ _id: pid });
        if(!product){
            return res.status(400).send({ status: 'error', message: 'No se encuentra el producto con ese ID' });
        }
        return res.send(product)
    }
    catch (err) {
        req.logger.error(err);
    } 
}

const setProduct = async (req, res) => {
    const product = req.body;
    //todos los campos son obligatorios, menos estatus default false
    if (!product.title||!product.description||!product.code||!product.price||!product.stock||!product.category) {
        //genero el error PARA EL SERVIDOR            
        ErrorService.createError({
            name:"Todos los campos son obligatorios",
            cause: productErrorIncomplete(product),//uso mi diccionario
            message: 'Error intentando insertar un nuevo producto',
            code: EErrors.INCOMPLETE_VALUES,
            status:400
        })
        //va a salir por el try catch del applyCallbacks router.js
    }
    product.price = Number(product.price)
    product.stock = Number(product.stock)
    product.status = (product.status) ? true : false;   
    if (isNaN(product.price) || product.price<1){
        return res.sendInternalError('Controle el precio que sea mayor a cero');            
    } 
    if (isNaN(product.stock) || product.stock<0){
        return res.sendInternalError('Controle el stock');
    }
    //que el codigo no exista
    const products = await productService.getProds();
    const foundCode = products.find(o => o.code === product.code);
    if(foundCode){
        return res.sendInternalError('El codigo de producto ya existe');
    }
    //Nueva funcion si es admin o un usuario premium
    product.owner = req.user.role == "admin" ? "admin" : req.user.email;
    const result = await productService.addProduct(product);
    if (result.status === 'error'){
        return res.sendErrorWithPayload({ result });
    }
    return res.sendSuccessWithPayload({ result })
}

const updateProduct = async (req, res) => {
    try {
        const pid = req.params.pid;
        const product = req.body;

        //compruebo que id este bien formo
        if (!pid.match(/^[0-9a-fA-F]{24}$/)) {
            return res.sendBadRequest('El id no es correcto');
        }
        //Traigo el producto de la base
        const productNow = await productService.getProductById({ _id: pid });
        if(!productNow){
            return res.sendBadRequest('El producto no existe');
        }
        //si el usuario es premium tengo que validar que el producto sea de el
        if(req.user.role=='premium' && productNow.owner!=req.user.email){
            return res.sendErrorWithPayload('No tienes permisos para editar el producto')        
        }
        //Nueva funcion si es admin o un usuario premium
        product.owner = req.user.role == "admin" ? "admin" : req.user.email;

        if(req.file){
            product.thumbnail = [req.file.filename];
            //creo los recortes 
            sharp(req.file.path)
                .resize(600,400, { fit:  "contain" })
                .toFile(`${__dirname}/public/img/products/600x400_${req.file.filename}`);
            sharp(req.file.path)
                .resize(400,600, { fit:  "contain" })
                .toFile(`${__dirname}/public/img/products/400x600_${req.file.filename}`);
        }
        product.price = Number(product.price)
        product.stock = Number(product.stock)
        product.status = (product.status) ? true : false;   
        if (isNaN(product.price) || product.price<1){
            return res.sendInternalError('Controle el precio que sea mayor a cero');            
        } 
        if (isNaN(product.stock) || product.stock<0){
            return res.sendInternalError('Controle el stock');
        }

        if (!product.title ||
            !product.description ||
            !product.price ||
            !product.code ||
            !product.category){
                return res.sendInternalError('Todos los campos son obligatorios');
            }
    
        //console.log(product)
        const result = await productService.updateProduct(pid, product);
        if (result.status === 'error'){
            return res.sendErrorWithPayload({ result });
        }
        return res.sendSuccessWithPayload({ result })
    }
    catch (err) {
        req.logger.error(err);
    }
}

const deleteProduct = async (req, res) => {
    try {
        const pid = req.params.pid;

        //compruebo que id este bien formo
        if (!pid.match(/^[0-9a-fA-F]{24}$/)) {
            return res.sendBadRequest('El id no es correcto');
        }
        //Traigo el producto de la base
        const productNow = await productService.getProductById({ _id: pid });
        if(!productNow){
            return res.sendBadRequest('El producto no existe');
        }
        //si el usuario es premium tengo que validar que el producto sea de el
        if(req.user.role=='premium' && productNow.owner!=req.user.email){
            return res.sendErrorWithPayload('No tienes permisos para borrar el producto')        
        }
        //ya esta en condiciones de ser borrado, si es de un usuario le aviso
        if (req.user.role=='admin' && productNow.owner && productNow.owner!='admin') {
            const mailService = new MailService();
            const objMail = {
                productName : productNow.title
            }
            const send = await mailService.sendMail(productNow.owner, Dtemplates.DELETE,objMail);
          }
        //ya se puede borrar el producto, antes controlo que no exista en algun carrito
        const carts = await cartService.getCarts();
        if(carts){
            for (let i = 0; i < carts.length; i++) {
                await cartService.removeProduct({ _id: carts[i]._id }, pid);
            };
        }
        //ahora si ya puedo borrar
        const result = await productService.deleteProduct(pid);
        if (result.status === 'error'){
            return res.sendErrorWithPayload({ result });
        }
        return res.sendSuccessWithPayload('Producto eliminado')
        
    } catch (err) {
        req.logger.error(err);
    }
}

export default {
    getProducts,
    getProductId,
    setProduct,
    updateProduct,
    deleteProduct
}