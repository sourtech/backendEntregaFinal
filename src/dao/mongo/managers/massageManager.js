import msnModel from "../models/messages.js";


export default class MessageManager { 

    getMessages = (params) => {
        return msnModel.find(params).lean();
    };   
    
    sendMessage = (nuevo) => {
        return msnModel.create(nuevo);
    };


}