import ticketModel from "../models/ticket.js";

export default class TicketManager {

    createTicket  = async (ticket) => {
        return ticketModel.create(ticket);
    };
}