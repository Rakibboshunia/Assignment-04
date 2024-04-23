const UserModal=require('../model/UserModel');
const bcrypt = require('bcrypt');
const path = require('path');
// Multer configuration
// const storage = multer.memoryStorage(); // Store files in memory as Buffers
// const upload = multer({ storage: storage });
//==== All users====//
const BASE_URL = 'http://localhost:5173/';
exports.indexUser=async(req,res)=>{
    try{
       let data= await UserModal.aggregate([
            { 
                $sort: { _id: -1 } 
            },
            {
                $project:{password:0}
            }
        ])
        res.json({ status: "success", data: data });
    }catch(err){
        res.json({error:err.message||"Server Problems"});
    }
}

//====create user ====//
exports.createUser=async(req,res)=>{
    try{
        //console.log('Request Object:', req);
        const {name,email,phone,password,role,status}=req.body;
        //console.log('Uploaded File:', req.file);
         // Validate input data
         if (!name || !email || !phone || !password ) {
            return res.status(400).json({ error: 'All fields are required' });
        }
        const hashPassword=await bcrypt.hash(password,10);
        const imagePath = req.file.path;
        
        console.log(req.file)

        // Store only the relative image path
        const relativeImagePath = imagePath.split('\\').pop();
        const userCreate=new UserModal({
            name,
            email,
            phone,
            password:hashPassword,
            image:relativeImagePath,
            role,
            status,
        });
        // ====Image Uploads===//
        // if (req.file) {
        //     // Save image path to user document
        //     user.image = req.file.path;
        // }
        let userData=await userCreate.save();
        res.status(201).json({ message: 'User created successfully',userData:userData });
    }catch(err){
        res.json({error:err.message||"Server Problems"});
    }
}

exports.viewUser=async(req,res)=>{
    try {
        let { id } = req.params;
        let data = await UserModal.find({
            _id: id
        });
        //console.log(data)

        return res.json({ status: "success", data: data })

    } catch (error) {
        return res.json({ error: error.message || "Server Problem" });
    }

}

exports.deleteUser=async(req,res)=>{
    try{
        let { id } = req.params; 
        let data=await UserModal.deleteOne({_id:id});
        return res.json({ status: "success",data:data })

    }catch(err){
        return res.json({ error: err.message || "Server Problem" });
    }
}

exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, password,image,role,status } = req.body;

        // Hash the password if provided
        let hashedPassword = null;
        if (password) {
            hashedPassword = await bcrypt.hash(password, 10);
        }

        const user = await UserModal.findByIdAndUpdate(id, {
            name,
            email,
            image,
            role,
            status,
            ...(hashedPassword && { password: hashedPassword }) // Only update password if provided
        }, { new: true });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({ message: 'User updated successfully', user });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.activeInActiveUser=async(req,res)=>{
    try{
      const {id}=req.params;
      let headerBody = req.body;
      let data = await UserModal.find({
        _id: id
    });

    if(data[0].status==='inactive'){
        headerBody={status:"active"}
        let changeStatus=await UserModal.updateOne({_id:id},headerBody);
        res.json({ status: "success", value: changeStatus });
    }else{
        headerBody={status:"inactive"}
        let changeStatus=await UserModal.updateOne({_id:id},headerBody);
        res.json({ status: "success", value: changeStatus });
    }
    
    }catch(err){
        res.status(500).json({ error: 'Internal server error' });
    }

}