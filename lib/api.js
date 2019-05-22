import axios from "axios";

export const getUser = async userId => {
  const { data } = await axios.get(`/api/users/profile/${userId}`);
  return data;
};

export const followUser = async followId => {
  try {
    const { data } = await axios.put(`/api/users/follow`, { followId });
    return data;
  } catch (error) {
    console.log(error.response);
  }
};

export const unfollowUser = async followId => {
  const { data } = await axios.put(`/api/users/unfollow`, { followId });
  return data;
};

export const deleteUser = async authUserId => {
  try {
    const { data } = axios.delete(`/api/users/${authUserId}`);
    return { error: false };
  } catch (error) {
    console.log(error.response);
    return { error: true };
  }
};

export const getAuthUser = async authUserId => {
  try {
    const { data } = await axios.get(`/api/users/${authUserId}`);
    return { error: false, data };
  } catch (error) {
    console.log(error.response);
    return { error: true };
  }
};

export const updateUser = async (authUserId, userData) => {
  try {
    const { data } = await axios.put(`/api/users/${authUserId}`, userData);
    return { error: false, data };
  } catch (error) {
    const errorMessage =
      (error.response && error.response.data) || error.message;
    return { error: true, data: errorMessage };
  }
};

export const getUsersFeed = async authUserId => {
  try {
    const { data } = await axios.get(`/api/users/feed/${authUserId}`);
    return { error: false, data };
  } catch (error) {
    const errorMessage =
      (error.response && error.response.data) || error.message;
    return { error: true, data: errorMessage };
  }
};

export const addPost = async (authUserId, post) => {
  try {
    const { data } = await axios.post(`/api/posts/new/${authUserId}`, post);
    return { error: false, data };
  } catch (error) {
    const errorMessage =
      (error.response && error.response.data) || error.message;
    return { error: true, data: errorMessage };
  }
};

export const getPostFeed = async authUserId => {
  try {
    const { data } = await axios.get(`/api/posts/feed/${authUserId}`);
    return { error: false, data };
  } catch (error) {
    const errorMessage =
      (error.response && error.response.data) || error.message;
    return { error: true, data: errorMessage };
  }
};
export const deletePost = async postId => {
  try {
    await axios.delete(`/api/posts/${postId}`);
    return { error: false, data: {} };
  } catch (error) {
    const errorMessage =
      (error.response && error.response.data) || error.message;
    return { error: true, data: errorMessage };
  }
};
