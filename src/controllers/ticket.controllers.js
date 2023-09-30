import cryptoRandomString from 'crypto-random-string';
import { cartService, productService, ticketService } from '../services/repositories/index.js';
import MailService from '../services/MailService.js';
import Dtemplates from "../constants/DTemplates.js";

const createTicket = async (req, res) => {
    // podria usar el que me llega por param req.params.cid, pero es lo mismo
    // mas seguro el de la base que tiene asignado el usuario
    const idCart = req.user.cart; 
    const cart = await cartService.getCartById(idCart);
    //console.log(cart)
    if(!cart){
        return res.sendErrorWithPayload('no existe cart');
    }

    //proceso todo tema de stock
    const {amount, amount_total} = await procesarStock(idCart,cart);
    
    const response = {
        amount_total: amount_total,
    };
    
    //si realmente existio venta genero el ticket
    if(amount>0){
        let ticketCode = cryptoRandomString({length: 10});
        const ticket = {
            code: ticketCode,
            amount: amount,
            purchaser: req.user.email
        }    
        const newTicket  = await ticketService.createTicket(ticket);
        //
        if(newTicket){
            response.amount=amount;
            response.ticketCode=ticketCode;
            //console.log('Ticket generado ' + ticketCode);
        }  
        //le enviamos el email de confirmacion
        const objMail = {
            userName : req.user.name,
            ticketID : response.ticketCode,
            amount : response.amount
        }
        const mailService = new MailService();
        const send = await mailService.sendMail(req.user.email, Dtemplates.SUCCESSCART,objMail);
    }
    //console.log(response)
    //devuelvo el payload con todo lo que paso
    res.render("checkout", { 
        status:"success", 
        payload:response,
        user: req.user,  
        rest: amount_total - amount,
        title:'Compra finalizada' 
    })
}

//procesar el stock y devuelve la cantidad de productos comprados, y total de productos
//es una function interna no necesito exportarla
const procesarStock = async (idCart, cart) => {
    let amount = 0; 
    let amount_total = 0;  
    for (const prod of cart.products) {
        //total de produtos
        amount_total += prod.quantity;
        if (prod.quantity <= prod._id.stock) {
            console.log('Hay stock');
            let prodID = prod._id._id.toString();
            //elimino del carrito
            let result = await cartService.removeProduct({ _id: idCart }, prodID);
            if (result) {
               // req.logger.debug('Vendido');
                amount += prod.quantity;
                // Resto el stock al prodcuto
                await productService.updateProduct(prodID,{stock: prod._id.stock-prod.quantity})
            }
        }
    }  
    //console.log('Total vendido: ' + amount);
    //devuelvo la cantidad de productos que realmente termino comprando
    return {amount, amount_total};
}

export default {
    createTicket
}