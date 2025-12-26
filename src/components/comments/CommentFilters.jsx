import React from "react";
import "./CommentFilters.scss";

const CommentFilters = ({ sortBy, onSortChange }) => {
  return (
    <div className="comment-filters">
      <label>Sort by:</label>
      <div className="filter-buttons">
        <button
          className={`btn-filter ${sortBy === "newest" ? "active" : ""}`}
          onClick={() => onSortChange("newest")}
        >
          Newest
        </button>
        <button
          className={`btn-filter ${sortBy === "oldest" ? "active" : ""}`}
          onClick={() => onSortChange("oldest")}
        >
          Oldest
        </button>
        <button
          className={`btn-filter ${sortBy === "mostLiked" ? "active" : ""}`}
          onClick={() => onSortChange("mostLiked")}
        >
          Most Liked
        </button>
        <button
          className={`btn-filter ${sortBy === "mostDisliked" ? "active" : ""}`}
          onClick={() => onSortChange("mostDisliked")}
        >
          Most Disliked
        </button>
      </div>
    </div>
  );
};

export default CommentFilters;
