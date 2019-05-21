import Router from "next/router";
import axios from "axios";

const WINDOW_USER_SCRIPT_VARIABLE = "__USER__";

export const getUserScript = user => {
  return `${WINDOW_USER_SCRIPT_VARIABLE} = ${JSON.stringify(user)};`;
};

export const getSessionFromServer = req => {
  if (req.user) {
    return { user: req.user };
  }
  return {};
};

export const getSessionFromClient = () => {
  if (typeof window !== "undefined") {
    const user = window[WINDOW_USER_SCRIPT_VARIABLE] || {};
    return { user };
  }
  return { user: {} };
};

const redirectUser = (res, path) => {
  if (res) {
    res.redirect(302, path);
    res.finished = true;
    return {};
  }
  Router.replace(path);
  return {};
};

export const authInitialProps = isProtectedRoute => ({
  req,
  res,
  query: { userId }
}) => {
  const auth = req ? getSessionFromServer(req) : getSessionFromClient();
  const currentPath = req ? req.url : window.location.pathname;
  const user = auth.user;
  const isAnonymous = !user;
  if (isProtectedRoute && isAnonymous && currentPath !== "/signin") {
    return redirectUser(res, "/signin");
  }
  return { auth, userId };
};

export const signupUser = async user => {
  try {
    const { data } = await axios.post("/api/auth/signup", user);
    console.log(data);
    return { error: false, data };
  } catch (error) {
    const errorMessage =
      (error.response && error.response.data) || error.message;
    return { error: true, data: errorMessage };
  }
};

export const signinUser = async user => {
  try {
    const { data } = await axios.post("/api/auth/signin", user);
    if (typeof window !== "undefined") {
      window[WINDOW_USER_SCRIPT_VARIABLE] = data || {};
    }
    return { error: false, data };
  } catch (error) {
    const errorMessage =
      (error.response && error.response.data) || error.message;
    return { error: true, data: errorMessage };
  }
};

export const signoutUser = async () => {
  if (typeof window !== "undefined") {
    window[WINDOW_USER_SCRIPT_VARIABLE] = {};
  }
  await axios.get("/api/auth/signout");
  Router.push("/signin");
};
