import mongoose from "mongoose";
import Product from "../models/Product.js";

// PUBLIC: GET /api/products
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find({ isActive: true })
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      count: products.length,
      products,
    });
  } catch (error) {
    console.error("Get products error:", error.message);
    return res.status(500).json({ error: "Unable to retrieve products" });
  }
};

// ADMIN: GET /api/products/admin/all
export const getAdminProducts = async (req, res) => {
  try {
    const products = await Product.find({})
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      count: products.length,
      products,
    });
  } catch (error) {
    console.error("Admin products error:", error.message);
    return res.status(500).json({ error: "Unable to retrieve products" });
  }
};

// PUBLIC: GET /api/products/:id
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const isObjectId = mongoose.isValidObjectId(id);

    const product = await Product.findOne({
      isActive: true,
      ...(isObjectId ? { _id: id } : { slug: id }),
    }).lean();

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    return res.status(200).json({ product });
  } catch (error) {
    console.error("Get product error:", error.message);
    return res.status(500).json({ error: "Unable to retrieve product" });
  }
};

// ADMIN: POST /api/products
export const createProduct = async (req, res) => {
  try {
    const {
      name,
      slug,
      description,
      price,
      images = [],
      sizes = [],
      category = "Clothing",
      stock = 0,
      allowPreorder = false,
      isActive = true,
      featured = false,
    } = req.body;

    if (
      typeof name !== "string" ||
      !name.trim() ||
      typeof description !== "string" ||
      !description.trim() ||
      price === "" ||
      price === null ||
      price === undefined ||
      !Number.isFinite(Number(price)) ||
      Number(price) < 0
    ) {
      return res.status(400).json({
        error: "Valid name, description and non-negative price are required",
      });
    }

    if (
      !Array.isArray(images) ||
      !images.every((image) => typeof image === "string") ||
      !Array.isArray(sizes) ||
      !sizes.every((size) => typeof size === "string")
    ) {
      return res.status(400).json({
        error: "Images and sizes must be arrays of strings",
      });
    }

    if (
      !Number.isInteger(Number(stock)) ||
      Number(stock) < 0
    ) {
      return res.status(400).json({
        error: "Stock must be a non-negative whole number",
      });
    }

    if (
      typeof category !== "string" ||
      typeof allowPreorder !== "boolean" ||
      typeof isActive !== "boolean" ||
      typeof featured !== "boolean"
    ) {
      return res.status(400).json({
        error: "Invalid category or product settings",
      });
    }

    const productSlug = (
      typeof slug === "string" && slug.trim() ? slug : name
    )
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    if (!productSlug) {
      return res.status(400).json({ error: "A valid slug is required" });
    }

    const product = await Product.create({
      name: name.trim(),
      slug: productSlug,
      description: description.trim(),
      price: Number(price),
      images: images.map((image) => image.trim()).filter(Boolean),
      sizes: sizes.map((size) => size.trim()).filter(Boolean),
      category: category.trim() || "Clothing",
      stock: Number(stock),
      allowPreorder,
      isActive,
      featured,
    });

    return res.status(201).json({
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        error: "A product with this slug already exists",
      });
    }

    if (error.name === "ValidationError" || error.name === "CastError") {
      return res.status(400).json({ error: error.message });
    }

    console.error("Create product error:", error.message);
    return res.status(500).json({ error: "Unable to create product" });
  }
};

