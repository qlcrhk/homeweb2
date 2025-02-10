const express = require('express');
const Property = require('../models/Property');
const authenticate = require('../middleware/auth');
const adminCheck = require('../middleware/admin');

const router = express.Router();

/**
 * 매물 등록 (관리자 전용)
 */
router.post('/properties', authenticate, adminCheck, async (req, res) => {
  try {
    const { title, description, price, location, images } = req.body;

    if (images.length > 4) {
      return res.status(400).json({ message: '이미지는 최대 4개까지 업로드할 수 있습니다.' });
    }

    const newProperty = new Property({
      title,
      description,
      price,
      location,
      images
    });

    await newProperty.save();
    res.status(201).json({ message: '매물이 성공적으로 등록되었습니다.', property: newProperty });
  } catch (err) {
    res.status(500).json({ message: '서버 오류', error: err.message });
  }
});

/**
 * 매물 목록 조회 (모든 사용자 접근 가능)
 */
router.get('/properties', async (req, res) => {
  try {
    const properties = await Property.find().sort({ createdAt: -1 });
    res.json(properties);
  } catch (err) {
    res.status(500).json({ message: '서버 오류', error: err.message });
  }
});

/**
 * 매물 수정 (관리자 전용)
 */
router.put('/properties/:id', authenticate, adminCheck, async (req, res) => {
  try {
    const { title, description, price, location, images } = req.body;

    if (images && images.length > 4) {
      return res.status(400).json({ message: '이미지는 최대 4개까지 업로드할 수 있습니다.' });
    }

    const updatedProperty = await Property.findByIdAndUpdate(
      req.params.id,
      { title, description, price, location, images },
      { new: true }
    );

    if (!updatedProperty) {
      return res.status(404).json({ message: '매물을 찾을 수 없습니다.' });
    }

    res.json({ message: '매물이 성공적으로 수정되었습니다.', property: updatedProperty });
  } catch (err) {
    res.status(500).json({ message: '서버 오류', error: err.message });
  }
});

/**
 *  매물 삭제 (관리자 전용)
 */
router.delete('/properties/:id', authenticate, adminCheck, async (req, res) => {
  try {
    const deletedProperty = await Property.findByIdAndDelete(req.params.id);
    if (!deletedProperty) {
      return res.status(404).json({ message: '매물을 찾을 수 없습니다.' });
    }

    res.json({ message: '매물이 성공적으로 삭제되었습니다.' });
  } catch (err) {
    res.status(500).json({ message: '서버 오류', error: err.message });
  }
});

module.exports = router;
