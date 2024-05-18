const db = require('../models/db');

// 게시글 작성
exports.createPost = (req, res) => {
    const { member_id, theme_id, post_title, post_content, hashtags } = req.body;
    const query = `
      INSERT INTO post (member_id, theme_id, post_title, post_content, hashtags)
      VALUES (?, ?, ?, ?, ?)
    `;
    db.query(query, [member_id, theme_id, post_title, post_content, hashtags], (err, result) => {
      if (err) throw err;
      res.redirect('/post'); // 게시글 목록 페이지로 리다이렉트
    });
  };

// 게시글 수정
exports.updatePost = (req, res) => {
  const postId = req.params.postId;
  const { post_title, post_content, hashtags } = req.body;
  const query = `
    UPDATE post
    SET post_title = ?, post_content = ?, hashtags = ?, updated_at = NOW()
    WHERE post_id = ?
  `;
  db.query(query, [post_title, post_content, hashtags, postId], (err, result) => {
    if (err) throw err;
    if (result.affectedRows === 0) {
      res.status(404).send('Post not found 게시글수정');
    } else {
      res.send('Post updated successfully');
    }
  });
};

// 게시글 삭제
exports.deletePost = (req, res) => {
  const postId = req.params.postId;
  const query = `DELETE FROM post WHERE post_id = ?`;
  db.query(query, [postId], (err, result) => {
    if (err) throw err;
    if (result.affectedRows === 0) {
      res.status(404).send('Post not found 게시글삭제');
    } else {
      res.send('Post deleted successfully');
    }
  });
};

// 게시글 목록 조회
exports.getPosts = (req, res) => {
  const query = `
    SELECT p.post_id, p.member_id, p.theme_id, p.post_title, p.post_content, p.hashtags, p.created_at, p.updated_at, p.views, p.likes, p.comments, p.bookmarks,
           m.username, m.nickname, m.profile_picture
    FROM post p
    JOIN member m ON p.member_id = m.member_id
    ORDER BY p.created_at DESC
  `;
  db.query(query, (err, result) => {
    if (err) throw err;
    res.render('pages/post', { posts: result });
  });
};

// 게시글 상세 조회
exports.getPostDetail = (req, res) => {
  const postId = req.params.postId;
  const query = `
    SELECT p.post_id, p.member_id, p.theme_id, p.post_title, p.post_content, p.hashtags, p.created_at, p.updated_at, p.views, p.likes, p.comments, p.bookmarks,
           m.username, m.nickname, m.profile_picture, m.bio,
           (SELECT GROUP_CONCAT(image_path SEPARATOR ',') FROM post_image WHERE post_id = p.post_id) AS images
    FROM post p
    JOIN member m ON p.member_id = m.member_id
    WHERE p.post_id = ?
  `;
  db.query(query, [postId], (err, result) => {
    if (err) throw err;
    if (result.length === 0) {
        console.log(result);

      res.status(404).send('Post not found 게시글 상세 조회');
    } else {
      const post = result[0];
      const query = `
        SELECT c.comment_id, c.member_id, c.parent_comment_id, c.comment_content, c.created_at,
               m.username, m.nickname, m.profile_picture
        FROM comment c
        JOIN member m ON c.member_id = m.member_id
        WHERE c.post_id = ?
        ORDER BY c.created_at DESC
      `;
      db.query(query, [postId], (err, comments) => {
        if (err) throw err;
        res.render('pages/post-detail', { post, comments });
      });
    }
  });
};

