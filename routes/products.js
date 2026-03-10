var express = require('express');
var router = express.Router();
let productModel = require('../schemas/products')

// Dữ liệu mẫu cho READ ALL (không cần truy vấn)
const mockProducts = [
  {
    _id: "65f1a2b3c4d5e6f7a8b9c0d1",
    title: "Sản phẩm 1",
    slug: "san-pham-1",
    price: 100000,
    description: "Mô tả sản phẩm 1",
    images: ["https://i.imgur.com/ZANVnHE.jpeg"],
    category: "65f1a2b3c4d5e6f7a8b9c0d2"
  },
  {
    _id: "65f1a2b3c4d5e6f7a8b9c0d3",
    title: "Sản phẩm 2",
    slug: "san-pham-2",
    price: 200000,
    description: "Mô tả sản phẩm 2",
    images: ["https://i.imgur.com/ZANVnHE.jpeg"],
    category: "65f1a2b3c4d5e6f7a8b9c0d2"
  }
];

// READ ALL - Lấy danh sách tất cả sản phẩm (không cần truy vấn)
router.get('/', function(req, res, next) {
  try {
    res.status(200).json({
      success: true,
      message: "Lấy danh sách sản phẩm thành công",
      data: mockProducts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy danh sách sản phẩm",
      error: error.message
    });
  }
});

// READ BY ID - Lấy sản phẩm theo ID
router.get('/:id', async function(req, res, next) {
  try {
    const { id } = req.params;

    // Kiểm tra ID hợp lệ
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: "ID không hợp lệ"
      });
    }

    const product = await productModel.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy sản phẩm"
      });
    }

    res.status(200).json({
      success: true,
      message: "Lấy sản phẩm thành công",
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy sản phẩm",
      error: error.message
    });
  }
});

// CREATE - Tạo sản phẩm mới
router.post('/', async function(req, res, next) {
  try {
    const { title, slug, price, description, images, category } = req.body;

    // Kiểm tra dữ liệu bắt buộc
    if (!title || !slug || !category) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng cung cấp đầy đủ thông tin bắt buộc (title, slug, category)"
      });
    }

    // Tạo sản phẩm mới
    const newProduct = new productModel({
      title,
      slug,
      price: price || 0,
      description: description || "",
      images: images || [],
      category
    });

    const savedProduct = await newProduct.save();

    res.status(201).json({
      success: true,
      message: "Tạo sản phẩm thành công",
      data: savedProduct
    });
  } catch (error) {
    // Xử lý lỗi validation
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({
        success: false,
        message: `${field} đã tồn tại`
      });
    }

    res.status(500).json({
      success: false,
      message: "Lỗi khi tạo sản phẩm",
      error: error.message
    });
  }
});

// UPDATE - Cập nhật sản phẩm
router.put('/:id', async function(req, res, next) {
  try {
    const { id } = req.params;
    const { title, slug, price, description, images, category } = req.body;

    // Kiểm tra ID hợp lệ
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: "ID không hợp lệ"
      });
    }

    const product = await productModel.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy sản phẩm"
      });
    }

    // Cập nhật các trường được gửi
    if (title) product.title = title;
    if (slug) product.slug = slug;
    if (price !== undefined) product.price = price;
    if (description) product.description = description;
    if (images) product.images = images;
    if (category) product.category = category;

    const updatedProduct = await product.save();

    res.status(200).json({
      success: true,
      message: "Cập nhật sản phẩm thành công",
      data: updatedProduct
    });
  } catch (error) {
    // Xử lý lỗi validation
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({
        success: false,
        message: `${field} đã tồn tại`
      });
    }

    res.status(500).json({
      success: false,
      message: "Lỗi khi cập nhật sản phẩm",
      error: error.message
    });
  }
});

// DELETE - Xóa sản phẩm
router.delete('/:id', async function(req, res, next) {
  try {
    const { id } = req.params;

    // Kiểm tra ID hợp lệ
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: "ID không hợp lệ"
      });
    }

    const product = await productModel.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy sản phẩm"
      });
    }

    res.status(200).json({
      success: true,
      message: "Xóa sản phẩm thành công",
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi xóa sản phẩm",
      error: error.message
    });
  }
});

module.exports = router;
