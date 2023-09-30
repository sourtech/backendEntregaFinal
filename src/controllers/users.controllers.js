import sharp from "sharp";
import moment from 'moment';
import { userService, cartService } from '../services/repositories/index.js';
import userListDTO from "../dtos/userListDTO.js";
import MailService from '../services/MailService.js';
import Dtemplates from "../constants/DTemplates.js";
import __dirname from "../utils.js";

const getUsers = async (req, res) => {
    const users = await userService.getUsers();
    if(!users){
        return res.sendErrorWithPayload('No exiten usuarios');
    }
    const nusers = users.map(function(u){
        return new userListDTO(u);
    });
    res.sendSuccessWithPayload(nusers);
}

const deleteInactive = async (req, res) => {
    const users = await userService.getUsers();
    if(!users){
        return res.sendErrorWithPayload('No exiten usuarios');
    }
    const now = moment();
    //recorro y creo un nuevo array con los usuario que hace 
    //30 minutos no entran al sistema
    const userDelete = []
    for (const user of users) {
        let time = now.diff(user.last_connection, 'minutes');
        if(time>30){
            user.time = time;
            userDelete.push(user);
        }
    }
    if(userDelete.length===0){
        return res.sendErrorWithPayload('No hay usuarios para eliminar');
    }
    //ahora si borro y envio un email a cada uno
    const mailService = new MailService();
    for (const u of userDelete) {        
        const objMail = {
            user : u
        }
        const send = await mailService.sendMail(u.email, Dtemplates.INACTIVE,objMail);
        //borro el carrito si tiene 
        await cartService.deleteUsers(u.cart);
        //ahora si elimino el usuario
        await userService.deleteUsers(u._id);
    }
    res.sendSuccessWithPayload(userDelete);
}

const setRol = async (req, res) => {
    const {role} = req.body;

    //si quiere pasar a premmium hay alguns requisitos
    if(role==='premium'){
        const user = await userService.getUsersBy({_id:req.user.id});
        if(!user.documents){
           return res.sendBadRequest("Tiene que tener la documentacion subida para cambiar de rol");
        }
        //comprobamos que docuemntacion tiene subida
        let dni,domicilio,cuenta=false;
        user.documents.forEach(async (e) => {
            if(e.name==='dni') dni = true;
            if(e.name==='domicilio') domicilio = true;
            if(e.name==='cuenta') cuenta = true;
        }); 
    
        if(!dni || !domicilio || !cuenta){
            let string = 'Los tres tipos de documentos son necesario para cambiar de rol';
            return res.sendBadRequest("Los tres tipos de documentos son necesario para cambiar de rol");
        }
    }

    //solo permitimos estos dos roles
    if(role==='usuario' || role==='premium'){
        const dataUser = {role:role};
        if(req.file){
            dataUser.image = req.file.filename;
            //creo los recortes 
            sharp(req.file.path)
                .resize(40,40, { fit:  "contain" })
                .toFile(`${__dirname}/public/img/profile/40x40_${req.file.filename}`);
        }
        await userService.updateUsers(req.user.id, dataUser);
        return res.sendSuccess("Rol actualizado con exito! seras redireccionado para que vuelvas a logearte")
    }
    res.sendBadRequest("Accion no permitida");
}

const setDocument = async (req, res) => {
    let docs = [];
    let cantidad = 0;

    const user = await userService.getUsersBy({_id:req.user.id});
    if(user.documents){
        docs = user.documents;
    }

    if(req.files.dni){
        req.files.dni.forEach(async (e) => {
            docs.push({name:'dni',reference:e.filename})
        }); 
        cantidad++;
    }
    if(req.files.domicilio){
        req.files.domicilio.forEach(async (e) => {
            docs.push({name:'domicilio',reference:e.filename})
        });
        cantidad++;       
    }
    if(req.files.cuenta){
        req.files.cuenta.forEach(async (e) => {
            docs.push({name:'cuenta',reference:e.filename})
        }); 
        cantidad++;      
    }
    if(docs.length>0){
        //console.log(req.user.id);
        console.log(cantidad)
        await userService.updateDocs(req.user.id, {documents:docs})
    }
    if(cantidad>0){
        return res.sendSuccess();
    }
    res.sendErrorWithPayload({error:'No agrego ningun nuevo docuemnto'})
}

const deleteUser = async (req, res) => {
    const uid = req.params.uid;
    //compruebo que id este bien formo
    if (!uid.match(/^[0-9a-fA-F]{24}$/)) {
        return res.sendBadRequest('El id no es correcto');
    }
   
    if(req.user.role!=='admin'){
        return res.sendBadRequest('no tienes los permisos necesario');
    }
    //Traigo el usuario de la base
    const userNow = await userService.getUsersBy({ _id: uid });
    if(!userNow){
        return res.sendBadRequest('El usuario no existe');
    }
    //ya se puede borrar el usuario, antes borro el carrito asociado
    await cartService.deleteUsers(userNow.cart);
    //ahora si
    const result = await userService.deleteUsers(uid);
    if (result.status === 'error'){
        return res.sendErrorWithPayload({ result });
    }
    return res.sendSuccessWithPayload('Usuario eliminado');
}

const updateUser = async (req, res) => {
    try {
        const uid = req.params.uid;
        const user = req.body;

        //compruebo que id este bien formo
        if (!uid.match(/^[0-9a-fA-F]{24}$/)) {
            return res.sendBadRequest('El id no es correcto');
        }
        //Traigo el usuario de la base
        const userNow = await userService.getUsersBy({ _id: uid });
        if(!userNow){
            return res.sendBadRequest('El usuario no existe');
        }

        if (!user.first_name ||
            !user.last_name ||
            !user.email ||
            !user.role){
                return res.sendInternalError('Todos los campos son obligatorios');
            }

        const result = await userService.updateUsers(uid, user);
        if (result.status === 'error'){
            return res.sendErrorWithPayload({ result });
        }
        return res.sendSuccessWithPayload({ result })

    }
    catch (err) {
        req.logger.error(err);
    }
}

export default {
    getUsers,
    deleteInactive,
    setRol,
    setDocument,
    deleteUser,
    updateUser
}