import productsController from '../controllers/products.controllers.js';
import BaseRouter from "./router.js";
import { passportCall } from "../utils.js";

import uploader from "../services/uploader.js";

export default class ProductsRouter extends BaseRouter {
    init() {
        this.get('/', ['AUTH'], passportCall('jwt', {strategyType: 'jwt'}), productsController.getProducts);
        this.get('/:pid', ['AUTH'], passportCall('jwt', {strategyType: 'jwt'}), productsController.getProductId)
        this.post('/', ['ADMIN', 'PREMIUM'], passportCall('jwt', {strategyType: 'jwt'}), uploader('products').single('thumbnails'), productsController.setProduct)
        this.put('/:pid', ['ADMIN', 'PREMIUM'], passportCall('jwt', {strategyType: 'jwt'}), uploader('products').single('thumbnails'), productsController.updateProduct)
        this.delete('/:pid', ['ADMIN', 'PREMIUM'], passportCall('jwt', {strategyType: 'jwt'}), productsController.deleteProduct)
    }
}


