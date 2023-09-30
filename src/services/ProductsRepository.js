
export default class ProductRepository {

    constructor(dao){
        this.dao = dao;
    }

    getProducts = (options, req, paginate) => {
        return this.dao.getProducts(options, req, paginate);
    }
    
    getProds = () => {
        return this.dao.getProds();
    }  

    getProductById = (id) => {
        return this.dao.getProductById(id)
    }

    addProduct = (product) => {
        return this.dao.addProduct(product)
    }

    updateProduct = (id, product) => {
        return this.dao.updateProduct(id,product)
    }

    deleteProduct = (id) => {
        return this.dao.deleteProduct(id)
    }
/*
    downStock = (id, product) => {
         return this.dao.downStock(id, product)
    }
*/
}