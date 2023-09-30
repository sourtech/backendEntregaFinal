import mongoose from "mongoose";

const collection = "tickets";

const schema = new mongoose.Schema(
  {
    code: String,
    amount: Number,
    purchaser: String, //el correo del usuario
  },
  { timestamps: { createdAt: "purchase_datetime", updatedAt: "updated_at" } }
);

const ticketModel = mongoose.model(collection, schema);

export default ticketModel;