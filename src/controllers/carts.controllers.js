import { cartService, productService } from '../services/repositories/index.js';

const getCarts = async (req, res) => {
    try {
        const result = await cartService.getCarts();
        //console.log(result);
        if (result.status === 'error'){
            return res.status(400).send({ result });
        }
        return res.status(200).send({ result });
    } catch (err) {
        req.logger.error(err);
    }
}

const getCart = async (req, res) => {
    try {
        const cid = req.user.cart;
        const result = await cartService.getCartById(cid);
        if (result.status === 'error'){
            return res.status(400).send({ result });
        }
        return res.sendSuccessWithPayload(result);
    } catch (err) {
        req.logger.error(err);
    }    
}

const getCartById = async (req, res) => {
    try {
        const cid = req.params.cid;
        const result = await cartService.getCartById(cid);
        return res.status(200).send(result);
    } catch (err) {
        req.logger.error(err);
    }    
}

const setCart = async (req, res) => {
    try {
        const cart = req.body;
        /*falta validar que llegue correctamente*/
        const result = await cartService.addCart(cart);

        if (res.status === 'error'){
            return res.status(400).send(result);
        }
        return res.status(200).send(result);
    }
    catch (err) {
        req.logger.error(err);
    }
}

const setProductInCart = async (req, res) => {
    try {
        const cid = req.params.cid;
        const pid = req.params.pid;
        //console.log(pid);
        const quantity = req.body; //quantity: debe contener el número de ejemplares de dicho producto. El producto, de momento, se agregará de uno en uno.

        const nuevo = {
            _id:pid, 
            quantity:quantity.quantity
        };
        const result = await cartService.addProduct({ _id: cid }, nuevo);
        return res.status(200).send(result);
    }
    catch (err) {
        req.logger.error(err);
    }       
}

const setAddProduct = async (req, res) => {
    const productId = req.params.id;

    //traigo el producto
    const product = await productService.getProductById({ _id: productId });

    if(!product){
        return res.sendInternalError("El producto no existe");
    }
    //compruebo si es premium y el producto es de el
    if(req.user.role==='premium' && product.owner===req.user.email){
        return res.sendInternalError("No puede agregar productos que te pertenecen");
    }
    //todo en orden
    //EL ID del carrito ahora lo tiene el usuario
    const cid = req.user.cart; 
    //console.log(cid);
    const nuevo = {
        _id:productId, 
        quantity:1
    };
    const result = await cartService.addProduct({ _id: cid }, nuevo);
    //res.redirect('/cart');   
    if(result){
        res.sendSuccessWithPayload({message: 'Producto agregado a tu carrito', redirect: '/cart'});
    } 

}

const removeAll = async (req, res) => {
    const cid = req.user.cart;     
    const result = await cartService.removeAll({ _id: cid });
    if(result){
        return res.redirect('/cart');
    }
    //si no existe el producto lo mando a home
    //a futuro pondre un aviso
    res.redirect('/'); 
}

const removeProduct = async (req, res) => {
    const productId = req.params.id;

    //EL ID por el momento es siempre este
    //const cid = '6471261cc14d2ac4b71e7463'; 
    //EL ID del carrito ahora lo tiene el usuario
    const cid = req.user.cart;             

    const result = await cartService.removeProduct({ _id: cid }, productId);
    if(result){
        return res.sendSuccessWithPayload({message: 'Producto eliminado', redirect: '/cart'});
    }
    //si no existe el producto lo mando a home
    //a futuro pondre un aviso
    return res.sendInternalError("Error al eliminar");
}


export default {
    getCarts,
    getCart,
    getCartById,
    setCart,
    setProductInCart,
    setAddProduct,
    removeAll,
    removeProduct
}