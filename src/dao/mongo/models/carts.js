import mongoose from "mongoose";

const collection = "carts";

const schema = new mongoose.Schema({    
	products: {
		type:[
			{
				_id:{
					type: mongoose.Types.ObjectId,
					ref: 'products'
				},
				quantity:{
					type: Number,
					default:1
				}
					
			}
		],
		default:[]
	}
});

schema.pre('findOne', function(){
    this.populate('products._id')
})

const cartModel = mongoose.model(collection, schema);

export default cartModel;