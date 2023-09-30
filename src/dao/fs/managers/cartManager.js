import fs from 'fs';
import ProductManager from '../components/productManager.js';

import __dirname from '../utils.js';

const productM = new ProductManager(`${__dirname}/data/products.json`);


export default class CartManager {

    constructor(file){
        this.carts = [];   
        this.path = file;
    }   

    #lastID = () => {
        const newID  = this.carts.length > 0 ? this.carts[this.carts.length - 1].id + 1 : 1;
        return newID;
    }; 
    
    #saveFile = async () => {
        try {
            const toJSON = JSON.stringify(this.carts, null, 2);
            await fs.promises.writeFile(this.path, toJSON)
            return null;
        }
        catch (err) {
            return console.log(err);

        }
    };    

    addCart = async(nuevo) => {
        try {
            //compruebo si existe todo los productos que quiere agregar
            for (let prod of nuevo.products) {
                let result = await productM.getProductById(prod.id);
                if(!result){
                    return { status: 'error', message: `El producto ${prod.id} no existe`};
                }
            }            

            //traigo el archivo de carritos
            this.carts = await this.getCarts();

            //nuevo ID   
            nuevo.id = this.#lastID();

            //agrego el nuevo producto
            this.carts.push(nuevo);   
            
            await this.#saveFile();

            return { status: 'success', message: `Nuevo carrito creado!`};      


        }
        catch (err) {
            return { status: 'error', message: err.message };
        }        
    }

    getCarts = async () => {
        //compruebo si el archivo ya existe
        if (fs.existsSync(this.path)) {
            try {
                const readFile = await fs.promises.readFile(this.path, 'utf-8');
                return JSON.parse(readFile)
            }
            catch (error) {
                console.log(error);
                return null;
            }
        }
        return { status: 'error', message: `No existen carritos aun`};
    };

    getCartById = async (id) =>{
        //traigo el archivo de productos
        this.carts = await this.getCarts();
        
       // console.log(this.carts);
        const cart = this.carts.find(p => p.id === id);
        //console.log(cart);
        if(cart){
            return cart;
        }
        return { status: 'error', message: `No existe el ID: ${id}`};
    }

    addProduct = async (id, nuevo) => {
        try {
            //console.log(nuevo);
            //compruebo si existe el producto       
            let result = await productM.getProductById(nuevo.id);
            //console.log(result);
            if(!result){
                return { status: 'error', message: `El producto ${nuevo.id} no existe`};
            }
              
            const cart = await this.getCartById(id);
            console.log(cart);
            if (cart.status === 'error') {
                return cart;//devuelvo el error completo status ,message
            }

            const find = cart.products.findIndex(product => product.id === nuevo.id);

            if (find !== -1) {
                cart.products[find].quantity = Number(cart.products[find].quantity) + nuevo.quantity;                
            }else{
                cart.products.push(nuevo);
            }
            
            //recorro con map y si es el ID con assign cambio el valor
            this.carts.map(element => {
                if(element.id == id){
                    element = Object.assign(element, cart);
                    return element
                }
                return element
            });              
            console.log(this.carts);
            await this.#saveFile();
            return { status: 'success', message: 'Carrito actualizado!'};            
        }
        catch (err) {
            console.log(err.message);
            return { status: 'error', message: err.message };
        }
    }    


/*
    updateProduct = async (id, prodUpdate) => {
        
        try {
            //traigo el archivo de productos pero ahora en una variable local
            const carts  = await this.getProducts();

            //busco el indice para comprobar si existe
            const index = carts.findIndex(p => p.id === id);

            if (index < 0) {
               // console.log(`No exists: ${id}`)
                //return null
                return { status: 'error', message: `No existe el ID: ${id}`};
            }

            //recorro con map y si es el ID con assign cambio el valor
            this.carts = carts.map(element => {
                if(element.id == id){
                    element = Object.assign(element, prodUpdate);
                    return element
                }
                return element
            })  
            
            //guardo
            await this.#saveFile();
            return { status: 'success', message: 'Producto actualizado!'};
        }
        catch (err) {
            return console.log(err);
        }
        
    }    
*/
/*
    deleteProduct = async (id) => {        
        try {
            //traigo el archivo de productos pero ahora en una variable local
            const carts  = await this.getProducts();

            //busco el indice para saber si existe el proudcto
            const index = carts.findIndex(p => p.id === id);

            if (index < 0) {
               // console.log(`No exists: ${id}`)
                //return null
                return { status: 'error', message: `No existe el ID: ${id}`};
            }

            //recorro los productos que no sean ese id
            carts.forEach(e => {
                if(e.id !== id){
                    this.carts.push(e)
                }
            })        

            //guardo
            await this.#saveFile();
            return { status: 'success', message: 'Producto eliminado!'};
        }
        catch (err) {
            return console.log(err);
        }
    }  
    */
}