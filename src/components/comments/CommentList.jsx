import React from "react";
import CommentItem from "./CommentItem";
import "./CommentList.scss";

const CommentList = ({ comments }) => {
  if (!comments || comments.length === 0) {
    return (
      <div className="no-comments">
        No comments yet. Be the first to comment!
      </div>
    );
  }

  return (
    <div className="comment-list">
      {comments.map((comment) => (
        <CommentItem key={comment._id} comment={comment} />
      ))}
    </div>
  );
};

export default CommentList;
