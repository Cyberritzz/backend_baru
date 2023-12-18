import fs from "fs";
import ProductCol from "../model/productCol.js";
import UserCol from "../model/userCol.js";

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
      const result = await ProductCol.find();

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
      // const { name_product, description, category, type_product, thumbnail, source_file } = req.body;
      const { name_product, description, category, type_product } = req.body;

      const result = await ProductCol.updateOne(
        { _id: id },
        {
          $set: {
            name_product,
            description,
            category,
            type_product
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
      let id = req.params.id;

      // find dan hapus foto lama product
      const product = await prisma.product.findFirst({
        where: { id: id },
      });
      if (!product) {
        res.status(404).send({ message: "data not found" });
      }
      let path = product.thumbnail;
      path = path.substring(path.lastIndexOf("/") + 1);
      path = `./public/uploads/thumbnail/${path}`;
      console.log(path);

      // hapus foto lama
      fs.unlink(path, (err) => {
        if (err) {
          console.log(err);
          return;
        }
      });

      const thumbnail = req.files["thumbnail"][0]
        ? req.files["thumbnail"][0].filename
        : null;
      const thumbnailUrl = thumbnail
        ? `${req.protocol}://${req.get("host")}/uploads/${thumbnail}`
        : null;

      console.log(thumbnail);
      console.log(thumbnailUrl);
      const result = await prisma.product.update({
        where: {
          id: id,
        },
        data: {
          thumbnail: thumbnailUrl,
        },
      });

      if (!result) {
        res.status(500).send({ message: "Update Failed" });
      }

      res.status(200).send({ message: "Update Success" });
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  },
  updateRar: async (req, res) => {
    try {
      let id = req.params.id;

      // find dan hapus foto lama product
      const product = await prisma.product.findFirst({
        where: { id: id },
      });
      if (!product) {
        res.status(404).send({ message: "data not found" });
      }
      let path = product.source_file;
      path = path.substring(path.lastIndexOf("/") + 1);
      path = `./public/uploads/rar/${path}`;
      console.log(path);

      // hapus foto lama
      fs.unlink(path, (err) => {
        if (err) {
          console.log(err);
          return;
        }
      });

      const sourceFile = req.files["source_file"][0]
        ? req.files["source_file"][0].filename
        : null;
      const sourceFileUrl = sourceFile
        ? `${req.protocol}://${req.get("host")}/uploads/${sourceFile}`
        : null;

      console.log(sourceFile);
      console.log(sourceFileUrl);
      const result = await prisma.product.update({
        where: {
          id: id,
        },
        data: {
          source_file: sourceFileUrl,
        },
      });

      if (!result) {
        res.status(500).send({ message: "Update Failed" });
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
        source_file } = req.body;

      const data = new ProductCol({
        name_product: name_product,
        description: description,
        category: category,
        type_product: type_product,
        thumbnail: thumbnail,
        source_file: source_file,
      });

      await data.save();

      res.status(200).send({ message: "Upload Success" });
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  },

  getUsers: async (req, res) => {
    try {
      const result = await UserCol.find();
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

      const result = await prisma.user.update({
        where: { id: id },
        data: { is_membership: is_membership },
      });

      if (!result) {
        res.status(404).send({ message: "data not found" });
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
      // delete history
      // await prisma.history.deleteMany({ where : { id_user : filter }});

      res.json({message : 'Delete success'});
    } catch (error) {
      res.status(500).json({message: error.message});
    }
  }
};

export default adminController;
