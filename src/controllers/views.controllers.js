import jwt from 'jsonwebtoken';
import config from '../config/config.js';
import { productService, cartService, userService } from "../services/repositories/index.js";
import userDTO from "../dtos/userDTO.js";

const getHome = async (req, res) => {
    try {  
        const { limit, page, sort, category, stock } = req.query   
        const options = {
            page: Number(page) || 1,
            limit: Number(limit) || 12,//por default es 10
            category: category, //el campo a buscar por ahora solo filtro por categoria
            stock: stock || '',//solo si stock llega como 1 filtro a los que tengan stock
            sort: sort || '', //ordena por precio ? sort=1 o sort=-1
            status: true
        };
        //console.log(options); 
        //console.log(req.user)
        // traigo todos los productos
        const products = await productService.getProducts(options, req, true);
        const status = products.docs.length>0 ? 'success' : 'error';
        res.render("index", { 
            status:status,
            user: req.user,
            payload:products, 
            title:'Home' 
        })
    }
    catch (err) {
        req.logger.error(err);
        //aunque en realidad existe un error prefiero mostrar 404
        res.status(404).render('error/404')
    } 
}

const getRealTime = async (req, res) => {
    try {    
        res.render('realTimeProducts', {title:'En vivo', user: req.user})
    }
    catch (err) {
        req.logger.error(err);
        res.status(404).render('error/404' );
    }
}
const getProducts = async (req, res) => {
    try {  
        const { limit, page, sort, category, stock } = req.query                
        const options = {
            page: Number(page) || 1,
            limit: Number(limit) || 12,//por default es 12
            category: category, //el campo a buscar por ahora solo filtro por categoria
            stock: stock || '',//solo si stock llega como 1 filtro a los que tengan stock
            sort: sort || '', //ordena por precio ? sort=1 o sort=-1
            status: true
        };
        const products = await productService.getProducts(options, req, true);
        const status = products.docs.length>0 ? 'success' : 'error';
        //console.log(req.user);
        res.render("products", { 
            status:status, 
            payload:products,
            user: req.user,  
            title:'Productos' 
        })
    }
    catch (err) {
        req.logger.error(err);
        res.status(404).render('error/404')
    } 
}


const adminProducts = async  (req, res) => {
             
    const options = {
        page: 1,
        limit: 100
    };
    if(req.user && req.user.role==='premium'){
        options.owner=req.user.email;
    }
    const products = await productService.getProducts(options, req, true);
    const status = products.docs.length>0 ? 'success' : 'error';
    res.render("admin/products", { 
        status:status, 
        payload:products,
        user: req.user,  
        title:'GESTOR' 
    })  
}

const adminProductsEdit = async  (req, res) => {
    const {pid} = req.params;

    if (!pid.match(/^[0-9a-fA-F]{24}$/)) {
        return res.sendBadRequest('El id no es correcto');
    }
    const params = {_id: pid};
    //si es premium tengo que asegurarme que el producto sea de el
    if(req.user.role==='premium'){
       params.owner = req.user.email;
    }
    const product = await productService.getProductById(params);
    if(product){
        return res.render("admin/products_edit", { 
            payload:product,
            user: req.user,  
            title:'GESTOR' 
        }) 
    }
    res.render("error/404");
}

const adminProductsAdd = async  (req, res) => {
    res.render("admin/products_edit", { 
        user: req.user,
        title:'GESTOR' 
    }) 
}

const adminUsers = async  (req, res) => {
    const newUser = [];
    const users = await userService.getUsers();
    if(users){        
        users.forEach( (user) => {
            newUser.push(new userDTO(user));
        });
    }
    const status = newUser.length>0 ? 'success' : 'error';
    res.render("admin/users", { 
        status:status, 
        payload:newUser,
        user: req.user,  
        title:'GESTOR' 
    })  
}

const adminUsersEdit = async  (req, res) => {
    const {uid} = req.params;

    if (!uid.match(/^[0-9a-fA-F]{24}$/)) {
        return res.sendBadRequest('El id no es correcto');
    }
    const params = {_id: uid};

    const user = await userService.getUsersBy(params);
    if(user){
        return res.render("admin/users_edit", { 
            payload:user,
            user: req.user,  
            title:'GESTOR' 
        }) 
    }
    res.render("error/404");
}

const getLogin = (req, res) => {
    res.render("login", { title:'Login' });    
}

const getForgot = (req, res) => {
    res.render("login_forgot", { title:'Forgot' });    
}

const getRegister = (req, res) => {
    res.render("register", { title:'Registro' });
}

const getRecovery = (req, res) => {
    const {token} = req.query;
    let correct = true;
    //valido el token
    try{
        const valid = jwt.verify(token, config.jwt_secret)
    }catch(error){
        correct = false
    }
    res.render("login_recovery", { title:'Recuperar contraseña', correct });
}

const getChat = (req, res) => {
    req.logger.debug(req.user);
    res.render("chat", {title:'Chat', user: req.user});
}

const getProfile = (req, res) => {
    res.render("profile", { 
        status:'success', 
        user: req.user,  
        title:'Profile' 
    })      
}

const getCart = async (req, res) => {
    //const idCart = '6471261cc14d2ac4b71e7463';
    //console.log('viendo cart');
    const idCart = req.user.cart;
    const cart = await cartService.getCartById(idCart);
    if(!cart){
        return res.status(404).render('error/404')
    }
    let total=0;
    let price=0;
    cart.products.forEach(function(a){
        total += a.quantity;
        price += a._id.price*a.quantity;
    });
    //console.log(price);
    cart.total = total;
    cart.price = price.toFixed(2);
    
    res.render("cart", { 
        status:'success', 
        payload:cart, 
        user: req.user,
        title:'Cart' 
    })    
}

const getDocument = async  (req, res) => {
   // const {pid} = req.params;
   const user = await userService.getUsersBy({_id:req.user.id});
   if(user){
        res.render("user/document", { 
            payload:user.documents,
            user: req.user,  
            title:'Documentos' 
        }) 
    }
}

export default {
    getDocument,
    adminProducts,
    adminProductsEdit,
    adminProductsAdd,
    adminUsers,
    adminUsersEdit,
    getHome,
    getRealTime,
    getProducts,
    getLogin,
    getForgot,
    getRegister,
    getRecovery,
    getChat,
    getProfile,
    getCart
}