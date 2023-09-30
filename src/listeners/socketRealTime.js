import ProductManager from '../dao/mongo/managers/productManager.js';

/* DEBERIA PASARLO A REPOSITORY POR EL MOMENTO QUEDA ASI */

const manager = new ProductManager();    

export default function socketRealTime(io){
    io.on('connection', async socket => {
        console.log("cliente conectado");        
        const products = await manager.getProducts();
        
        //listado de productos
        socket.emit('products', products.docs);

        //borrado de un producto
        socket.on('delete', async pid => {
            //console.log(pid);
            const result = await manager.deleteProduct(pid); 
            const products = await manager.getProducts();
            return socket.emit('products',  products.docs);                       
        });
        
        //agregar
        socket.on('add', async product => {
            try {       
                product.status = product.status==1 ? true : false; 
                product.thumbnails = []; // por ahora no recibo imagenes                   
                const result = await manager.addProduct(product); 
                const products = await manager.getProducts();
                return socket.emit('products',  products.docs);               
            }
            catch (err) {
                console.log(err);
            }
            
        });

        //console.log(products);
    }) 
}
