import mongoose from "mongoose";

const collection = "messages";

const schema = new mongoose.Schema(
    {
        user: String,
        message: String,
    },
    { timestamps: { createdAt: "created_at"} }
);
const messagesModel = mongoose.model(collection, schema);

export default messagesModel;