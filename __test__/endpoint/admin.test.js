import app from "../../src/app";
import mongoose from "mongoose";
import supertest from "supertest";
import AdminCol from "../../src/model/adminCol";
import modelConstanta from "../../src/model/modelConstanta";
import ProductCol from "../../src/model/productCol";

const dataRegister = {
  username: "haskuy",
  email: "hasksuy@gmail.com",
  password: "1234",
};

let token = "";

beforeAll(async function () {
  await mongoose.connect(process.env.DATABASE_URL_TEST);
  const db = mongoose.connection;
  db.on("error", (err) => console.log(err));

  await supertest(app).post("/admin/register").send(dataRegister);
  const res = await supertest(app).post("/admin/login").send({
    email: dataRegister.email,
    password: dataRegister.password,
  });
  token = res.get("Set-Cookie")[0].split(";")[0].split("=")[1];
});

afterAll(async function () {
  await AdminCol.deleteOne({ username: dataRegister.username });
  await mongoose.connection.close();
});

describe("Get product", () => {
  it("should success", async () => {
    const res = await supertest(app)
      .get("/admin/dashboard/product")
      .set("Cookie", [`token=${token}`]);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});

describe("Get user", () => {
  it("should success", async () => {
    const res = await supertest(app)
      .get("/admin/dashboard/get-users")
      .set("Cookie", [`token=${token}`]);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});

describe("Upload product", () => {
  const data = {
    name_product: "owi",
    description: "this is a owi",
    category: modelConstanta.categoryProduct.templates,
    type_product: modelConstanta.typeProduct.free,
    thumbnail_public_id: "12344",
    thumbnail: "https://example/png.com",
    source_file: "https://example.com",
  };
  it("should success", async () => {
    const res = await supertest(app)
      .post("/admin/dashboard/upload-product")
      .send(data)
      .set("Cookie", [`token=${token}`]);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Upload Success");
  });

  it("should error required", async () => {
    const data = {
      name_product: " ",
      description: " ",
      category: " ",
      type_product: " ",
      thumbnail_public_id: " ",
      thumbnail: " ",
      source_file: " ",
    };

    const res = await supertest(app)
      .post("/admin/dashboard/upload-product")
      .send(data)
      .set("Cookie", [`token=${token}`]);
    expect(res.statusCode).toBe(400);
    expect(res.body.errors).toEqual([
      '"name_product" is not allowed to be empty',
      ' "description" is not allowed to be empty',
      ' "category" must be one of [mobile_design_figma, templates, web_design_figma]',
      ' "category" is not allowed to be empty',
      ' "type_product" must be one of [free, premium]',
      ' "type_product" is not allowed to be empty',
      ' "thumbnail_public_id" is not allowed to be empty',
      ' "thumbnail" is not allowed to be empty',
      ' "source_file" is not allowed to be empty',
    ]);
  });

  afterAll(async function () {
    await ProductCol.deleteOne({ name_product: data.name_product });
  });
});

describe("Update product", () => {
  let productId = "";
  beforeAll(async function () {
    const data = {
      name_product: "owi1",
      description: "this is a owi",
      category: modelConstanta.categoryProduct.templates,
      type_product: modelConstanta.typeProduct.free,
      thumbnail_public_id: "12344",
      thumbnail: "https://example/png.com",
      source_file: "https://example.com",
    };

    const insert = new ProductCol(data);
    const result = await insert.save();
    productId = result._id.toString();
  });

  it("should success", async () => {
    const data = {
      name_product: "owi1kun",
      description: "this is a owikun",
      category: modelConstanta.categoryProduct.mobile_design_figma,
      type_product: modelConstanta.typeProduct.premium,
      thumbnail_public_id: "12344kun",
      thumbnail: "https://example/jpg.com",
      source_file: "https://example1.com",
    };
    const res = await supertest(app)
      .put(`/admin/dashboard/update-product/${productId}`)
      .send(data)
      .set("Cookie", [`token=${token}`]);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Update Success");
  });

  it("should error required", async () => {
    const data = {
      name_product: " ",
      description: " ",
      category: " ",
      type_product: " ",
      thumbnail_public_id: " ",
      thumbnail: " ",
      source_file: " ",
    };
    const res = await supertest(app)
      .put(`/admin/dashboard/update-product/${productId}`)
      .send(data)
      .set("Cookie", [`token=${token}`]);

    expect(res.statusCode).toBe(400);
    expect(res.body.errors).toEqual([
      '"name_product" is not allowed to be empty',
      ' "description" is not allowed to be empty',
      ' "category" must be one of [mobile_design_figma, templates, web_design_figma]',
      ' "category" is not allowed to be empty',
      ' "type_product" must be one of [free, premium]',
      ' "type_product" is not allowed to be empty',
      ' "thumbnail_public_id" is not allowed to be empty',
      ' "thumbnail" is not allowed to be empty',
      ' "source_file" is not allowed to be empty',
    ]);
  });

  it("should not found", async () => {
    const data = {
      name_product: "mie",
      description: "mieku",
      category: modelConstanta.categoryProduct.templates,
      type_product: modelConstanta.typeProduct.free,
      thumbnail_public_id: "23",
      thumbnail: "https://example/jpg.com",
      source_file: "https://example.com",
    };
    const res = await supertest(app)
      .put(`/admin/dashboard/update-product/659522f33bbdf5cb8e8803f2`)
      .send(data)
      .set("Cookie", [`token=${token}`]);

    expect(res.statusCode).toBe(404);
    expect(res.body.errors).toEqual(["Product Not Found"]);
  });

  it("should error objectid invalid", async () => {
    const data = {
      name_product: "mie",
      description: "mieku",
      category: modelConstanta.categoryProduct.templates,
      type_product: modelConstanta.typeProduct.free,
      thumbnail_public_id: "23",
      thumbnail: "https://example/jpg.com",
      source_file: "https://example.com",
    };
    const res = await supertest(app)
      .put(`/admin/dashboard/update-product/893459834jk`)
      .send(data)
      .set("Cookie", [`token=${token}`]);

    expect(res.statusCode).toBe(400);
    expect(res.body.errors).toEqual(["ID Invalid"]);
  });

  afterAll(async function () {
    await ProductCol.deleteOne({ _id: productId });
  });
});

describe("Delete product", () => {
  let productId = "";
  beforeAll(async function () {
    const data = {
      name_product: "owi1",
      description: "this is a owi",
      category: modelConstanta.categoryProduct.templates,
      type_product: modelConstanta.typeProduct.free,
      thumbnail_public_id: "12344",
      thumbnail: "https://example/png.com",
      source_file: "https://example.com",
    };

    const insert = new ProductCol(data);
    const result = await insert.save();
    productId = result._id.toString();
  });

  it("should success", async () => {
    const res = await supertest(app)
      .delete(`/admin/dashboard/delete-product/${productId}`)
      .set("Cookie", [`token=${token}`]);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Delete Success");
  });

  it("should error not found", async () => {
    const res = await supertest(app)
      .delete(`/admin/dashboard/delete-product/659522f33bbdf5cb8e8803f2`)
      .set("Cookie", [`token=${token}`]);

    expect(res.statusCode).toBe(404);
    expect(res.body.errors).toEqual(["Product Not Found"]);
  });

  it("should error objectID params", async () => {
    const res = await supertest(app)
      .delete(`/admin/dashboard/delete-product/3484908ej`)
      .set("Cookie", [`token=${token}`]);

    expect(res.statusCode).toBe(400);
    expect(res.body.errors).toEqual(["ID Invalid"]);
  });

  afterAll(async function () {
    await ProductCol.deleteOne({ _id: productId });
  });
});
