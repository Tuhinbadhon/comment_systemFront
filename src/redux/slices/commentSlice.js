import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const initialState = {
  comments: [],
  totalPages: 0,
  currentPage: 1,
  totalComments: 0,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};

// Get auth config
const getAuthConfig = () => {
  const raw = localStorage.getItem("user");
  if (!raw) return {};
  const user = JSON.parse(raw);
  const token =
    user?.token || user?.accessToken || user?.data?.token || user?.user?.token;
  if (!token) return {};
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// Get all comments with filters
export const getComments = createAsyncThunk(
  "comments/getAll",
  async (
    { page = 1, limit = 10, sortBy = "newest", parentId = null },
    thunkAPI
  ) => {
    try {
      let url = `${API_URL}/comments?page=${page}&limit=${limit}&sortBy=${sortBy}`;
      if (parentId) url += `&parentId=${parentId}`;
      const response = await axios.get(url, getAuthConfig());

      // Map backend response to frontend state structure
      return {
        comments: response.data.data || [],
        totalPages: response.data.pages || 1,
        currentPage: response.data.page || page,
        totalComments: response.data.total || 0,
      };
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Create new comment
export const createComment = createAsyncThunk(
  "comments/create",
  async (commentData, thunkAPI) => {
    try {
      // Ensure we have auth token
      const raw = localStorage.getItem("user");
      const user = raw ? JSON.parse(raw) : null;
      const token =
        user?.token ||
        user?.accessToken ||
        user?.data?.token ||
        user?.user?.token;
      if (!token) return thunkAPI.rejectWithValue("Not authenticated");

      const response = await axios.post(
        `${API_URL}/comments`,
        commentData,
        getAuthConfig()
      );
      return response.data?.data || response.data;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Update comment
export const updateComment = createAsyncThunk(
  "comments/update",
  async ({ id, content }, thunkAPI) => {
    try {
      const response = await axios.put(
        `${API_URL}/comments/${id}`,
        { content },
        getAuthConfig()
      );
      return response.data?.data || response.data;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Delete comment
export const deleteComment = createAsyncThunk(
  "comments/delete",
  async (id, thunkAPI) => {
    try {
      await axios.delete(`${API_URL}/comments/${id}`, getAuthConfig());
      return id;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Like comment
export const likeComment = createAsyncThunk(
  "comments/like",
  async (id, thunkAPI) => {
    try {
      const response = await axios.post(
        `${API_URL}/comments/${id}/like`,
        {},
        getAuthConfig()
      );
      return response.data?.data || response.data;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Dislike comment
export const dislikeComment = createAsyncThunk(
  "comments/dislike",
  async (id, thunkAPI) => {
    try {
      const response = await axios.post(
        `${API_URL}/comments/${id}/dislike`,
        {},
        getAuthConfig()
      );
      return response.data?.data || response.data;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Reply to comment
export const replyToComment = createAsyncThunk(
  "comments/reply",
  async ({ id, content }, thunkAPI) => {
    try {
      const response = await axios.post(
        `${API_URL}/comments/${id}/reply`,
        { content },
        getAuthConfig()
      );
      // backend returns { success, message, data: reply }
      return response.data?.data || response.data;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const commentSlice = createSlice({
  name: "comments",
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = "";
    },
    addCommentRealtime: (state, action) => {
      state.comments.unshift(action.payload);
      state.totalComments += 1;
    },
    updateCommentRealtime: (state, action) => {
      const index = state.comments.findIndex(
        (c) => c._id === action.payload._id
      );
      if (index !== -1) {
        state.comments[index] = action.payload;
      }
    },
    updateCommentLikesRealtime: (state, action) => {
      const { commentId, likeCount, dislikeCount } = action.payload;
      const index = state.comments.findIndex((c) => c._id === commentId);
      if (index !== -1) {
        state.comments[index].likeCount = likeCount;
        state.comments[index].dislikeCount = dislikeCount;
      }
    },
    addReplyRealtime: (state, action) => {
      const payload = action.payload || {};
      const reply = payload.reply || payload;
      const parentId = payload.parentCommentId || reply.parentComment;
      if (!parentId) return;
      const index = state.comments.findIndex((c) => c._id === parentId);
      if (index !== -1) {
        state.comments[index].replies = state.comments[index].replies || [];
        // Deduplicate by _id
        const exists = state.comments[index].replies.some(
          (r) => r._id === reply._id
        );
        if (!exists) {
          state.comments[index].replies.push(reply);
          state.comments[index].replyCount =
            (state.comments[index].replyCount || 0) + 1;
        }
      }
    },
    deleteCommentRealtime: (state, action) => {
      state.comments = state.comments.filter((c) => c._id !== action.payload);
      state.totalComments -= 1;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getComments.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getComments.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.comments = action.payload.comments;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
        state.totalComments = action.payload.totalComments;
      })
      .addCase(getComments.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(createComment.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createComment.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.comments.unshift(action.payload);
        state.totalComments += 1;
      })
      .addCase(createComment.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(updateComment.fulfilled, (state, action) => {
        const index = state.comments.findIndex(
          (c) => c._id === action.payload._id
        );
        if (index !== -1) {
          state.comments[index] = action.payload;
        }
      })
      .addCase(deleteComment.fulfilled, (state, action) => {
        state.comments = state.comments.filter((c) => c._id !== action.payload);
        state.totalComments -= 1;
      })
      .addCase(likeComment.fulfilled, (state, action) => {
        const index = state.comments.findIndex(
          (c) => c._id === action.payload._id
        );
        if (index !== -1) {
          state.comments[index] = action.payload;
        }
      })
      .addCase(dislikeComment.fulfilled, (state, action) => {
        const index = state.comments.findIndex(
          (c) => c._id === action.payload._id
        );
        if (index !== -1) {
          state.comments[index] = action.payload;
        }
      })
      .addCase(replyToComment.fulfilled, (state, action) => {
        // action.payload is the created reply object
        const reply = action.payload;
        const parentId = reply.parentComment;
        if (!parentId) return;
        const index = state.comments.findIndex((c) => c._id === parentId);
        if (index !== -1) {
          state.comments[index].replies = state.comments[index].replies || [];
          // Deduplicate by _id
          const exists = state.comments[index].replies.some(
            (r) => r._id === reply._id
          );
          if (!exists) {
            state.comments[index].replies.push(reply);
            state.comments[index].replyCount =
              (state.comments[index].replyCount || 0) + 1;
          }
        }
      });
  },
});

export const {
  reset,
  addCommentRealtime,
  updateCommentRealtime,
  updateCommentLikesRealtime,
  addReplyRealtime,
  deleteCommentRealtime,
} = commentSlice.actions;
export default commentSlice.reducer;
