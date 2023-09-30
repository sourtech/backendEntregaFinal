import { passportCall } from "../utils.js";
import viewsControllers from '../controllers/views.controllers.js';
import mocksControllers from '../controllers/mocks.controllers.js';
import BaseRouter from "./router.js";

export default class ViewsRouter extends BaseRouter {

    init() {
        this.get('/', ['PUBLIC'], passportCall('jwt', {strategyType: 'jwt'}), viewsControllers.getHome);
        this.get('/realtimeproducts', ['PUBLIC'], passportCall('jwt', {strategyType: 'jwt'}), viewsControllers.getRealTime);
        this.get('/products', ['LOGIN'], passportCall('jwt', {strategyType: 'jwt'}), viewsControllers.getProducts);
        this.get("/login", ['NO_AUTH'], passportCall('jwt', {strategyType: 'jwt'}), viewsControllers.getLogin);
        this.get("/forgot", ['NO_AUTH'], passportCall('jwt', {strategyType: 'jwt'}), viewsControllers.getForgot);
        this.get("/register", ['NO_AUTH'], passportCall('jwt', {strategyType: 'jwt'}), viewsControllers.getRegister);
        this.get("/recovery", ['PUBLIC'], passportCall('jwt', {strategyType: 'jwt'}), viewsControllers.getRecovery);
        this.get("/chat", ['USER'], passportCall('jwt', {strategyType: 'jwt'}), viewsControllers.getChat);
        this.get('/profile', ['AUTH'], passportCall('jwt', {strategyType: 'jwt'}), viewsControllers.getProfile);  
        this.get("/cart", ['USER'], passportCall('jwt', {strategyType: 'jwt'}), viewsControllers.getCart); 
        //Mocking
        this.get("/mockingproducts", ['PUBLIC'], mocksControllers.getProducts); 
        //Logger, no pongo controllers 
        this.get('/loggerTest', ['PUBLIC'], (req, res) => {
             req.logger.info(req.method);
             req.logger.fatal('Error Fatal');
             req.logger.error('Error Error');
             req.logger.warning('Error Warning');
             req.logger.info('Error Info');
             req.logger.http('Error http');
             req.logger.debug('Error Debug');

             res.sendStatus(200);
        })
        this.get("/documents", ['USER'], passportCall('jwt', {strategyType: 'jwt'}), viewsControllers.getDocument);
        //Administrador de productos
        this.get("/admin/products", ['ADMIN', 'PREMIUM'], passportCall('jwt', {strategyType: 'jwt'}), viewsControllers.adminProducts); 
        this.get("/admin/products/add", ['ADMIN', 'PREMIUM'], passportCall('jwt', {strategyType: 'jwt'}), viewsControllers.adminProductsAdd);
        this.get("/admin/products/edit/:pid", ['ADMIN', 'PREMIUM'], passportCall('jwt', {strategyType: 'jwt'}), viewsControllers.adminProductsEdit); 
        this.get("/admin/users", ['ADMIN'], passportCall('jwt', {strategyType: 'jwt'}), viewsControllers.adminUsers); 
        this.get("/admin/users/edit/:uid", ['ADMIN'], passportCall('jwt', {strategyType: 'jwt'}), viewsControllers.adminUsersEdit);
        this.get('/forbidden', ['PUBLIC'], (req, res) => {res.status(404).render('error/forbidden',{user: req.user})}) 
        //si no existe la pagina lo mando a 404
        this.get("*", ['PUBLIC'], (req, res) => {res.status(404).render('error/404',{user: req.user})})
    }
}