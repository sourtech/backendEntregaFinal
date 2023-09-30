import cartsControllers from "../controllers/carts.controllers.js";
import ticketController from "../controllers/ticket.controllers.js";
import BaseRouter from "./router.js";
import { passportCall } from "../utils.js";

export default class CartsRouter extends BaseRouter {
    init() {
        this.get('/', ['AUTH'], passportCall('jwt', { strategyType: 'jwt' }), cartsControllers.getCarts)
        this.get('/view/my', ['AUTH'], passportCall('jwt', { strategyType: 'jwt' }), cartsControllers.getCart)
        this.get('/:cid', ['AUTH'], passportCall('jwt', { strategyType: 'jwt' }), cartsControllers.getCartById)
        this.post('/', ['AUTH'], passportCall('jwt', { strategyType: 'jwt' }), cartsControllers.setCart)
        this.post('/:cid/product/:pid', ['AUTH'], passportCall('jwt', { strategyType: 'jwt' }), cartsControllers.setProductInCart)
        this.get('/add/:id', ['USER'], passportCall('jwt', {strategyType: 'jwt'}), cartsControllers.setAddProduct)
        this.get('/remove/all', ['AUTH'], passportCall('jwt', {strategyType: 'jwt'}), cartsControllers.removeAll)
        this.get('/remove/:id', ['AUTH'], passportCall('jwt', {strategyType: 'jwt'}), cartsControllers.removeProduct)     
        this.get('/:cid/purchase/', ['USER'], passportCall('jwt', {strategyType: 'jwt'}), ticketController.createTicket)
    }
}

