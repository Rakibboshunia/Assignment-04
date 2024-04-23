const mongoose=require('mongoose');
const dataSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique: true,
    },
    phone:{
        type:String,
        required:true,
        unique: true,
        validate: {
            validator: function(v) {
                return /^[0-9]{13}$/.test(v);
            },
            message: props => `${props.value} is not a valid phone number!`
        }
    },
    password: {
        type: String,
        required: true,
        validate: {
            validator: function(password) {
                return password.length >= 6;
            },
            message: 'Password must be at least 6 characters',
        },
    },
    image:{
        type:String,
        required:false,
    },
    role:{
        type:String,
        required:true,
    },
    status:{
        type:String,
        default:"inactive"
    }
},{timestamps:true,versionKey:false});
let UserModal=mongoose.model('users',dataSchema);
module.exports = UserModal;