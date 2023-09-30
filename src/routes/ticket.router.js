import BaseRouter from "./router.js";
import ticketController from "../controllers/ticket.controllers.js";
import { passportCall } from "../utils.js";

export default class TicketRouter extends BaseRouter {
    init() {
        this.get('/purchase', ['AUTH'], passportCall('jwt', {strategyType: 'jwt'}), ticketController.createTicket);

    }
}

