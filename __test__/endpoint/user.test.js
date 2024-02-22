import app from "../../src/app";
import mongoose, { model } from "mongoose";
import UserCol from "../../src/model/userCol.js";
import supertest from "supertest";
import modelConstanta from "../../src/model/modelConstanta.js";
import ProductCol from "../../src/model/productCol.js";

const dataRegister = {
  fullname: "hasan",
  email: "hasan@gmail.com",
  contact: "089899909090",
  password: "123",
};

const dataRegister2 = {
  fullname: "hasankuy",
  email: "hasankuy@gmail.com",
  contact: "089899909090",
  password: "123",
};

let token = "";

beforeAll(async function () {
  await mongoose.connect(process.env.DATABASE_URL_TEST);
  const db = mongoose.connection;
  db.on("error", (err) => console.log(err));

  await supertest(app).post("/register").send(dataRegister);
  await supertest(app).post("/register").send(dataRegister2);
  const res = await supertest(app).post("/login").send({
    email: dataRegister.email,
    password: dataRegister.password,
  });
  token = res.get("Set-Cookie")[0].split(";")[0].split("=")[1];
});

afterAll(async function () {
  await UserCol.deleteOne({ fullname: dataRegister.fullname });
  await UserCol.deleteOne({ fullname: dataRegister2.fullname });
  await mongoose.connection.close();
});

describe("Download file user free", () => {
  let productId = "";
  let idUser = "";
  let idUserFreeDownloadPremium = "";

  let productIdPremium = "";
  const data = {
    name_product: "owi1",
    description: "this is a owi",
    category: modelConstanta.categoryProduct.templates,
    type_product: modelConstanta.typeProduct.free,
    thumbnail_public_id: "12344",
    thumbnail: "https://example/png.com",
    source_file: "https://example.com",
  };

  const dataPremium = {
    name_product: "owipremium",
    description: "this is a owi",
    category: modelConstanta.categoryProduct.templates,
    type_product: modelConstanta.typeProduct.premium,
    thumbnail_public_id: "12344",
    thumbnail: "https://example/png.com",
    source_file: "https://example.com",
  };
  beforeAll(async function () {
    const insert = new ProductCol(data);
    const result = await insert.save();
    productId = result._id.toString();

    const preInsert = new ProductCol(dataPremium);
    const re = await preInsert.save();
    productIdPremium = re._id.toString();

    const user = await UserCol.findOne({ fullname: dataRegister.fullname });
    idUser = user.id;

    const user2 = await UserCol.findOne({ fullname: dataRegister2.fullname });
    idUserFreeDownloadPremium = user2.id;
  });

  it("should success", async () => {
    const res = await supertest(app)
      .get(`/user/download/${productId}/${idUser}`)
      .set("Cookie", [`token=${token}`]);

    expect(res.statusCode).toBe(200);
    expect(res.body).toBe(data.source_file);
  });

  it("should error limit", async () => {
    await supertest(app)
      .get(`/user/download/${productId}/${idUser}`)
      .set("Cookie", [`token=${token}`]);
    await supertest(app)
      .get(`/user/download/${productId}/${idUser}`)
      .set("Cookie", [`token=${token}`]);
    await supertest(app)
      .get(`/user/download/${productId}/${idUser}`)
      .set("Cookie", [`token=${token}`]);
    const res = await supertest(app)
      .get(`/user/download/${productId}/${idUser}`)
      .set("Cookie", [`token=${token}`]);

    expect(res.statusCode).toBe(403);
    expect(res.body.errors).toEqual(["Limit reached"]);
  });

  it("should error objectid invalid", async () => {
    const res = await supertest(app)
      .get(`/user/download/93048593fass0/829492ss`)
      .set("Cookie", [`token=${token}`]);

    expect(res.statusCode).toBe(400);
    expect(res.body.errors).toEqual([
      '"productID" is not valid',
      ' "userID" is not valid',
    ]);
  });

  it("should error user free can't download product premium", async () => {
    const res = await supertest(app)
      .get(`/user/download/${productIdPremium}/${idUserFreeDownloadPremium}`)
      .set("Cookie", [`token=${token}`]);

    expect(res.statusCode).toBe(403);
    expect(res.body.errors).toEqual(["Can't download premium product"]);
  });

  afterAll(async function () {
    await ProductCol.deleteOne({ name_product: data.name_product });
    await ProductCol.deleteOne({ name_product: dataPremium.name_product });
  });
});

// describe("Download file user premium", () => {
//   let productId = "";
//   let idUser = "";
//   const data = {
//     name_product: "owi1",
//     description: "this is a owi",
//     category: modelConstanta.categoryProduct.templates,
//     type_product: modelConstanta.typeProduct.premium,
//     thumbnail_public_id: "12344",
//     thumbnail: "https://example/png.com",
//     source_file: "https://example.com",
//   };
//   beforeAll(async function () {
//     const insert = new ProductCol(data);
//     const result = await insert.save();
//     productId = result._id.toString();

//     const user = await UserCol.findOne({ fullname: dataRegister.fullname });
//     idUser = user.id;
//   });
//   it("should success download premium product", async () => {
//     const res = await supertest(app)
//       .get(`/user/download/${productId}/${idUser}`)
//       .set("Cookie", [`token=${token}`]);

//     expect(res.statusCode).toBe(200);
//     expect(res.body).toBe(data.source_file);
//   });

//   afterAll(async function () {
//     await ProductCol.deleteOne({ name_product: data.name_product });
//   });
// });
