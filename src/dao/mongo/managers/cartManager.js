import cartModel from "../models/carts.js";


export default class CartManager { 

    createCart = () => cartModel.create({products:[]});

    addCart = (nuevo) => {
        //por el momento no voy a validar nada del produco
        //es solo para poder usar mongo y comprobar que todo funcione
        return cartModel.create(nuevo);
    }; 
    
    getCarts = async (params) => {
        try {
            return await cartModel.find(params).lean();
        } catch (err) {
            console.log(err);
        }
    };       

    getCartById = async (cartId) => {
        try {
            const result = await cartModel.findOne({ _id: cartId }).lean();  
            //console.log(result);

            //result.products.forEach(product => console.log(product));
            return result;
        } catch (err) {
            return err
        }

    }     

    addProduct = async (id, nuevo) => {       
        const cart = await this.getCartById(id)

        const find = cart.products.findIndex(product => product._id._id.toString() === nuevo._id);

        if (find !== -1) {
            cart.products[find].quantity = Number(cart.products[find].quantity) + nuevo.quantity;
        }else{           
            cart.products.push(nuevo);
        }
        //actualizo
        const updated = await cartModel.findByIdAndUpdate(id, { $set: cart })
        //devuelvo el carro completo
        return this.getCartById(id);

    };  
    
    addProductNew = async (id, nuevo) => { 
        //actualizo
        const updated = await cartModel.findByIdAndUpdate(id, { $set: nuevo })
        return updated;

    };    
    
    removeProduct = async (id, idProduct) => {       
        const cart = await this.getCartById(id);

        const find = cart.products.findIndex(product => product._id._id.toString() === idProduct);

        if (find === -1) {
            return false;
        }
        cart.products.splice(find, 1);
        //actualizo
        const updated = await cartModel.findByIdAndUpdate(id, { $set: cart })
        return true;

    };      

    removeAll = async (id) => {       
        const cart = await this.getCartById(id);
        //borro todos los productos, pero dejo el ID del cart por ahora
        cart.products = [];
        const updated = await cartModel.findByIdAndUpdate(id, { $set: cart })
        return true;

    };     
    
    deleteUsers = (id) => {
        return cartModel.findByIdAndDelete(id);
    };
}