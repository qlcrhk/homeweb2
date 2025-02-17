const express = require("express");
const axios = require("axios");
const Property = require("../models/Property");
const { authenticateUser } = require("../middleware/auth");
require("dotenv").config(); // 🔥 .env 파일 로드

const router = express.Router();

// ✅ 매물 등록 (관리자만 가능)
router.post("/add", authenticateUser, async (req, res) => {
    try {
        const { title, address, price, propertyType, description, images } = req.body;

        // ✅ 관리자 확인
        if (!req.user.isAdmin) {
            return res.status(403).json({ message: "관리자만 등록 가능합니다." });
        }

        // ✅ 이미지 URL 최대 4개 제한
        if (!Array.isArray(images) || images.length > 4) {
            return res.status(400).json({ message: "이미지는 최대 4개까지만 등록 가능합니다." });
        }

        const newProperty = new Property({
            title,
            address,
            price,
            propertyType,
            description,
            images,
            createdBy: req.user.id
        });

        await newProperty.save();
        res.status(201).json({ message: "매물 등록 성공!" });
    } catch (error) {
        res.status(500).json({ message: "서버 오류", error: error.message });
    }
});

// ✅ 매물 조회 (지도 표시용) - 주소를 좌표로 변환 후 반환
router.get("/", async (req, res) => {
    try {
        const properties = await Property.find(); // MongoDB에서 모든 매물 데이터 가져오기
        const kakaoRestKey = process.env.KAKAO_REST_KEY; // 🔥 .env에서 REST API 키 가져오기

        // 📌 카카오 지오코딩 API를 사용해 주소 → 좌표 변환
        const results = await Promise.all(properties.map(async (property) => {
            try {
                const response = await axios.get("https://dapi.kakao.com/v2/local/search/address.json", {
                    params: { query: property.address },
                    headers: { Authorization: `KakaoAK ${kakaoRestKey}` } // 🔥 .env에서 가져온 REST API 키 사용
                });

                // 주소 변환 성공 시 위도(y), 경도(x) 반환
                if (response.data.documents.length > 0) {
                    const { x, y } = response.data.documents[0];
                    return { ...property._doc, lat: y, lng: x };
                }
            } catch (err) {
                console.error(`📌 주소 변환 실패: ${property.address}`);
            }
            return { ...property._doc, lat: null, lng: null };
        }));

        res.json(results);
    } catch (error) {
        res.status(500).json({ message: "서버 오류", error: error.message });
    }
});

module.exports = router;
