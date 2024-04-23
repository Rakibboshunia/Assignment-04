let ProductModel=require("../model/ProductModel.js")
exports.createProduct=async(req,res)=>{
    try{
        let {product_name,brand_id,product_price,discount_type,discount,product_image,product_detail}=req.body;
        let total = product_price;

        
        // ===Check if discount is applied=====//

        if (discount_type === 'percentage' && discount) {
            if (discount <= 100) { // Ensure discount percentage is within range
                const discountAmount = (discount / 100) * product_price; // Calculate discount amount
                total = product_price - discountAmount; // Apply percentage discount
            } else {
                throw new Error("Discount percentage must be between 0 and 100.");
            }
        } else if (discount_type === 'flat' && discount) {
            total = product_price - discount; // Apply flat-rate discount
        }else{
            total=""
        }
        const newProduct = {
            product_name,
            brand_id,
            product_price,
            discount_type,
            discount,
            total,
            product_image,
            product_detail
        };
        const product = await ProductModel.create(newProduct);
        return res.json({status:"success",message:"Product created successfully",data:product})

        //console.log(dataBody.product_name)
        
    }catch(error){
        return res.json({error:error.message||"Internal Server Error"})
    }
}

// ====Read Product Data====//
exports.readProduct=async(req,res)=>{
    try{

       let data=await ProductModel.aggregate([
        { 
            $lookup: { from: "brands", localField: "brand_id", foreignField: "brand_id", as: "brandDetails" } 
        },

        {
            $project:{
                product_name:"$product_name",
                product_price:{$toDouble:"$product_price"},
                product_detail:"$product_detail",
                discount:"$discount",
                total:{$toDouble:"$total"},
                product_image:"$product_image",
                status:"$status",
                discount_type:"$discount_type",
                brandName: { $first: "$brandDetails.name" },
            }

        },
        
        {
        
            $sort:{
                _id:-1
            }
       }
    ]);
       return res.json({status:"success",data:data})
    }catch(error){
        return res.json({error:error.message||"Internal Server Error"});
    }
}

exports.deleteProduct=async(req,res)=>{
    try{
        let {id}=req.params
        await ProductModel.deleteOne({
            _id:id
        })
        return res.json({ message: "Item Deleted Successfully" });
    }catch(error){
        return res.json({ error: error.message || "Internal Server problem" })
    }

}

exports.singleProduct=async(req,res)=>{
    try{
        let {id}=req.params
        let data=await ProductModel.find({
            _id:id
        })
        return res.json({ status:"success",message: "Item Deleted Successfully",data:data });
    }catch(error){
        return res.json({ error: error.message || "Internal Server problem" })
    }

}

exports.checkProduct=async(req,res)=>{
    try{
        const {id}=req.params;
        let headerBody = req.body;
        let data = await ProductModel.find({
          _id: id
      });
  
      if(data[0].status==='inactive'){
          headerBody={status:"active"}
          let changeStatus=await ProductModel.updateOne({_id:id},headerBody);
          res.json({ status: "success",message:"Status changed successfully", value: changeStatus });
      }else{
          headerBody={status:"inactive"}
          let changeStatus=await ProductModel.updateOne({_id:id},headerBody);
          res.json({ status: "success",message:"Status changed successfully", value: changeStatus });
      }
      
    }catch(err){
          res.status(500).json({ error: 'Internal server error' });
      }
}

//======Front view Product====//
exports.readProductAsFrontEnd=async(req,res)=>{
  try{
    let data=await ProductModel.aggregate([
        { 
            $lookup: { from: "brands", localField: "brand_id", foreignField: "brand_id", as: "brandDetails" } 
        },

        {
            $project:{
                _id:1,
                product_name:{$toUpper:"$product_name"},
                product_price:{$toDouble:"$product_price"},
                product_detail:"$product_detail",
                discount:"$discount",
                total:{$toDouble:"$total"},
                product_image:"$product_image",
                status:"$status",
                brandName: { $first: "$brandDetails.name" },
            }

        },
        
        {
        
            $sort:{
                _id:-1
            }
       },
       {
        $match:{
            status:"active"
        }
       }
    ]);
       return res.json({status:"success",data:data})

  }catch(error){

  }
}
exports.updateProduct=async(req,res)=>{
    try {
        const { id } = req.params;
        let {product_name,brand_id,product_price,discount_type,discount,product_image,product_detail}=req.body;
         let total = product_price;
        if (discount_type === 'percentage' && discount) {
            if (discount <= 100) { // Ensure discount percentage is within range
                const discountAmount = (discount / 100) * product_price; // Calculate discount amount
                total = product_price - discountAmount; // Apply percentage discount
            } else {
                throw new Error("Discount percentage must be between 0 and 100.");
            }
        } else if (discount_type === 'flat' && discount) {
            total = product_price - discount; // Apply flat-rate discount
        }else{
            total=""
        }
        const product = await ProductModel.findByIdAndUpdate(id, {
            product_name,
            brand_id,
            product_price,
            discount_type,
            discount,
            total,
            product_image,
            product_detail
        }, { new: true });

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
      // console.log(product)
        res.status(200).json({ message: 'Product updated successfully', product });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}