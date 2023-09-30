import jwt from 'jsonwebtoken';
import config from '../config/config.js';
import { userService } from '../services/repositories/index.js';
import MailService from "../services/MailService.js";
import forgotDTO from "../dtos/forgotDTO.js";
import Dtemplates from "../constants/DTemplates.js";
import { generateToken } from '../utils.jwt.js'
import { createHash, validatePassword } from '../utils.js';

const setRegister = async (req, res) => {
    const mailService = new MailService();
    const objMail = {
        name : req.user.first_name
    }
    const send = await mailService.sendMail(req.user.email, Dtemplates.WELCOME,objMail);
    res.send({status:"success",message:"Registered"});
}

const setLogin = async (req, res) => {
    const user = {
        name: req.user.name,
        role: req.user.role,
        id: req.user.id,
        email: req.user.email,
        cart: req.user.cart,
        image: req.user.image,
        superUser: req.user.superUser
    }
    const access_token = generateToken(user)
    //actualizo fecha de cuando se logeo
    await userService.lastConection( user.id );
    return res.cookie('authToken', access_token, {
        maxAge: 1000 * 60 * 60 * 24,
        httpOnly: true,

    }).sendSuccess('success')			
}

const setLogout = async (req, res) => {
    try {
        //actualizo fechacuando sale
        await userService.lastConection( req.user.id );
        res.clearCookie('authToken')
        return res.redirect('/login');
    } catch (error) {
        req.logger.error(error);
    }	
}

const setForgot = async (req, res) => {
    const {email} = req.body;
    try{
        if(!email) return res.sendBadRequest("Debe ingresar un Email");
        const user = await userService.getUsersBy({email});
        if(!user) return res.sendBadRequest("El Email no se encuentra registrado");
        const restoreToken = generateToken(forgotDTO.getFrom(user), 30);//30 segundos dura 
        const mailService = new MailService();
        const result = await mailService.sendMail(email, Dtemplates.FORGOT,{restoreToken});
        if(result) return res.sendSuccess("Te hemos enviado un correo.");
        return res.sendErrorWithPayload("Existe algun problema con el envio de correo, vuelve a intenta luego");
    }catch(error){
        req.logger.error(error);
    }    
}

const setRecovery = async (req, res) => {
    const {token, password} = req.body;
    try{
        const tokenUser = jwt.verify(token,config.jwt_secret);
        const user = await userService.getUsersBy({email: tokenUser.email});
        //verfico que no sea la misma pass
        const isSamePass = await validatePassword(password, user.password)
        if(isSamePass) return res.sendBadRequest("No puedes usar la misma contraseña");
        const newHashPass = await createHash(password);
        await userService.updateUsers(user._id, {password:newHashPass});
        return res.sendSuccess("Contraseña cambiada con exito! seras redireccionado en breve")
    }catch(error){
        req.logger.error(err);
    }
}

const setGitHubCall = (req, res) => {
    const user = {
        id: req.user.id,
        name: `${req.user.first_name} ${req.user.last_name}`,
        role:req.user.role,
        email:req.user.email,
        cart: req.user.cart
    }
    req.logger.debug("el usuario de git");
    req.logger.debug(user);

    const access_token = generateToken(user)

    return res.cookie('authToken', access_token, {
        maxAge: 1000 * 60 * 60 * 24,
        httpOnly: true,

    }).redirect('/products/');
}

const deleteTest = async (req, res) => {
    await userService.deleteTest({email:'micorreo@correo.com'})
    return res.sendSuccess("Usuario de prueba eliminado")
}

export default {
    setRegister,
    setLogin,
    setLogout,
    setForgot,
    setRecovery,
    setGitHubCall,
    deleteTest
}