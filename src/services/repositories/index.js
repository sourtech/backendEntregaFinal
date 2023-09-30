import PersistenceFactory from '../../dao/Factory.js';

import CartManager from "../../dao/mongo/managers/cartManager.js"
import CartRepository from "../CartRepository.js";

import ProductManager from "../../dao/mongo/managers/productManager.js";
import ProductRepository from "../ProductsRepository.js";

import UserManager from "../../dao/mongo/managers/userManager.js";
import UserRepository from "../UserRepository.js";

import TicketManager from "../../dao/mongo/managers/ticketManager.js";
import TicketRepository from "../TicketRepository.js";

PersistenceFactory.getPersistence();

export const cartService = new CartRepository(new CartManager());
export const productService = new ProductRepository(new ProductManager());
export const userService = new UserRepository(new UserManager());
export const ticketService = new TicketRepository(new TicketManager());

