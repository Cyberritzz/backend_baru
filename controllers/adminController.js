import fs from "fs";
import idGenerator from "../utility/idGenerator.js";

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
      const result = await prisma.product.findMany();

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
      const data = {
        name_product: req.body.name_product,
        description: req.body.description,
        category: req.body.category,
        type_product: req.body.type_product,
      };

      const result = await prisma.product.update({
        where: {
          id: id,
        },
        data: data,
      });

      if (!result) {
        res.status(500).send({ message: "Update Failed" });
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
      // Menggunakan properti .filename untuk mendapatkan nama file yang di-upload
      const sourceFile = req.files["source_file"][0]
        ? req.files["source_file"][0].filename
        : null;
      const thumbnail = req.files["thumbnail"][0]
        ? req.files["thumbnail"][0].filename
        : null;

      const sourceFileUrl = sourceFile
        ? `${req.protocol}://${req.get("host")}/uploads/${sourceFile}`
        : null;
      const thumbnailUrl = thumbnail
        ? `${req.protocol}://${req.get("host")}/uploads/${thumbnail}`
        : null;

      const id = idGenerator();
      const data = {
        id,
        name_product: req.body.name_product,
        thumbnail: thumbnailUrl,
        source_file: sourceFileUrl,
        description: req.body.description,
        category: req.body.category,
        type_product: req.body.type_product,
      };

      const result = await prisma.product.create({ data });

      if (!result) {
        res.status(500).send({ message: "Upload Failed" });
      }

      res.status(200).send({ message: "Upload Success" });
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  },

  getUsers: async (req, res) => {
    try {
      const result = await prisma.user.findMany();
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
};

export default adminController;