// ADMIN: PUT /api/products/:id
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ error: "Invalid product ID" });
    }

    const allowedFields = [
      "name",
      "slug",
      "description",
      "price",
      "images",
      "sizes",
      "category",
      "stock",
      "allowPreorder",
      "isActive",
      "featured",
    ];

    const updates = {};

    for (const field of allowedFields) {
      if (Object.prototype.hasOwnProperty.call(req.body, field)) {
        updates[field] = req.body[field];
      }
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: "No changes were provided" });
    }

    if ("name" in updates) {
      if (typeof updates.name !== "string" || !updates.name.trim()) {
        return res.status(400).json({ error: "Product name is required" });
      }
      updates.name = updates.name.trim();
    }

    if ("slug" in updates) {
      if (typeof updates.slug !== "string" || !updates.slug.trim()) {
        return res.status(400).json({ error: "Product slug is required" });
      }
      updates.slug = updates.slug.trim().toLowerCase();
    }

    if ("description" in updates) {
      if (
        typeof updates.description !== "string" ||
        !updates.description.trim()
      ) {
        return res.status(400).json({ error: "Description is required" });
      }
      updates.description = updates.description.trim();
    }

    if ("price" in updates) {
      if (
        updates.price === "" ||
        !Number.isFinite(Number(updates.price)) ||
        Number(updates.price) < 0
      ) {
        return res.status(400).json({ error: "Invalid price" });
      }
      updates.price = Number(updates.price);
    }

    if ("stock" in updates) {
      if (
        !Number.isInteger(Number(updates.stock)) ||
        Number(updates.stock) < 0
      ) {
        return res.status(400).json({
          error: "Stock must be a non-negative whole number",
        });
      }
      updates.stock = Number(updates.stock);
    }

    if ("images" in updates) {
      if (
        !Array.isArray(updates.images) ||
        !updates.images.every((item) => typeof item === "string")
      ) {
        return res.status(400).json({ error: "Images must be an array" });
      }
      updates.images = updates.images.map((item) => item.trim()).filter(Boolean);
    }

    if ("sizes" in updates) {
      if (
        !Array.isArray(updates.sizes) ||
        !updates.sizes.every((item) => typeof item === "string")
      ) {
        return res.status(400).json({ error: "Sizes must be an array" });
      }
      updates.sizes = updates.sizes.map((item) => item.trim()).filter(Boolean);
    }

    if ("category" in updates) {
      if (typeof updates.category !== "string") {
        return res.status(400).json({ error: "Invalid category" });
      }
      updates.category = updates.category.trim() || "Clothing";
    }

    for (const field of ["allowPreorder", "isActive", "featured"]) {
      if (field in updates && typeof updates[field] !== "boolean") {
        return res.status(400).json({ error: `Invalid ${field} value` });
      }
    }

    const product = await Product.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    return res.status(200).json({
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ error: "That product slug already exists" });
    }

    if (error.name === "ValidationError" || error.name === "CastError") {
      return res.status(400).json({ error: error.message });
    }

    console.error("Update product error:", error.message);
    return res.status(500).json({ error: "Unable to update product" });
  }
};

// ADMIN: DELETE /api/products/:id
export const deleteProduct = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: "Invalid product ID" });
    }

    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    return res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Delete product error:", error.message);
    return res.status(500).json({ error: "Unable to delete product" });
  }
};

// ADMIN: PATCH /api/products/:id/inventory
export const updateInventory = async (req, res) => {
  try {
    const { stock, allowPreorder } = req.body;

    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: "Invalid product ID" });
    }

    const updates = {};

    if (stock !== undefined) {
      if (
        stock === "" ||
        !Number.isInteger(Number(stock)) ||
        Number(stock) < 0
      ) {
        return res.status(400).json({
          error: "Stock must be a non-negative whole number",
        });
      }
      updates.stock = Number(stock);
    }

    if (allowPreorder !== undefined) {
      if (typeof allowPreorder !== "boolean") {
        return res.status(400).json({ error: "Invalid preorder setting" });
      }
      updates.allowPreorder = allowPreorder;
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: "No inventory changes provided" });
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true },
    );

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    return res.status(200).json({
      message: "Inventory updated successfully",
      product,
    });
  } catch (error) {
    console.error("Inventory update error:", error.message);
    return res.status(500).json({ error: "Unable to update inventory" });
  }
};

// ADMIN: PATCH /api/products/:id/status
export const updateProductStatus = async (req, res) => {
  try {
    const { isActive } = req.body;

    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: "Invalid product ID" });
    }

    if (typeof isActive !== "boolean") {
      return res.status(400).json({ error: "isActive must be true or false" });
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { isActive },
      { new: true, runValidators: true },
    );

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    return res.status(200).json({
      message: `Product ${isActive ? "published" : "unpublished"} successfully`,
      product,
    });
  } catch (error) {
    console.error("Product status error:", error.message);
    return res.status(500).json({ error: "Unable to change product status" });
  }
};