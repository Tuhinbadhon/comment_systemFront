import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getComments, reset } from "../redux/slices/commentSlice";
import CommentForm from "../components/comments/CommentForm";
import CommentList from "../components/comments/CommentList";
import CommentFilters from "../components/comments/CommentFilters";
import Pagination from "../components/comments/Pagination";
import { initSocket, disconnectSocket } from "../utils/socket";
import "./Comments.scss";

const Comments = () => {
  const dispatch = useDispatch();
  const {
    comments,
    isLoading,
    isError,
    message,
    totalPages,
    currentPage,
    totalComments,
  } = useSelector((state) => state.comments);

  const [sortBy, setSortBy] = useState("newest");
  const [page, setPage] = useState(1);
  const limit = 10;

  useEffect(() => {
    const filterParam =
      sortBy === "mostLiked"
        ? "liked"
        : sortBy === "mostDisliked"
        ? "disliked"
        : "";

    dispatch(getComments({ page, limit, sortBy, filter: filterParam }));

    // Initialize socket connection for real-time updates
    initSocket(dispatch);

    return () => {
      dispatch(reset());
      disconnectSocket();
    };
  }, [dispatch, page, sortBy]);

  useEffect(() => {
    if (isError) {
      alert(message);
    }
  }, [isError, message]);

  const handleSortChange = (newSortBy) => {
    setSortBy(newSortBy);
    setPage(1);
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    setPage(1);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  return (
    <div className="comments-page">
      <div className="comments-header">
        <h1>Comments ({totalComments})</h1>
      </div>

      <CommentForm />

      <CommentFilters sortBy={sortBy} onSortChange={handleSortChange} />

      {isLoading && page === 1 ? (
        <div className="loading">Loading comments...</div>
      ) : (
        <>
          <CommentList comments={comments} />
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}
    </div>
  );
};

export default Comments;
