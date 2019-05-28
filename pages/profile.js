import Layout from "../components/layout";
import { withAuthSync, authInitialProps } from "../lib/auth";

const Profile = props => {
  const { data: { name, picture } = {}, isAuthenticatd } = props;
  return (
    <Layout isAuthenticatd={isAuthenticatd}>
      <img src={picture} alt="Avatar" />
      <h1>{name}</h1>
      <style jsx>{`
        img {
          max-width: 200px;
          border-radius: 0.5rem;
        }

        h1 {
          margin-bottom: 0;
        }

        .lead {
          margin-top: 0;
          font-size: 1.5rem;
          font-weight: 300;
          color: #666;
        }

        p {
          color: #6a737d;
        }
      `}</style>
    </Layout>
  );
};

Profile.getInitialProps = authInitialProps(true);

export default Profile;
