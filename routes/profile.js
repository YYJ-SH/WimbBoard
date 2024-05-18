const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profile');

// Keep 등록/취소
router.post('/:postId/keep', profileController.toggleKeep);

// Keep 게시글 목록 조회
router.get('/user/:userId/keep', profileController.getKeepPosts);

module.exports = router;