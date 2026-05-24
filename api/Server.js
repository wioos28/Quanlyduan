require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());

// Kết nối vào MongoDB Atlas (Mật khẩu được lấy an toàn từ cấu hình Environment Variables trên Vercel)
mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log('✅ Đã kết nối thành công tới database Duanmoi!'))
    .catch(err => console.error('❌ Lỗi kết nối database rồi:', err));

// Định nghĩa cấu trúc bảng dữ liệu "ThongTin"
const ThongTinSchema = new mongoose.Schema({
    tieu_de: String
}, { timestamps: true });

const ThongTin = mongoose.model('ThongTin', ThongTinSchema, 'ThongTin');

// API: Lấy thông tin từ Database gửi về trang web
app.get('/api/data', async (req, res) => {
    try {
        const data = await ThongTin.find().sort({ createdAt: -1 }); // Lấy dữ liệu mới nhất lên đầu
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// API: Nhận thông tin từ trang web gửi lên để lưu vào Database
app.post('/api/data', async (req, res) => {
    try {
        const newData = new ThongTin({ tieu_de: req.body.tieu_de });
        await newData.save();
        res.status(201).json(newData);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// XUẤT APP RA: Đây là dòng cực kỳ quan trọng để Vercel chạy được Serverless
module.exports = app;