// 아이템 등록
exports.createItem = (req, res) => {
  const postId = req.params.postId;
  const { image_id, product_name, product_category, brand, purchase_link } = req.body;
  const query = `
    INSERT INTO product (post_id, image_id, product_name, product_category, brand, purchase_link)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  db.query(query, [postId, image_id, product_name, product_category, brand, purchase_link], (err, result) => {
    if (err) throw err;
    res.send(`Item created with ID: ${result.insertId}`);
  });
};

// 아이템 수정
exports.updateItem = (req, res) => {
  const postId = req.params.postId;
  const itemId = req.params.itemId;
  const { product_name, product_category, brand, purchase_link } = req.body;
  const query = `
    UPDATE product
    SET product_name = ?, product_category = ?, brand = ?, purchase_link = ?
    WHERE post_id = ? AND product_id = ?
  `;
  db.query(query, [product_name, product_category, brand, purchase_link, postId, itemId], (err, result) => {
    if (err) throw err;
    if (result.affectedRows === 0) {
      res.status(404).send('Item not found');
    } else {
      res.send('Item updated successfully');
    }
  });
};

// 아이템 삭제
exports.deleteItem = (req, res) => {
  const postId = req.params.postId;
  const itemId = req.params.itemId;
  const query = `DELETE FROM product WHERE post_id = ? AND product_id = ?`;
  db.query(query, [postId, itemId], (err, result) => {
    if (err) throw err;
    if (result.affectedRows === 0) {
      res.status(404).send('Item not found');
    } else {
      res.send('Item deleted successfully');
    }
  });
};

// 댓글 작성
exports.createComment = (req, res) => {
  const postId = req.params.postId;
  const { member_id, parent_comment_id, comment_content } = req.body;
  const query = `
    INSERT INTO comment (post_id, member_id, parent_comment_id, comment_content)
    VALUES (?, ?, ?, ?)
  `;
  db.query(query, [postId, member_id, parent_comment_id, comment_content], (err, result) => {
    if (err) throw err;
    res.send(`Comment created with ID: ${result.insertId}`);
  });
};

// 댓글 수정
exports.updateComment = (req, res) => {
  const postId = req.params.postId;
  const commentId = req.params.commentId;
  const { comment_content } = req.body;
  const query = `
    UPDATE comment
    SET comment_content = ?
    WHERE post_id = ? AND comment_id = ?
  `;
  db.query(query, [comment_content, postId, commentId], (err, result) => {
    if (err) throw err;
    if (result.affectedRows === 0) {
      res.status(404).send('Comment not found');
    } else {
      res.send('Comment updated successfully');
    }
  });
};

// 댓글 삭제
exports.deleteComment = (req, res) => {
  const postId = req.params.postId;
  const commentId = req.params.commentId;
  const query = `DELETE FROM comment WHERE post_id = ? AND comment_id = ?`;
  db.query(query, [postId, commentId], (err, result) => {
    if (err) throw err;
    if (result.affectedRows === 0) {
      res.status(404).send('Comment not found');
    } else {
      res.send('Comment deleted successfully');
    }
  });
};

// 대댓글 작성
exports.createReply = (req, res) => {
  const postId = req.params.postId;
  const commentId = req.params.commentId;
  const { member_id, comment_content } = req.body;
  const query = `
    INSERT INTO comment (post_id, member_id, parent_comment_id, comment_content)
    VALUES (?, ?, ?, ?)
  `;
  db.query(query, [postId, member_id, commentId, comment_content], (err, result) => {
    if (err) throw err;
    res.send(`Reply created with ID: ${result.insertId}`);
  });
};

// 대댓글 수정
exports.updateReply = (req, res) => {
  const postId = req.params.postId;
  const commentId = req.params.commentId;
  const replyId = req.params.replyId;
  const { comment_content } = req.body;
  const query = `
    UPDATE comment
    SET comment_content = ?
    WHERE post_id = ? AND comment_id = ? AND parent_comment_id = ?
  `;
  db.query(query, [comment_content, postId, replyId, commentId], (err, result) => {
    if (err) throw err;
    if (result.affectedRows === 0) {
      res.status(404).send('Reply not found');
    } else {
      res.send('Reply updated successfully');
    }
  });
};

// 대댓글 삭제
exports.deleteReply = (req, res) => {
  const postId = req.params.postId;
  const commentId = req.params.commentId;
  const replyId = req.params.replyId;
  const query = `DELETE FROM comment WHERE post_id = ? AND comment_id = ? AND parent_comment_id = ?`;
  db.query(query, [postId, replyId, commentId], (err, result) => {
    if (err) throw err;
    if (result.affectedRows === 0) {
      res.status(404).send('Reply not found');
    } else {
      res.send('Reply deleted successfully');
    }
  });
};

// 좋아요 등록/취소
exports.toggleLike = (req, res) => {
    const postId = req.params.postId;
    const memberId = req.body.member_id;
    const query = `SELECT * FROM 'like' WHERE post_id = ? AND member_id = ?`;
    db.query(query, [postId, memberId], (err, result) => {
        if (err) throw err;
        if (result.length === 0) {
            // 좋아요 등록
            const query = `INSERT INTO 'like' (post_id, member_id) VALUES (?, ?)`;
            db.query(query, [postId, memberId], (err, result) => {
                if (err) throw err;
                res.send('Like added successfully');
            });
        } else {
            // 좋아요 취소
            const query = `DELETE FROM 'like' WHERE post_id = ? AND member_id = ?`;
            db.query(query, [postId, memberId], (err, result) => {
                if (err) throw err;
                res.send('Like removed successfully');
            });
        }
    });
};
