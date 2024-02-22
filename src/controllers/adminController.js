import ProductCol from "../model/productCol.js";
import UserCol from "../model/userCol.js";
import cloudinary from "cloudinary";
import ProductValidation from "../validation/product.js";
import ResponseErr from "../responseError/responseError.js";
import isObjectID from "../utility/mongo.js";

cloudinary.config({
  cloud_name: "dpemgsyje",
  api_key: "536212312211878",
  api_secret: "J128DxIZoJ4T9ncC_c_VAe8_1Yc",
});

const adminController = {
  adminDashboard: async (req, res) => {
    try {
      res.json({ message: "success" });
    } catch (error) {
      res.send({ message: error.message });
    }
  },
  getProduk: async (req, res, next) => {
    try {
      const limit = req.query.limit || 0;
      const offset = req.query.offset || 0;
      const result = await ProductCol.find().skip(offset).limit(limit);

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },

  updateProduk: async (req, res, next) => {
    try {
      let id = req.params.id;

      const validObjectID = isObjectID(id);
      if (!validObjectID) {
        throw new ResponseErr(400, "ID Invalid");
      }

      const val = await ProductValidation.valid(req.body);

      const result = await ProductCol.updateOne(
        { _id: id },
        {
          $set: {
            name_product: val.name_product,
            description: val.description,
            category: val.category,
            type_product: val.type_product,
            thumbnail: val.thumbnail,
            source_file: val.source_file,
            thumbnail_public_id: val.thumbnail_public_id,
          },
        }
      );

      if (result.matchedCount === 0) {
        throw new ResponseErr(404, "Product Not Found");
      }
      res.status(200).json({ message: "Update Success" });
    } catch (error) {
      next(error);
    }
  },
  updateFoto: async (req, res) => {
    try {
      const id = req.params.id;
      const thumbnail = req.body.thumbnail;

      const result = await ProductCol.updateOne(
        { _id: id },
        {
          $set: {
            thumbnail,
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
  updateRar: async (req, res) => {
    try {
      const id = req.params.id;
      const source_file = req.body.source_file;

      const result = await ProductCol.updateOne(
        { _id: id },
        {
          $set: {
            source_file,
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

  uploadProduk: async (req, res, next) => {
    try {
      const val = await ProductValidation.valid(req.body);

      const data = new ProductCol({
        name_product: val.name_product,
        description: val.description,
        category: val.category,
        type_product: val.type_product,
        thumbnail: val.thumbnail,
        source_file: val.source_file,
        thumbnail_public_id: val.thumbnail_public_id,
      });

      await data.save();

      res.status(200).send({ message: "Upload Success" });
    } catch (error) {
      next(error);
    }
  },

  getUsers: async (req, res, next) => {
    try {
      const limit = req.query.limit || 0;
      const offset = req.query.offset || 0;
      const result = await UserCol.find().skip(offset).limit(limit);

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },

  putMembership: async (req, res) => {
    try {
      const id = req.params.id;
      let is_membership = req.body.is_membership;

      const result = await UserCol.findOneAndUpdate(
        { _id: id },
        {
          $set: {
            is_membership: is_membership,
          },
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

  deleteProductById: async (req, res, next) => {
    try {
      const id = req.params.id;

      const validObjectID = isObjectID(id);
      if (!validObjectID) {
        throw new ResponseErr(400, "ID Invalid");
      }

      const result = await ProductCol.deleteOne({ _id: id });

      if (result.deletedCount === 0) {
        throw new ResponseErr(404, "Product Not Found");
      }

      res.status(200).json({ message: "Delete Success" });
    } catch (error) {
      next(error);
    }
  },

  deleteUserById: async (req, res) => {
    try {
      const filter = req.params.id;

      // delete user
      const result = await UserCol.deleteOne({ _id: filter });

      if (result.deletedCount === 0) {
        return res.status(401).send({ message: "Delete Failed" });
      }

      res.json({ message: "Delete success" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  deleteThumbnail: async (req, res) => {
    try {
      const public_id = req.query.public_id;

      cloudinary.v2.uploader.destroy(public_id, function (error, result) {
        if (result) {
          return res.send(result);
        }
        res.send({ message: error });
      });
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  },

  deleteRawFile: async (req, res) => {
    try {
      const public_id = req.query.public_id;

      cloudinary.v2.uploader.destroy(
        public_id,
        { invalidate: true, resource_type: "raw" },
        function (error, result) {
          if (result) {
            return res.send(result);
          }
          res.send({ message: error });
        }
      );
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  },
};

export default adminController;
