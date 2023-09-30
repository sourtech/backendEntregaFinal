import jwt from 'jsonwebtoken';
import config from './config/config.js';

const PRIVATE_KEY = config.jwt_secret

export const generateToken = (user, expiresIn='24h') => {
    const token = jwt.sign(user, PRIVATE_KEY, {expiresIn});
    return token;
}

export const authToken = (req, res, next) => {
    //console.log(req.headers);
    const authHeader = req.headers.authorization;
    //console.log(authHeader, 'authHeader');
    if(!authHeader){
        return res.status(401).send({error: 'Not authenticated'});
    }
    const token = authHeader.split(' ')[1];
    jwt.verify(token, PRIVATE_KEY, (error, credentials) => {
        if(error) return res.status(403).send({error: 'Not authorized'});

        req.user = credentials.user;
       // console.log('estoy en next');
        next();
    });
}

export const cookieExtractor = (req) =>{
    let token = null; 

    if(req&&req.cookies) {
        token = req.cookies['authToken']
    }
    return token;
}