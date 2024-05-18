const express = require("express");
const router = express.Router();
const postController = require("../controllers/post");

//라우터 렌더링
router.get('/create', (req, res) => {
    res.render('pages/create-post');
  });

// 게시글 작성
router.post("/", postController.createPost);

// 게시글 수정
router.put("/:postId", postController.updatePost);

// 게시글 삭제
router.delete("/:postId", postController.deletePost);

// 게시글 목록 조회
router.get("/", postController.getPosts);

// 게시글 상세 조회
router.get("/:postId", postController.getPostDetail);

// 아이템 등록
router.post("/:postId/item", postController.createItem);

// 아이템 수정
router.put("/:postId/item/:itemId", postController.updateItem);

// 아이템 삭제
router.delete("/:postId/item/:itemId", postController.deleteItem);

// 댓글 작성
router.post("/:postId/comment", postController.createComment);

// 댓글 수정
router.put("/:postId/comment/:commentId", postController.updateComment);

// 댓글 삭제
router.delete("/:postId/comment/:commentId", postController.deleteComment);

// 대댓글 작성
router.post("/:postId/comment/:commentId/reply", postController.createReply);

// 대댓글 수정
router.put(
  "/:postId/comment/:commentId/reply/:replyId",
  postController.updateReply
);

// 대댓글 삭제
router.delete(
  "/:postId/comment/:commentId/reply/:replyId",
  postController.deleteReply
);

// 좋아요 등록/취소
router.post("/:postId/like", postController.toggleLike);
// 게시글 작성 페이지 렌더링

module.exports = router;
