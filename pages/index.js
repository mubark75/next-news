import { Component } from "react";
import axios from "axios";

import Layout from "../components/layout";
import Categories from "../components/categories";

import { authInitialProps } from "../lib/auth";

class Home extends Component {
  state = {
    articles: []
  };

  componentDidMount = async () => {
    try {
      const res = await axios(
        "https://newsapi.org/v2/top-headlines?country=us&apiKey=b210bd4793fe47bc843c8baeb6936714"
      );
      console.log(res);
      const { articles } = res.data;
      this.setState({ articles });
    } catch (error) {
      console.log(error);
    }
  };

  render() {
    const { data: { name, picture } = {}, isAuthenticatd } = this.props;
    const { articles } = this.state;
    return (
      <Layout isAuthenticatd={isAuthenticatd}>
        <Categories />
        {articles &&
          articles.map((article, index) => (
            <h2 key={index}>{article.title}</h2>
          ))}
        <style jsx>{`
          li {
            margin-bottom: 0.5rem;
          }
        `}</style>
      </Layout>
    );
  }
}

Home.getInitialProps = authInitialProps();

export default Home;
