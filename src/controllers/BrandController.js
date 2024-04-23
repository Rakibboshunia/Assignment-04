let BrandModel=require('../model/BrandModel.js');
const { v4: uuidv4 } = require('uuid');
//const {configureMulter }=require('../helper/uploads.js')
//const uploadBrandImage = configureMulter('brand');
exports.readBrand=async(req,res)=>{
    try{
        let data=await BrandModel.aggregate([
            {
                $sort:{_id:-1}

            }
        ]);

        return res.json({status:"success",data:data});

    }catch(error){
        return  res.json({error:error.message||"Server Problems"});
    }
}

// =====store with multer package=====//;

// exports.createBrand = async (req, res) => {
//     try {
//         uploadBrandImage(req, res, async function (err) {
//             if (err) {
//                 return res.status(400).json({ error: err.message });
//             }
//             const brand = new BrandModel({
//                 name: req.body.name,
//                 image: req.file ? req.file.path : null
//             });
//             // Save the brand data to the database
//             await brand.save();
//             res.status(201).json({ message: 'Brand created successfully', data: brand });
//         });
//     } catch (err) {
//         res.status(500).json({ error: err.message || "Server Error" });
//     }
// };


exports.createBrand = async (req, res) => {
    try {
        const uuid = uuidv4();
        const brandId = uuid.slice(0, 20);
        const brand = new BrandModel({
            name: req.body.name,
            image: req.body.image,
            brand_id:brandId
        });
        // Save the brand data to the database
        await brand.save();
        res.status(201).json({ status: 'Brand created successfully', data: brand });
    } catch (err) {
        res.status(500).json({ error: err.message || "Server Error" });
    }
};

exports.activeInActiveBrand=async(req,res)=>{
    try{
      const {id}=req.params;
      let headerBody = req.body;
      let data = await BrandModel.find({
        _id: id
    });
   // console.log(data[0].status)


    if(data[0].status==='inactive'){
        headerBody={status:"active"}
        let changeStatus=await BrandModel.updateOne({_id:id},headerBody);
        res.json({ status: "success", value: changeStatus });
    }else{
        //console.log('ok')
        headerBody={status:"inactive"}
        let changeStatus=await BrandModel.updateOne({_id:id},headerBody);
        res.json({ status: "success", value: changeStatus });
    }
    
    }catch(err){
        res.status(500).json({ error: 'Internal server error' });
    }

}

exports.deleteBrand=async(req,res)=>{
    try{
        let { id } = req.params; 
        let data=await BrandModel.deleteOne({_id:id});
        return res.json({ status: "success",data:data })

    }catch(err){
        return res.json({ error: err.message || "Server Problem" });
    }
}


exports.updateBrand = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, image } = req.body;
        let data = await BrandModel.find({
            _id: id
        });
        let brandId='';
        if(data[0].brand_id===undefined || data[0].brand_id===null ){
            //console.log("ok")
            const uuid = uuidv4();
            brandId = uuid.slice(0, 20);
        }else{
             brandId = data[0].brand_id;
        }

        const brand = await BrandModel.findByIdAndUpdate(id, {
            name,
            image,
            brand_id:brandId,
        }, { new: true });

        if (!brand) {
            return res.status(404).json({ error: 'brand not found' });
        }

        res.status(200).json({ message: 'brand updated successfully', brand });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.singleBrand=async(req,res)=>{
    try{
        let {id}=req.params;
        let data=await BrandModel.find({
            _id:id
        })
        res.status(200).json({ message: 'brand updated successfully',data:data});
    }catch(error){
        res.status(500).json({ error: 'Internal server error' });
    }
}