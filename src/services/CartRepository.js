
export default class CartRepository {
    constructor(dao){
        this.dao = dao;
    }
    createCart = () => {
        return this.dao.createCart();
    }

    getCarts = () => {
        return this.dao.getCarts();
    }

    getCartById = (cid) => {
        return this.dao.getCartById(cid)
    }

    addCart = (cart) => {
        return this.dao.addCart(cart)
    }

    addProduct = (cid, nuevo) => {
        return this.dao.addProduct(cid, nuevo)
    }

    addProductNew = (cid, nuevo) => {
        return this.dao.addProductNew(cid, nuevo)
    }


    removeAll = (cid) => {
        return this.dao.removeAll(cid)
    }

    removeProduct= (cid, productId) => {
        return this.dao.removeProduct(cid, productId)
    }
    
    deleteUsers = (id) => {
        return this.dao.deleteUsers(id)
    }
}