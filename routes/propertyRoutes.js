const express = require("express");
const axios = require("axios");
const path = require("path"); // 🔥 path 모듈 추가

const Property = require("../models/Property");
const { authenticateUser } = require("../middleware/auth");
require("dotenv").config(); // 🔥 .env 파일 로드

const router = express.Router();

// ✅ 매물 등록 (관리자만 가능)
router.post("/add", authenticateUser, async (req, res) => {
    try {
        console.log("📌 요청받은 데이터:", req.body); // 🔥 등록 요청 데이터 확인

        const { title, address, price, propertyType, description, images } = req.body;

        if (!req.user || !req.user.isAdmin) {
            return res.status(403).json({ message: "관리자만 등록 가능합니다." });
        }

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
        console.error("🔥 매물 등록 오류:", error);
        res.status(500).json({ message: "서버 오류", error: error.message });
    }
});

// ✅ 매물 조회 (지도 표시용) - propertyType 필터 적용 및 좌표 변환 보완
router.get("/", async (req, res) => {
    try {
        const { propertyType } = req.query;
        console.log("📌 요청받은 propertyType:", propertyType); // 🔥 백엔드에서 값 확인

        let filter = {};
        if (propertyType && propertyType !== "all") {
            filter.propertyType = propertyType;
        }

        console.log("📌 최종 필터 조건:", filter); // 🔥 필터가 적용되는지 확인!

        const properties = await Property.find(filter);
        const kakaoRestKey = process.env.KAKAO_REST_KEY;

        // 📌 카카오 API로 주소를 좌표로 변환
        const results = await Promise.all(properties.map(async (property) => {
            try {
                const response = await axios.get("https://dapi.kakao.com/v2/local/search/address.json", {
                    params: { query: property.address },
                    headers: { Authorization: `KakaoAK ${kakaoRestKey}` }
                });

                if (response.data.documents.length > 0) {
                    const { x, y } = response.data.documents[0]; // 경도(x), 위도(y)
                    return { ...property.toObject(), lat: y, lng: x };
                }
            } catch (err) {
                console.error(`📌 주소 변환 실패: ${property.address}`, err);
            }
            return { ...property.toObject(), lat: null, lng: null }; // 🔥 좌표 변환 실패 시 기본값
        }));

        res.json(results);
    } catch (error) {
        console.error("🔥 매물 조회 오류:", error);
        res.status(500).json({ message: "서버 오류", error: error.message });
    }
});

// ✅ 특정 매물 상세 조회 - 데이터 반환하도록 수정
router.get("/detail/:id", async (req, res) => {
    try {
        const property = await Property.findById(req.params.id);
        if (!property) {
            return res.status(404).json({ message: "매물을 찾을 수 없습니다." });
        }
        res.json(property);
    } catch (error) {
        console.error("🔥 매물 상세 조회 오류:", error);
        res.status(500).json({ message: "서버 오류", error: error.message });
    }
});


module.exports = router;
