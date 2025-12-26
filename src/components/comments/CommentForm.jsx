import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createComment } from "../../redux/slices/commentSlice";
import "./CommentForm.scss";

const MAX_CONTENT_LENGTH = 1000;

const CommentForm = () => {
  const [content, setContent] = useState("");
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.comments);

  const onSubmit = (e) => {
    e.preventDefault();

    if (!content.trim()) {
      alert("Please enter a comment");
      return;
    }

    dispatch(createComment({ content }));
    setContent("");
  };

  return (
    <form onSubmit={onSubmit} className="comment-form">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write a comment..."
        rows="4"
        maxLength={MAX_CONTENT_LENGTH}
        required
      />
      <div className="comment-form-footer">
        <span className="character-count">
          {content.length}/{MAX_CONTENT_LENGTH}
        </span>
        <button type="submit" className="btn btn-primary" disabled={isLoading}>
          {isLoading ? "Posting..." : "Post Comment"}
        </button>
      </div>
    </form>
  );
};

export default CommentForm;
