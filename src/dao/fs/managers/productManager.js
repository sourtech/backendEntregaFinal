import fs from 'fs';

export default class ProductManager {

    constructor(file){
        //this.lastID = 1;
        this.products = [];   
        this.path = file;
    }   

    #lastID = () => {
        const newID  = this.products.length > 0 ? this.products[this.products.length - 1].id + 1 : 1;
        return newID;
    }; 
    
    #saveFile = async () => {
        try {
            const toJSON = JSON.stringify(this.products, null, 2);
            await fs.promises.writeFile(this.path, toJSON)
            return null;
        }
        catch (err) {
            return console.log(err);

        }
    };    
    
    addProduct = async(nuevo) => {
        try {        
            //valido que todos los campos esten cargados
            if(!nuevo.title || !nuevo.description || !nuevo.price || !nuevo.code || !nuevo.stock || !nuevo.category){
                console.log(" Todos los campos son obligatorios, a excepción de thumbnails");
                return null;
            }
            //por default status es true;
            if (typeof nuevo.status === 'undefined') {
                 nuevo.status = true;
            }            

            //traigo el archivo de productos
            this.products = await this.getProducts();

            //compruebo que el campo code no exista
            
            if(this.products.find(p => p.code === nuevo.code)){
                return { status: 'error', message: `El codigo ya existe ${nuevo.code}`};
            }
            //nuevo ID
            //nuevo.id = this.lastID++;        
            nuevo.id = this.#lastID();

            //agrego el nuevo producto
            this.products.push(nuevo);
            //guardo
            await this.#saveFile();
            return { status: 'success', message: `Nuevo producto agregado con exito!`};
        }
        catch (err) {
            return { status: 'error', message: err.message };
        }        
    }

    getProducts = async () => {
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
        //console.log(`el archivo no existe`);
        return [];//devuelvo un arreglo vacio
    };

    getProductById = async (id) =>{
        //traigo el archivo de productos
        this.products = await this.getProducts();
        //console.log(id);
        const product = this.products.find(p => p.id === id);
        if(product){
            //console.log(product);
            return product;
        }
        console.log("Not found ID:" + id);
        return null;
    }

    updateProduct = async (id, prodUpdate) => {
        
        try {
            //traigo el archivo de productos pero ahora en una variable local
            const products  = await this.getProducts();

            //busco el indice para comprobar si existe
            const index = products.findIndex(p => p.id === id);

            if (index < 0) {
               // console.log(`No exists: ${id}`)
                //return null
                return { status: 'error', message: `No existe el ID: ${id}`};
            }

            //recorro con map y si es el ID con assign cambio el valor
            this.products = products.map(element => {
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

    deleteProduct = async (id) => {        
        try {
            //traigo el archivo de productos pero ahora en una variable local
            const products  = await this.getProducts();

            //busco el indice para saber si existe el proudcto
            const index = products.findIndex(p => p.id === id);

            if (index < 0) {
               // console.log(`No exists: ${id}`)
                //return null
                return { status: 'error', message: `No existe el ID: ${id}`};
            }

            //recorro los productos que no sean ese id
            products.forEach(e => {
                if(e.id !== id){
                    this.products.push(e)
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
    
}