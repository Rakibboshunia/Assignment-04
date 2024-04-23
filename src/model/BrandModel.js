let mongoose=require('mongoose');
let brandDataSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:false
    },
    status:{
        type:String,
        default:"active"
    },
    brand_id:{
        type:String,
    }
},{timestamps:true,versionKey:false});
let BrandModel=mongoose.model('brands',brandDataSchema);
module.exports=BrandModel