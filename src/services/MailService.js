import nodemailer from 'nodemailer';
import config from '../config/config.js';
import DMail from '../constants/Dmail.js';
import { generateMailTemplate } from '../utils.js';

export default class MailService {
    constructor() {
        this.mailer = nodemailer.createTransport({
            service:'gmail',
            port:587,
            auth:{
                user: config.mailer.user,
                pass: config.mailer.password
            }
        })
    }

    sendMail = async(emails,template,payload) => {
        const mailInfo = DMail[template];
        const html = await generateMailTemplate(template,payload);
        const result = await this.mailer.sendMail({
            from: 'Hernan Roig <hernanroig@gmail.com>',
            to: emails,
            html,
            ...mailInfo
        })
        return result;
    }
}