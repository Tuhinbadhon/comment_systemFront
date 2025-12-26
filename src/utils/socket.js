import Pusher from "pusher-js";
import {
  addCommentRealtime,
  updateCommentRealtime,
  deleteCommentRealtime,
} from "../redux/slices/commentSlice";

let pusher = null;
let channel = null;

export const initSocket = (dispatch) => {
  const PUSHER_KEY = import.meta.env.VITE_PUSHER_KEY;
  const PUSHER_CLUSTER = import.meta.env.VITE_PUSHER_CLUSTER;
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user || !user.token) {
    return;
  }

  pusher = new Pusher(PUSHER_KEY, {
    cluster: PUSHER_CLUSTER,
    authEndpoint: `${import.meta.env.VITE_API_URL}/pusher/auth`,
    auth: {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    },
  });

  channel = pusher.subscribe("comments");

  channel.bind("pusher:subscription_succeeded", () => {
    console.log("Pusher connected");
  });

  channel.bind("comment:created", (comment) => {
    dispatch(addCommentRealtime(comment));
  });

  channel.bind("comment:updated", (comment) => {
    dispatch(updateCommentRealtime(comment));
  });

  channel.bind("comment:deleted", (data) => {
    dispatch(deleteCommentRealtime(data.commentId));
  });

  channel.bind("comment:liked", (comment) => {
    dispatch(updateCommentRealtime(comment));
  });

  channel.bind("comment:disliked", (comment) => {
    dispatch(updateCommentRealtime(comment));
  });

  pusher.connection.bind("error", (error) => {
    console.error("Pusher error:", error);
  });
};

export const disconnectSocket = () => {
  if (channel) {
    channel.unbind_all();
    pusher.unsubscribe("comments");
    channel = null;
  }
  if (pusher) {
    pusher.disconnect();
    pusher = null;
  }
};

export const getSocket = () => pusher;
