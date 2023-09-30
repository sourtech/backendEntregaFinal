import mongoose from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2'

const collection = "products";

const schema = new mongoose.Schema(
    {
        title: String,
        description: String,
        thumbnail: Array,
        code: String,
        price: Number,
        stock: Number,
        status: {
            type: Boolean,
            default: false
        },
        category: String,
        owner: {
            type: String,
            default: 'admin'
        },
    },
    { 
        timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
    }
);
schema.plugin(mongoosePaginate);
const productModel = mongoose.model(collection, schema);

export default productModel;