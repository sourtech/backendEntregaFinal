import {fileURLToPath} from 'url';
import { dirname } from 'path';
import bycrypt from 'bcrypt';
import passport from 'passport';
import fs from 'fs';
import Handlebars from 'handlebars';

export const createHash = async(password) => {
    //Generar los salts
    const salts = await bycrypt.genSalt(10);
    return bycrypt.hash(password, salts);
}

export const validatePassword = async (password, hashedPassword) => bycrypt.compare(password, hashedPassword);

export const passportCall = (strategy,options={}) =>{
    //console.log(strategy, options.strategyType, 'estrategia');
    return async(req,res,next) =>{
        // if(strategy === 'AUTH') return next();
        passport.authenticate(strategy,(error,user,info)=>{
            //console.log(info);
            //console.log(user);
            if(error) return next(error);
            if(!options.strategyType){
                console.log(`Route ${req.url} doesn't have defined a strategyType`);
                return res.sendInternalError(`Route ${req.url} doesn't have defined a strategyType`);
            }

            if(!user) {
                //¿Qué significa el que no haya encontrado user en cada caso?
                switch(options.strategyType) {
                    case 'jwt':
                        //console.log('jwt');
                        req.error = info.message?info.message:info.toString();
                        return next();
                    case 'locals':
                        return res.sendUnauthorized(info.message?info.message:info.toString())
                    case 'github':
                        console.log('github');
                        return next();
                    
                }
            }
            //Agrego este dato solo para la vista puede manejar los productos
           // if(user.role=='admin'){
           //     user.superUser = true;
          //  }
           // console.log(user)
            req.user = user;
            next();
        })(req,res,next);
    }
}

export const cookieExtractor = (req) =>{
    let token = null; 

    if(req&&req.cookies) {
        //console.log("la cookie existe");
        token = req.cookies['authToken']
    }
    return token;
}

export const generateMailTemplate = async(template,payload) =>{
    const content = await fs.promises.readFile(`${__dirname}/templates/${template}.handlebars`,'utf-8')
    const precompiledContent = Handlebars.compile(content);
    const compiledContent = precompiledContent({...payload})
    return compiledContent;
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
export default __dirname;