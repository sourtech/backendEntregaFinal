/* 
 * El factory solo lo hice para probar el funcionamiento, realmente no creo que sea necesario
*/
import mongoose from 'mongoose';
import config from '../config/config.js';

export default class PersistenceFactory{
    static async getPersistence(){
        switch(config.persistence){
            case "MONGO":
                mongoose.connect(config.mongo_url);
        }
    }
}

