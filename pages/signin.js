import { Component } from "react";
import axios from "axios";
import Layout from "../components/layout";
import { signin } from "../lib/auth";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

import clientCredentials from "../credentials/client";

firebase.initializeApp(clientCredentials);

class Signin extends Component {
  static getInitialProps({ req }) {
    const protocol = process.env.NODE_ENV === "production" ? "https" : "http";

    const apiUrl = process.browser
      ? `${protocol}://${window.location.host}/api/signin`
      : `${protocol}://${req.headers.host}/api/signin`;

    return { apiUrl };
  }

  constructor(props) {
    super(props);

    this.state = { username: "", error: "" };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({ username: event.target.value });
  }

  async handleSubmit(event) {
    event.preventDefault();
    this.setState({ error: "" });
    //const username = this.state.username;
    //const url = this.props.apiUrl;

    try {
      //const response = await axios.post(url, { username });
      const response = await firebase
        .auth()
        .signInWithPopup(new firebase.auth.GoogleAuthProvider());

      if (response) {
        const token = await response.user.getIdToken();
        signin({ token });
      } else {
        console.log("Login failed.");
        // https://github.com/developit/unfetch#caveats
        let error = new Error(response.statusText);
        error.response = response;
        throw error;
      }
    } catch (error) {
      console.error(
        "You have an error in your code or there are Network issues.",
        error
      );
      this.setState({ error: error.message });
    }
  }

  render() {
    return (
      <Layout isAuthenticatd={false}>
        <div className="login">
          <form onSubmit={this.handleSubmit}>
            <label htmlFor="username">GitHub username</label>

            <input
              type="text"
              id="username"
              name="username"
              value={this.state.username}
              onChange={this.handleChange}
            />

            <button type="submit">Login</button>

            <p className={`error ${this.state.error && "show"}`}>
              {this.state.error && `Error: ${this.state.error}`}
            </p>
          </form>
        </div>
        <style jsx>{`
          .login {
            max-width: 340px;
            margin: 0 auto;
            padding: 1rem;
            border: 1px solid #ccc;
            border-radius: 4px;
          }

          form {
            display: flex;
            flex-flow: column;
          }

          label {
            font-weight: 600;
          }

          input {
            padding: 8px;
            margin: 0.3rem 0 1rem;
            border: 1px solid #ccc;
            border-radius: 4px;
          }

          .error {
            margin: 0.5rem 0 0;
            display: none;
            color: brown;
          }

          .error.show {
            display: block;
          }
        `}</style>
      </Layout>
    );
  }
}

export default Signin;
