const db = require('../models/db');

// Keep 등록/취소
exports.toggleKeep = (req, res) => {
  const postId = req.params.postId;
  const memberId = req.body.member_id;
  const query = `
    SELECT * FROM bookmark WHERE post_id = ? AND member_id = ?
  `;
  db.query(query, [postId, memberId], (err, result) => {
    if (err) throw err;
    if (result.length === 0) {
      // Keep 등록
      const query = `
        INSERT INTO bookmark (post_id, member_id) VALUES (?, ?)
      `;
      db.query(query, [postId, memberId], (err, result) => {
        if (err) throw err;
        res.send('Bookmarked successfully');
      });
    } else {
      // Keep 취소
      const query = `
        DELETE FROM bookmark WHERE post_id = ? AND member_id = ?
      `;
      db.query(query, [postId, memberId], (err, result) => {
        if (err) throw err;
        res.send('Bookmark removed successfully');
      });
    }
  });
};

// Keep 게시글 목록 조회
exports.getKeepPosts = (req, res) => {
  const memberId = req.params.userId;
  const query = `
    SELECT p.post_id, p.member_id, p.theme_id, p.post_title, p.post_content, p.hashtags, p.created_at, p.updated_at, p.views, p.likes, p.comments, p.bookmarks,
           m.username, m.nickname, m.profile_picture
    FROM post p
    JOIN member m ON p.member_id = m.member_id
    JOIN bookmark b ON p.post_id = b.post_id
    WHERE b.member_id = ?
    ORDER BY b.bookmarked_at DESC
  `;
  db.query(query, [memberId], (err, result) => {
    if (err) throw err;
    res.render('pages/profile', { posts: result });
  });
};