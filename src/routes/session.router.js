import BaseRouter from "./router.js";
import sessionsController from "../controllers/session.controllers.js";
import { userService } from '../services/repositories/index.js';
import { passportCall } from "../utils.js";

export default class SessionsRouter extends BaseRouter {
    init() {

		this.post('/register', ['NO_AUTH'], passportCall('register', { strategyType: "locals" }), sessionsController.setRegister);
		this.post('/login', ['NO_AUTH'], passportCall('login', { strategyType: "locals" }), sessionsController.setLogin);
		this.post('/forgot', ['NO_AUTH'], passportCall('jwt', { strategyType: "jwt" }), sessionsController.setForgot);
		this.post('/recovery', ['PUBLIC'], passportCall('jwt', { strategyType: "jwt" }), sessionsController.setRecovery);
		this.get("/logout", ['AUTH'], sessionsController.setLogout);
		this.get('/github', ['github'], passportCall('github', { strategyType: "github" }), (req, res) => {});
		this.get('/githubcallback', ['github'], passportCall('github', { strategyType: "github" }), sessionsController.setGitHubCall);
		//pedido especial
		this.get('/current', ['PUBLIC'], passportCall('jwt', {strategyType: 'jwt'}), async (req, res) => {
            try {  
				let token = null; 
				if(req&&req.cookies) {
					token = req.cookies['authToken'];
					res.sendSuccessWithPayload(req.cookies['authToken']);
				}				
            }
            catch (err) {
                console.log(err);
                //aunque en realidad existe un error prefiero mostrar 404
                res.status(404).render('error/404')
            } 
		});
		//creo el end solo para testeo y me borre el usuario que genero
		this.get("/test/drop", ['NO_AUTH'], sessionsController.deleteTest);
	}
}
