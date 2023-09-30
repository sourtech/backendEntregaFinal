import userModel from "../models/users.js";

export default class UserManager {
    getUsers = async () => {
        return userModel.find().lean();
    };

    getUsersBy = (params) => {
        return userModel.findOne(params).lean();
    };

    createUsers = (user) => {
        return userModel.create(user);
    };

    updateUsers = (id, user) => {
        return userModel.findByIdAndUpdate(id, user);
    };

    deleteUsers = (id) => {
        return userModel.findByIdAndDelete(id);
    };

    deleteOneUser = (user) => {
        return userModel.findOneAndRemove(user);
    };

    lastConection =  (uid) => {
        const param = {
            last_connection: new Date(),
        }
        return userModel.findByIdAndUpdate(uid, { $set: param });
    };

    updateDocs = (uid, documents) => {
        return userModel.findByIdAndUpdate(uid, { $set: documents });
    }
} 