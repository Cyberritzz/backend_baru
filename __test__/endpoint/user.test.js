import app from "../../src/app";
import mongoose from "mongoose";
import UserCol from "../../src/model/userCol.js";
import supertest from "supertest";
import modelConstanta from "../../src/model/modelConstanta.js";
import ProductCol from "../../src/model/productCol.js";
import AdminCol from "../../src/model/adminCol.js";

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

const dataRegisterAdmin = {
  username: "haskuy",
  email: "hasksuy@gmail.com",
  password: "1234",
};

let token = "";
let tokenAdmin = "";

beforeAll(async function () {
  await mongoose.connect(process.env.DATABASE_URL_TEST);
  const db = mongoose.connection;
  db.on("error", (err) => console.log(err));

  await supertest(app).post("/admin/register").send(dataRegisterAdmin);

  const resAdmin = await supertest(app).post("/admin/login").send({
    email: dataRegisterAdmin.email,
    password: dataRegisterAdmin.password,
  });
  tokenAdmin = resAdmin.get("Set-Cookie")[0].split(";")[0].split("=")[1];

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
    category: modelConstanta.categoryProduct.mobile_design_figma,
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

describe("Download file user  level1 monthly", () => {
  let productId = "";
  let productidTemplate = "";
  let productidFree = "";
  let idUser = "";
  let token2 = "";
  const data = {
    name_product: "owi1",
    description: "this is a owi",
    category: modelConstanta.categoryProduct.web_design_figma,
    type_product: modelConstanta.typeProduct.premium,
    thumbnail_public_id: "12344",
    thumbnail: "https://example/png.com",
    source_file: "https://example.com",
  };

  const dataFree = {
    name_product: "owi1",
    description: "this is a owi",
    category: modelConstanta.categoryProduct.web_design_figma,
    type_product: modelConstanta.typeProduct.free,
    thumbnail_public_id: "12344",
    thumbnail: "https://example/png.com",
    source_file: "https://example.com",
  };

  const dataTemplate = {
    name_product: "owi1",
    description: "this is a owi",
    category: modelConstanta.categoryProduct.templates,
    type_product: modelConstanta.typeProduct.premium,
    thumbnail_public_id: "12344",
    thumbnail: "https://example/png.com",
    source_file: "https://example.com",
  };

  const dataRegister3 = {
    fullname: "hasankuy1",
    email: "hasankuy1@gmail.com",
    contact: "089899909090",
    password: "123",
  };

  beforeAll(async function () {
    const insert = new ProductCol(data);
    const result = await insert.save();
    productId = result._id.toString();

    const insertTemplate = new ProductCol(dataTemplate);
    const resulteTemplate = await insertTemplate.save();
    productidTemplate = resulteTemplate._id.toString();

    const insertFree = new ProductCol(dataFree);
    const resulteFree = await insertFree.save();
    productidFree = resulteFree._id.toString();

    await supertest(app).post("/register").send(dataRegister3);

    const res = await supertest(app).post("/login").send({
      email: dataRegister3.email,
      password: dataRegister3.password,
    });
    token2 = res.get("Set-Cookie")[0].split(";")[0].split("=")[1];

    const user = await UserCol.findOne({ fullname: dataRegister3.fullname });
    idUser = user.id;

    await supertest(app)
      .put(`/admin/dashboard/edit-membership/${user.id}`)
      .send({
        is_membership: modelConstanta.isMembership.level1_monthly,
      })
      .set("Cookie", [`token=${tokenAdmin}`]);
  });

  it("should success download premium product", async () => {
    const res = await supertest(app)
      .get(`/user/download/${productId}/${idUser}`)
      .set("Cookie", [`token=${token2}`]);

    expect(res.statusCode).toBe(200);
    expect(res.body).toBe(data.source_file);
  });

  it("should success download free product", async () => {
    const res = await supertest(app)
      .get(`/user/download/${productidFree}/${idUser}`)
      .set("Cookie", [`token=${token2}`]);

    expect(res.statusCode).toBe(200);
    expect(res.body).toBe(data.source_file);
  });

  it("should success error object id invalid", async () => {
    const res = await supertest(app)
      .get(`/user/download/9394j4k/892398239`)
      .set("Cookie", [`token=${token2}`]);

    expect(res.statusCode).toBe(400);
    expect(res.body.errors).toEqual([
      '"productID" is not valid',
      ' "userID" is not valid',
    ]);
  });

  it("should success error can't download template", async () => {
    const res = await supertest(app)
      .get(`/user/download/${productidTemplate}/${idUser}`)
      .set("Cookie", [`token=${token2}`]);

    expect(res.statusCode).toBe(403);
    expect(res.body.errors).toEqual(["Can't download template product"]);
  });

  afterAll(async function () {
    await ProductCol.deleteOne({ name_product: data.name_product });
    await ProductCol.deleteOne({ name_product: dataFree.name_product });
    await ProductCol.deleteOne({ name_product: dataTemplate.name_product });
    await UserCol.deleteOne({ _id: idUser });
    await AdminCol.deleteOne({ username: dataRegisterAdmin.username });
  });
});

describe("Download file user  level1 lifetime", () => {
  let productId = "";
  let productidTemplate = "";
  let productidFree = "";
  let idUser = "";
  let token2 = "";
  const data = {
    name_product: "owi1",
    description: "this is a owi",
    category: modelConstanta.categoryProduct.web_design_figma,
    type_product: modelConstanta.typeProduct.premium,
    thumbnail_public_id: "12344",
    thumbnail: "https://example/png.com",
    source_file: "https://example.com",
  };

  const dataFree = {
    name_product: "owi1",
    description: "this is a owi",
    category: modelConstanta.categoryProduct.web_design_figma,
    type_product: modelConstanta.typeProduct.free,
    thumbnail_public_id: "12344",
    thumbnail: "https://example/png.com",
    source_file: "https://example.com",
  };

  const dataTemplate = {
    name_product: "owi1",
    description: "this is a owi",
    category: modelConstanta.categoryProduct.templates,
    type_product: modelConstanta.typeProduct.premium,
    thumbnail_public_id: "12344",
    thumbnail: "https://example/png.com",
    source_file: "https://example.com",
  };

  const dataRegister3 = {
    fullname: "hasankuy1",
    email: "hasankuy1@gmail.com",
    contact: "089899909090",
    password: "123",
  };

  beforeAll(async function () {
    const insert = new ProductCol(data);
    const result = await insert.save();
    productId = result._id.toString();

    const insertTemplate = new ProductCol(dataTemplate);
    const resulteTemplate = await insertTemplate.save();
    productidTemplate = resulteTemplate._id.toString();

    const insertFree = new ProductCol(dataFree);
    const resulteFree = await insertFree.save();
    productidFree = resulteFree._id.toString();

    await supertest(app).post("/register").send(dataRegister3);

    const res = await supertest(app).post("/login").send({
      email: dataRegister3.email,
      password: dataRegister3.password,
    });
    token2 = res.get("Set-Cookie")[0].split(";")[0].split("=")[1];

    const user = await UserCol.findOne({ fullname: dataRegister3.fullname });
    idUser = user.id;

    await supertest(app)
      .put(`/admin/dashboard/edit-membership/${user.id}`)
      .send({
        is_membership: modelConstanta.isMembership.level1_lifetime,
      })
      .set("Cookie", [`token=${tokenAdmin}`]);
  });

  it("should success download premium product", async () => {
    const res = await supertest(app)
      .get(`/user/download/${productId}/${idUser}`)
      .set("Cookie", [`token=${token2}`]);

    expect(res.statusCode).toBe(200);
    expect(res.body).toBe(data.source_file);
  });

  it("should success download free product", async () => {
    const res = await supertest(app)
      .get(`/user/download/${productidFree}/${idUser}`)
      .set("Cookie", [`token=${token2}`]);

    expect(res.statusCode).toBe(200);
    expect(res.body).toBe(data.source_file);
  });

  it("should success error object id invalid", async () => {
    const res = await supertest(app)
      .get(`/user/download/9394j4k/892398239`)
      .set("Cookie", [`token=${token2}`]);

    expect(res.statusCode).toBe(400);
    expect(res.body.errors).toEqual([
      '"productID" is not valid',
      ' "userID" is not valid',
    ]);
  });

  it("should success error can't download template", async () => {
    const res = await supertest(app)
      .get(`/user/download/${productidTemplate}/${idUser}`)
      .set("Cookie", [`token=${token2}`]);

    expect(res.statusCode).toBe(403);
    expect(res.body.errors).toEqual(["Can't download template product"]);
  });

  afterAll(async function () {
    await ProductCol.deleteOne({ name_product: data.name_product });
    await ProductCol.deleteOne({ name_product: dataFree.name_product });
    await ProductCol.deleteOne({ name_product: dataTemplate.name_product });
    await UserCol.deleteOne({ _id: idUser });
    await AdminCol.deleteOne({ username: dataRegisterAdmin.username });
  });
});

describe("Download file user level2 monthly", () => {
  let productId = "";
  let productidTemplate = "";
  let productidFree = "";
  let idUser = "";
  let token2 = "";
  const data = {
    name_product: "owi1",
    description: "this is a owi",
    category: modelConstanta.categoryProduct.web_design_figma,
    type_product: modelConstanta.typeProduct.premium,
    thumbnail_public_id: "12344",
    thumbnail: "https://example/png.com",
    source_file: "https://example.com",
  };

  const dataFree = {
    name_product: "owi1",
    description: "this is a owi",
    category: modelConstanta.categoryProduct.web_design_figma,
    type_product: modelConstanta.typeProduct.free,
    thumbnail_public_id: "12344",
    thumbnail: "https://example/png.com",
    source_file: "https://example.com",
  };

  const dataTemplate = {
    name_product: "owi1",
    description: "this is a owi",
    category: modelConstanta.categoryProduct.templates,
    type_product: modelConstanta.typeProduct.premium,
    thumbnail_public_id: "12344",
    thumbnail: "https://example/png.com",
    source_file: "https://example.com",
  };

  const dataRegister3 = {
    fullname: "hasankuy1",
    email: "hasankuy1@gmail.com",
    contact: "089899909090",
    password: "123",
  };

  beforeAll(async function () {
    const insert = new ProductCol(data);
    const result = await insert.save();
    productId = result._id.toString();

    const insertTemplate = new ProductCol(dataTemplate);
    const resulteTemplate = await insertTemplate.save();
    productidTemplate = resulteTemplate._id.toString();

    const insertFree = new ProductCol(dataFree);
    const resulteFree = await insertFree.save();
    productidFree = resulteFree._id.toString();

    await supertest(app).post("/register").send(dataRegister3);

    const res = await supertest(app).post("/login").send({
      email: dataRegister3.email,
      password: dataRegister3.password,
    });
    token2 = res.get("Set-Cookie")[0].split(";")[0].split("=")[1];

    const user = await UserCol.findOne({ fullname: dataRegister3.fullname });
    idUser = user.id;

    await supertest(app)
      .put(`/admin/dashboard/edit-membership/${user.id}`)
      .send({
        is_membership: modelConstanta.isMembership.level2_monthly,
      })
      .set("Cookie", [`token=${tokenAdmin}`]);
  });

  it("should success download premium product", async () => {
    const res = await supertest(app)
      .get(`/user/download/${productId}/${idUser}`)
      .set("Cookie", [`token=${token2}`]);

    expect(res.statusCode).toBe(200);
    expect(res.body).toBe(data.source_file);
  });

  it("should success download free product", async () => {
    const res = await supertest(app)
      .get(`/user/download/${productidFree}/${idUser}`)
      .set("Cookie", [`token=${token2}`]);

    expect(res.statusCode).toBe(200);
    expect(res.body).toBe(data.source_file);
  });

  it("should success error object id invalid", async () => {
    const res = await supertest(app)
      .get(`/user/download/9394j4k/892398239`)
      .set("Cookie", [`token=${token2}`]);

    expect(res.statusCode).toBe(400);
    expect(res.body.errors).toEqual([
      '"productID" is not valid',
      ' "userID" is not valid',
    ]);
  });

  it("should success error can download template", async () => {
    const res = await supertest(app)
      .get(`/user/download/${productidTemplate}/${idUser}`)
      .set("Cookie", [`token=${token2}`]);

    expect(res.statusCode).toBe(200);
    expect(res.body).toBe(dataTemplate.source_file);
  });

  afterAll(async function () {
    await ProductCol.deleteOne({ name_product: data.name_product });
    await ProductCol.deleteOne({ name_product: dataFree.name_product });
    await ProductCol.deleteOne({ name_product: dataTemplate.name_product });
    await UserCol.deleteOne({ _id: idUser });
    await AdminCol.deleteOne({ username: dataRegisterAdmin.username });
  });
});

describe("Download file user level2 lifetime", () => {
  let productId = "";
  let productidTemplate = "";
  let productidFree = "";
  let idUser = "";
  let token2 = "";
  const data = {
    name_product: "owi1",
    description: "this is a owi",
    category: modelConstanta.categoryProduct.web_design_figma,
    type_product: modelConstanta.typeProduct.premium,
    thumbnail_public_id: "12344",
    thumbnail: "https://example/png.com",
    source_file: "https://example.com",
  };

  const dataFree = {
    name_product: "owi1",
    description: "this is a owi",
    category: modelConstanta.categoryProduct.web_design_figma,
    type_product: modelConstanta.typeProduct.free,
    thumbnail_public_id: "12344",
    thumbnail: "https://example/png.com",
    source_file: "https://example.com",
  };

  const dataTemplate = {
    name_product: "owi1",
    description: "this is a owi",
    category: modelConstanta.categoryProduct.templates,
    type_product: modelConstanta.typeProduct.premium,
    thumbnail_public_id: "12344",
    thumbnail: "https://example/png.com",
    source_file: "https://example.com",
  };

  const dataRegister3 = {
    fullname: "hasankuy1",
    email: "hasankuy1@gmail.com",
    contact: "089899909090",
    password: "123",
  };

  beforeAll(async function () {
    const insert = new ProductCol(data);
    const result = await insert.save();
    productId = result._id.toString();

    const insertTemplate = new ProductCol(dataTemplate);
    const resulteTemplate = await insertTemplate.save();
    productidTemplate = resulteTemplate._id.toString();

    const insertFree = new ProductCol(dataFree);
    const resulteFree = await insertFree.save();
    productidFree = resulteFree._id.toString();

    await supertest(app).post("/register").send(dataRegister3);

    const res = await supertest(app).post("/login").send({
      email: dataRegister3.email,
      password: dataRegister3.password,
    });
    token2 = res.get("Set-Cookie")[0].split(";")[0].split("=")[1];

    const user = await UserCol.findOne({ fullname: dataRegister3.fullname });
    idUser = user.id;

    await supertest(app)
      .put(`/admin/dashboard/edit-membership/${user.id}`)
      .send({
        is_membership: modelConstanta.isMembership.level2_lifetime,
      })
      .set("Cookie", [`token=${tokenAdmin}`]);
  });

  it("should success download premium product", async () => {
    const res = await supertest(app)
      .get(`/user/download/${productId}/${idUser}`)
      .set("Cookie", [`token=${token2}`]);

    expect(res.statusCode).toBe(200);
    expect(res.body).toBe(data.source_file);
  });

  it("should success download free product", async () => {
    const res = await supertest(app)
      .get(`/user/download/${productidFree}/${idUser}`)
      .set("Cookie", [`token=${token2}`]);

    expect(res.statusCode).toBe(200);
    expect(res.body).toBe(data.source_file);
  });

  it("should success error object id invalid", async () => {
    const res = await supertest(app)
      .get(`/user/download/9394j4k/892398239`)
      .set("Cookie", [`token=${token2}`]);

    expect(res.statusCode).toBe(400);
    expect(res.body.errors).toEqual([
      '"productID" is not valid',
      ' "userID" is not valid',
    ]);
  });

  it("should success error can download template", async () => {
    const res = await supertest(app)
      .get(`/user/download/${productidTemplate}/${idUser}`)
      .set("Cookie", [`token=${token2}`]);

    expect(res.statusCode).toBe(200);
    expect(res.body).toBe(dataTemplate.source_file);
  });

  afterAll(async function () {
    await ProductCol.deleteOne({ name_product: data.name_product });
    await ProductCol.deleteOne({ name_product: dataFree.name_product });
    await ProductCol.deleteOne({ name_product: dataTemplate.name_product });
    await UserCol.deleteOne({ _id: idUser });
    await AdminCol.deleteOne({ username: dataRegisterAdmin.username });
  });
});
