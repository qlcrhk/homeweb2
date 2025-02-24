const mongoose = require("mongoose");

const PropertySchema = new mongoose.Schema({
    title: { type: String, required: true },
    address: { type: String, required: true },
    price: { type: Number, required: true },
    propertyType: { type: String, required: true, enum: ["apartment", "one-room", "store"] }, // 🔥 영어로 저장
    description: { type: String, required: true },
    images: [{ type: String }],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Property", PropertySchema);
