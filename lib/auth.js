import { Component } from "react";
import Router from "next/router";
import nextCookie from "next-cookies";
import cookie from "js-cookie";
import fetch from "isomorphic-unfetch";

export const signin = async ({ token }) => {
  cookie.set("token", token, { expires: 1 });
  Router.push("/profile");
};

export const signout = () => {
  cookie.remove("token");
  // to support logging out from all windows
  window.localStorage.setItem("logout", Date.now());
  Router.push("/signin");
};

// Gets the display name of a JSX component for dev tools
const getDisplayName = Component =>
  Component.displayName || Component.name || "Component";

export const withAuthSync = WrappedComponent =>
  class extends Component {
    static displayName = `withAuthSync(${getDisplayName(WrappedComponent)})`;

    static async getInitialProps(ctx) {
      const token = auth(ctx);

      const componentProps =
        WrappedComponent.getInitialProps &&
        (await WrappedComponent.getInitialProps(ctx));

      return { ...componentProps, token };
    }

    constructor(props) {
      super(props);

      this.syncLogout = this.syncLogout.bind(this);
    }

    componentDidMount() {
      window.addEventListener("storage", this.syncLogout);
    }

    componentWillUnmount() {
      window.removeEventListener("storage", this.syncLogout);
      window.localStorage.removeItem("logout");
    }

    syncLogout(event) {
      if (event.key === "logout") {
        console.log("logged out from storage!");
        Router.push("/signin");
      }
    }

    render() {
      return <WrappedComponent {...this.props} />;
    }
  };

export const auth = ctx => {
  const { token } = nextCookie(ctx);

  /*
   * This happens on server only, ctx.req is available means it's being
   * rendered on server. If we are on server and token is not available,
   * means user is not logged in.
   */
  if (ctx.req && !token) {
    ctx.res.writeHead(302, { Location: "/signin" });
    ctx.res.end();
    return;
  }

  // We already checked for server. This should only happen on client.
  if (!token) {
    Router.push("/signin");
  }

  return token;
};

export const authInitialProps = isProtectedRoute => async ctx => {
  const { token } = nextCookie(ctx);
  const protocol = process.env.NODE_ENV === "production" ? "https" : "http";

  const apiUrl = process.browser
    ? `${protocol}://${window.location.host}/api/profile`
    : `${protocol}://${ctx.req.headers.host}/api/profile`;

  const redirectOnError = () =>
    process.browser
      ? Router.push("/login")
      : ctx.res.writeHead(302, { Location: "/signin" }).end();

  try {
    const response = await fetch(apiUrl, {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: token
      }
    });

    const res = (await response.json()) || {};

    console.log(res);

    if (res.ok) {
      return { data: res.data, isAuthenticatd: true };
    }

    if (!isProtectedRoute) {
      return { data: {}, isAuthenticatd: false };
    } else {
      return redirectOnError();
    }
  } catch (error) {
    console.log(error);
    // Implementation or Network error
    return redirectOnError();
  }
};
