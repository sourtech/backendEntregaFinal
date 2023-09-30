import mongoose from "mongoose";

const collection = "users";

const schema = new mongoose.Schema(
	{
		first_name: String,
		last_name: String,
		email: {//indice unico
			type: String, 
			index: {
				unique: true 
			} 
		},
		password: String,
		role: { 
			type: String, 
			default: "usuario" 
		},
		cart:{
			type:mongoose.SchemaTypes.ObjectId,
			ref:'Carts'
		},
		documents : [{
				name : String,
				reference : String
			 }],
		image: String,
		last_connection: { 
			type: Date, 
			default: Date.now 
		},
	},
	{ timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);


const userModel = mongoose.model(collection, schema);

export default userModel;