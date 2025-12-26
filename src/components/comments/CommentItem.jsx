import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  updateComment,
  deleteComment,
  likeComment,
  dislikeComment,
  replyToComment,
} from "../../redux/slices/commentSlice";
import "./CommentItem.scss";

const CommentItem = ({ comment }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(
    comment.content || comment.text || ""
  );
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [showReplies, setShowReplies] = useState(false);

  const isOwner =
    user &&
    comment.user &&
    (comment.user._id === user.id || comment.user === user.id);
  const hasLiked = user && comment.likes && comment.likes.includes(user.id);
  const hasDisliked =
    user && comment.dislikes && comment.dislikes.includes(user.id);

  const handleEdit = () => {
    if (!editContent.trim()) {
      alert("Comment cannot be empty");
      return;
    }
    dispatch(updateComment({ id: comment._id, content: editContent }));
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      dispatch(deleteComment(comment._id));
    }
  };

  const handleLike = () => {
    dispatch(likeComment(comment._id));
  };

  const handleDislike = () => {
    dispatch(dislikeComment(comment._id));
  };

  const handleReply = () => {
    if (!replyContent.trim()) {
      alert("Reply cannot be empty");
      return;
    }
    dispatch(replyToComment({ id: comment._id, content: replyContent }));
    setReplyContent("");
    setIsReplying(false);
    setShowReplies(true);
  };

  const formatDate = (date) => {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(date).toLocaleDateString(undefined, options);
  };

  return (
    <div className="comment-item">
      <div className="comment-header">
        <div className="comment-author">
          <span className="author-name">
            {comment.user?.name || comment.user?.username || "Anonymous"}
          </span>
          <span className="comment-date">{formatDate(comment.createdAt)}</span>
        </div>
        {isOwner && (
          <div className="comment-actions">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="btn-icon"
              title="Edit"
            >
              ✏️
            </button>
            <button onClick={handleDelete} className="btn-icon" title="Delete">
              🗑️
            </button>
          </div>
        )}
      </div>

      <div className="comment-body">
        {isEditing ? (
          <div className="edit-form">
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              rows="3"
              maxLength={1000}
            />
            <div className="edit-actions">
              <button onClick={handleEdit} className="btn btn-sm btn-primary">
                Save
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="btn btn-sm btn-secondary"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <p className="comment-text">{comment.content || comment.text}</p>
        )}
      </div>

      <div className="comment-footer">
        <div className="comment-reactions">
          <button
            onClick={handleLike}
            className={`btn-reaction ${hasLiked ? "active" : ""}`}
            title="Like"
          >
            👍 {comment.likes?.length || 0}
          </button>
          <button
            onClick={handleDislike}
            className={`btn-reaction ${hasDisliked ? "active" : ""}`}
            title="Dislike"
          >
            👎 {comment.dislikes?.length || 0}
          </button>
        </div>
        <button
          onClick={() => setIsReplying(!isReplying)}
          className="btn-reply"
        >
          💬 Reply
        </button>
      </div>

      {isReplying && (
        <div className="reply-form">
          <textarea
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            placeholder="Write a reply..."
            rows="2"
            maxLength={1000}
          />
          <div className="reply-actions">
            <button onClick={handleReply} className="btn btn-sm btn-primary">
              Reply
            </button>
            <button
              onClick={() => setIsReplying(false)}
              className="btn btn-sm btn-secondary"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {comment.replies && comment.replies.length > 0 && (
        <div className="replies-section">
          <button
            onClick={() => setShowReplies(!showReplies)}
            className="btn-show-replies"
          >
            {showReplies ? "▼" : "▶"} {comment.replies.length}{" "}
            {comment.replies.length === 1 ? "Reply" : "Replies"}
          </button>
          {showReplies && (
            <div className="replies-list">
              {comment.replies.map((reply) => (
                <div key={reply._id} className="reply-item">
                  <div className="reply-header">
                    <span className="author-name">
                      {reply.user?.name || reply.user?.username || "Anonymous"}
                    </span>
                    <span className="comment-date">
                      {formatDate(reply.createdAt)}
                    </span>
                  </div>
                  <p className="reply-text">{reply.content || reply.text}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CommentItem;
