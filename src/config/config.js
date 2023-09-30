import dotenv from 'dotenv';

dotenv.config();
/*
dotenv.config({
    path: './.env.dev'
});
*/
export default {
    port: process.env.PORT,
    persistence : process.env.PERSISTENCE,
    mongo_url: process.env.MONGO_URL,
    admin_email: process.env.ADMIN_EMAIL,
    admin_password: process.env.ADMIN_PASS,
    jwt_secret: process.env.JWT_SECRET,
    github_id: process.env.GITHUB_ID,
    github_secret: process.env.GITHUB_SECRET,
    github_url: process.env.GITHUB_URL,
    enviroment: process.env.ENV,
    mailer : {
        user: process.env.EMAIL_USER,
        password: process.env.EMAIL_PASSWORD
    }
}
