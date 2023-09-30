import passport from 'passport';
import local from 'passport-local';
import GithubStrategy from 'passport-github2';
//import UserManager from "../dao/mongo/managers/userManager.js";
//import CartManager from "../dao/mongo/managers/cartManager.js";
import { userService, cartService } from '../services/repositories/index.js';

import userDTO from "../dtos/userDTO.js";

import { cookieExtractor, createHash, validatePassword } from '../utils.js';
import { Strategy, ExtractJwt } from 'passport-jwt';
import config from './config.js';


const manager = userService;
const cart = cartService;

const LocalStrategy = local.Strategy; // UNA ESTRATEGIA LOCAL SIEMPRE SE BASA EN EL USERNAME + PASSWORD

const initializePassportStrategies = () => {
	passport.use('register',
    	new LocalStrategy(
			{ passReqToCallback: true, usernameField: 'email' },
			async (req, email, password, done) => {
				try {
					const { first_name, last_name } = req.body;
					//Número 1! Corrobora si el usuario ya existe.
					const exists = await manager.getUsersBy({ email });
					if (exists){
						return done(null, false, { message: 'El usuario ya existe' });
					}
					//ya le agrego el cart id
					const cartID = await cart.createCart();
					const hashedPassword = await createHash(password);
					const user = {
						first_name,
						last_name,
						email,
						password: hashedPassword,
						cart: cartID._id,						
					};
					//console.log(user);
					const result = await manager.createUsers(user);
					done(null, result);
				} catch (error) {
					done(error);
				}
			}
    	)
  	);

  	passport.use('login',
    	new LocalStrategy(
			{ usernameField: 'email' },
			async (email, password, done) => {
				//Que haya ingresado los datos basicos
				if(!email || !password){
					return done(null, false, { message: '"Debe ingresar el usuario y contraseña' });
				}				
				//Usuario ADMIN
				if(email === config.admin_email && password === config.admin_password) {
					//Desde aquí ya puedo inicializar al admin.
					const user = {
						id: 0,
						first_name: "Coder", 
						last_name: "Admin",
						email: config.admin_email, 
						role: "admin"
					};
					const nuser = new userDTO(user);
					return done(null, nuser);
				}
				let user;
				//Busco en base
				//console.log(email);
				user = await manager.getUsersBy({ email });
				//console.log(user)
				if (!user){
					return done(null, false, { message: 'Usuario no encontrado' });
				}			

				//a comprobar la pass
				const isValidPassword = await validatePassword(password, user.password);
				if (!isValidPassword){
					return done(null, false, { message: 'Contraseña inválida' });
				}
				//console.log(user)
				const nuser = new userDTO(user);
				//console.log(nuser);	
				return done(null, nuser);
			}
		)
  	);

	passport.use('github', new GithubStrategy({
		clientID: config.github_id,
		clientSecret: config.github_secret,
		callbackURL: config.github_url
	}, async(accessToken, refreshToken, profile, done) => {
		try{
			//console.log(profile);
			const {name, email} = profile._json;
			const user = await manager.getUsersBy({ email });
			if(!user){
				//lo creamos
				
				const cartID = await cart.createCart();
				const newUser = {
					id: 0,
					first_name: name.split(' ')[0],
					last_name: name.split(' ')[1],
					email: email,
					password: '',
					cart: cartID._id,
				}
				const result = await manager.createUsers(newUser);
				return done(null, result);
			}
			//si ya existe, cambia el nombre de id, para que no de problema en la serializacion
			//user.id = user._id;
			done(null, user);
		}catch(error){
			done(error);
		}
	}))

    passport.use('jwt', new Strategy(		
        {
            jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
            secretOrKey:config.jwt_secret,
    
        }, async(payload, done) => {
            try {
                //console.log(payload);
				//console.log("aca estoy");
                return done(null, payload);
            } catch (error) {
				console.log("por aca");
                return done(error)
            }
        }
    ))	
	/*
	passport.serializeUser(function (user, done) {
		return done(null, user.id);
	});

	passport.deserializeUser(async function (id, done) {
		if(id===0){
			return done(null,{
				role:"admin",
				name:"ADMIN"
			})
		}
		const user = await manager.getUsersBy({ _id: id });
		return done(null, user);
	});
	*/
};
export default initializePassportStrategies;