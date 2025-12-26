import io from "socket.io-client";
import {
  addCommentRealtime,
  updateCommentRealtime,
  deleteCommentRealtime,
} from "../redux/slices/commentSlice";

let socket = null;

export const initSocket = (dispatch) => {
  const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user || !user.token) {
    return;
  }

  socket = io(SOCKET_URL, {
    auth: {
      token: user.token,
    },
  });

  socket.on("connect", () => {
    console.log("Socket connected");
  });

  socket.on("comment:created", (comment) => {
    dispatch(addCommentRealtime(comment));
  });

  socket.on("comment:updated", (comment) => {
    dispatch(updateCommentRealtime(comment));
  });

  socket.on("comment:deleted", (commentId) => {
    dispatch(deleteCommentRealtime(commentId));
  });

  socket.on("comment:liked", (comment) => {
    dispatch(updateCommentRealtime(comment));
  });

  socket.on("comment:disliked", (comment) => {
    dispatch(updateCommentRealtime(comment));
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected");
  });

  socket.on("error", (error) => {
    console.error("Socket error:", error);
  });
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const getSocket = () => socket;
