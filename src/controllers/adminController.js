import ProductCol from "../model/productCol.js";
import UserCol from "../model/userCol.js";
import cloudinary from 'cloudinary';

cloudinary.config({
    cloud_name: 'dpemgsyje',
    api_key: '536212312211878',
    api_secret: 'J128DxIZoJ4T9ncC_c_VAe8_1Yc'
});

const adminController = {
  adminDashboard: async (req, res) => {
    try {
      res.json({ message: "success" });
    } catch (error) {
      res.send({ message: error.message });
    }
  },
  getProduk: async (req, res) => {
    try {
      const {limit, offset} = req.query;
      const result = await ProductCol.find().limit(limit).skip(offset);

      if (!result) {
        res.status(404).send({ message: "data not found" });
      }

      res.json(result);
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  },

  updateProduk: async (req, res) => {
    try {
      let id = req.params.id;
      const { name_product, 
        description, 
        category, 
        type_product,
        thumbnail_public_id,
        source_file_public_id, 
        signatureThumbnail,
        signatureSourceFile,
        thumbnail,
        source_file } = req.body;

      const result = await ProductCol.updateOne(
        { _id: id },
        {
          $set: {
            name_product,
            description,
            category,
            type_product,
            thumbnail_public_id,
            source_file_public_id,
            signatureThumbnail,
            signatureSourceFile,
            source_file,
            thumbnail
          },
        }
      );

      if (result.modifiedCount === 0) {
        return res.status(401).send({ message: "Update Failed" });
      }
      res.status(200).send({ message: "Update Success" });
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  },
  updateFoto: async (req, res) => {
    try {
      const id = req.params.id;
      const thumbnail = req.body.thumbnail

      const result = await ProductCol.updateOne(
        {_id : id},
        {
          $set:{
            thumbnail
          }
        }
      );

      if (result.modifiedCount === 0) {
        return res.status(401).send({ message: "Update Failed" });
      }
      res.status(200).send({ message: "Update Success" });
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  },
  updateRar: async (req, res) => {
    try {
      const id = req.params.id;
      const source_file = req.body.source_file;

      const result = await ProductCol.updateOne(
        {_id : id},
        {
          $set:{
            source_file
          }
        }
      );

      if (result.modifiedCount === 0) {
        return res.status(401).send({ message: "Update Failed" });
      }

      res.status(200).send({ message: "Update Success" });
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  },

  uploadProduk: async (req, res) => {
    try {
      const { 
        name_product, 
        description, 
        category, 
        type_product, 
        thumbnail, 
        source_file,
        signatureThumbnail,
        signatureSourceFile,
        thumbnail_public_id,
        source_file_public_id } = req.body;

      const data = new ProductCol({
        name_product: name_product,
        description: description,
        category: category,
        type_product: type_product,
        thumbnail: thumbnail,
        source_file: source_file,
        signatureThumbnail : signatureThumbnail,
        signatureSourceFile : signatureSourceFile,
        thumbnail_public_id : thumbnail_public_id,
        source_file_public_id : source_file_public_id
      });

      await data.save();

      res.status(200).send({ message: "Upload Success" });
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  },

  getUsers: async (req, res) => {
    try {
      const {limit, offset} = req.query;
      const result = await UserCol.find().limit(limit).skip(offset);
      if (!result) {
        res.status(404).send({ message: "data not found" });
      }
      res.status(200).json(result);
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  },

  putMembership: async (req, res) => {
    try {
      const id = req.params.id;
      let is_membership = req.body.is_membership;

      const result = await UserCol.findOneAndUpdate(
        {_id : id},
        {
          $set : {
            is_membership : is_membership
          }
        }
      );
      if (result.modifiedCount === 0) {
        return res.status(401).send({ message: "Update Failed" });
      }

      res.status(200).json({ message: "update success" });
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  },

  deleteProductById : async (req, res) => {
    try {
      const filter = req.params.id;
      const result = await ProductCol.deleteOne({ _id: filter });

      if (result.deletedCount === 0) {
        return res.status(401).send({ message: "Delete Failed" });
      }

      res.status(200).json({message : 'delete success'});
    } catch (error) {
      res.status(500).json({message: error.message});
    }
  },

  deleteUserById : async (req, res) => {
    try {
      const filter = req.params.id;
      
      // delete user
      const result = await UserCol.deleteOne({ _id: filter });

      if(result.deletedCount === 0) {
        return res.status(401).send({ message: "Delete Failed" });
      }

      res.json({message : 'Delete success'});
    } catch (error) {
      res.status(500).json({message: error.message});
    }
  },

  deleteThumbnail : async (req,res) =>{
    try {
      const public_id = req.query.public_id;

      cloudinary.v2.uploader.destroy(public_id, function(error, result){
        if(result){
          return res.send(result)
        }
        res.send({message : error})
      })
    } catch (error) {
      res.status(500).send({message : error.message})
    }
  },

  deleteRawFile : async (req,res) =>{
    try {
      const public_id = req.query.public_id;

      cloudinary.v2.uploader.destroy(public_id, { invalidate: true, resource_type: "raw"}, function(error, result){
        if(result){
          return res.send(result)
        }
        res.send({message : error})
      })
    } catch (error) {
      res.status(500).send({message : error.message})
    }
  },
  
};

export default adminController;
