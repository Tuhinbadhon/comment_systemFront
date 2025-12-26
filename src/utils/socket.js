import Pusher from "pusher-js";
import {
  addCommentRealtime,
  updateCommentRealtime,
  updateCommentLikesRealtime,
  addReplyRealtime,
  deleteCommentRealtime,
} from "../redux/slices/commentSlice";

let pusher = null;
let channel = null;

export const initSocket = (dispatch) => {
  const PUSHER_KEY = import.meta.env.VITE_PUSHER_KEY;
  const PUSHER_CLUSTER = import.meta.env.VITE_PUSHER_CLUSTER;
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user || !user.token) {
    console.log("No user token found, skipping Pusher initialization");
    return;
  }

  // Disconnect existing connection if any
  if (pusher) {
    disconnectSocket();
  }

  console.log("Initializing Pusher...");
  pusher = new Pusher(PUSHER_KEY, {
    cluster: PUSHER_CLUSTER,
    forceTLS: true,
  });

  // Subscribe to comments channel
  channel = pusher.subscribe("comments");

  // Wait for subscription to succeed
  channel.bind("pusher:subscription_succeeded", () => {
    console.log("✅ Pusher connected and subscribed to comments channel");
  });

  channel.bind("pusher:subscription_error", (error) => {
    console.error("❌ Pusher subscription error:", error);
  });

  // Backend sends: { comment, parentComment }
  channel.bind("comment:created", (data) => {
    console.log("📩 Pusher: comment:created", data);
    if (data.comment) {
      dispatch(addCommentRealtime(data.comment));
    }
  });

  // Backend sends: { comment }
  channel.bind("comment:updated", (data) => {
    console.log("📩 Pusher: comment:updated", data);
    if (data.comment) {
      dispatch(updateCommentRealtime(data.comment));
    }
  });

  // Backend sends: { commentId }
  channel.bind("comment:deleted", (data) => {
    console.log("📩 Pusher: comment:deleted", data);
    if (data.commentId) {
      dispatch(deleteCommentRealtime(data.commentId));
    }
  });

  // Backend sends: { commentId, likeCount, dislikeCount }
  channel.bind("comment:liked", (data) => {
    console.log("👍 Pusher: comment:liked", data);
    if (data.commentId !== undefined) {
      dispatch(
        updateCommentLikesRealtime({
          commentId: data.commentId,
          likeCount: data.likeCount,
          dislikeCount: data.dislikeCount,
        })
      );
    }
  });

  // Backend sends: { commentId, likeCount, dislikeCount }
  channel.bind("comment:disliked", (data) => {
    // console.log("👎 Pusher: comment:disliked", data);
    if (data.commentId !== undefined) {
      dispatch(
        updateCommentLikesRealtime({
          commentId: data.commentId,
          likeCount: data.likeCount,
          dislikeCount: data.dislikeCount,
        })
      );
    }
  });

  // Backend sends: { reply, parentCommentId }
  channel.bind("comment:reply", (data) => {
    console.log("💬 Pusher: comment:reply", data);
    if (data && (data.reply || data.parentCommentId)) {
      dispatch(addReplyRealtime(data));
    }
  });

  pusher.connection.bind("connected", () => {
    console.log("✅ Pusher connection established");
  });

  pusher.connection.bind("disconnected", () => {
    console.log("⚠️ Pusher connection disconnected");
  });

  pusher.connection.bind("error", (error) => {
    console.error("❌ Pusher connection error:", error);
  });
};

export const disconnectSocket = () => {
  if (channel) {
    console.log("Unbinding all Pusher events...");
    channel.unbind_all();
    channel = null;
  }
  if (pusher) {
    console.log("Unsubscribing from Pusher channels...");
    pusher.unsubscribe("comments");
    pusher.disconnect();
    pusher = null;
  }
};

export const getSocket = () => pusher;
