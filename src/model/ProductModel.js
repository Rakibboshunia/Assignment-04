let mongoose =require('mongoose');
let dataSchema=new mongoose.Schema({
    product_name:{
        type:String,
        required:true
    },
    brand_id:{
        type:String,
        required:false
    },
    product_detail:{
        type:String,
        required:false
    },
    product_price:{
        type:Number,
        required:true
    },
    discount_type:{
        type:String,
        required:false
    },
    discount:{
        type:Number,
        required:false
    },
    total:{
        type:Number,
        required:false
    },
    product_image:{
        type:String,
        required:true
    },
    status:{
        type:String,
        default:"active"
    }

},{timestamps:true,versionKey:false});
let ProductModel=mongoose.model('products',dataSchema);
module.exports=ProductModel