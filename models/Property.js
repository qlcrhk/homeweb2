const mongoose = require("mongoose");

const PropertySchema = new mongoose.Schema({
    title: { type: String, required: true },
    address: { type: String, required: true },
    price: { type: Number, required: true },
    propertyType: { type: String, required: true },
    description: { type: String, required: true },
    images: [{ type: String }], // ✅ 최대 4개의 이미지 URL 저장
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Property", PropertySchema);
