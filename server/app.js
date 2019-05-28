const express = require("express");
const next = require("next");
const admin = require("firebase-admin");
const logger = require("morgan");
const helmet = require("helmet");
const compression = require("compression");

/* Loads all variables from .env file to "process.env" */
require("dotenv").config();
/* Require our models here so we can use the mongoose.model() singleton to reference our models across our app */

const dev = process.env.NODE_ENV !== "production";
const port = process.env.PORT || 3000;
const ROOT_URL = dev ? `http://localhost:${port}` : process.env.PRODUCTION_URL;
const app = next({ dev });
const handle = app.getRequestHandler();

const firebase = admin.initializeApp(
  {
    credential: admin.credential.cert(require("../credentials/server")),
    databaseURL: process.env.FIREBASE_DATABASE_URL // TODO database URL goes here
  },
  "server"
);

app.prepare().then(() => {
  const server = express();

  if (!dev) {
    /* Helmet helps secure our app by setting various HTTP headers */
    server.use(helmet());
    /* Compression gives us gzip compression */
    server.use(compression());
  }

  /* Body Parser built-in to Express as of version 4.16 */
  server.use(express.json());

  server.use((req, res, next) => {
    req.firebaseServer = firebase;
    next();
  });

  /* give all Next.js's requests to Next.js server */
  server.get("/_next/*", (req, res) => {
    handle(req, res);
  });

  server.get("/static/*", (req, res) => {
    handle(req, res);
  });

  /* morgan for request logging from client
  - we use skip to ignore static files from _next folder */
  server.use(
    logger("dev", {
      skip: req => req.url.includes("_next")
    })
  );

  server.get("/api/profile", async (req, res) => {
    if (!("authorization" in req.headers)) {
      throw createError(401, "Authorization header missing");
    }

    const auth = await req.headers.authorization;
    try {
      const response = await firebase.auth().verifyIdToken(auth);
      res.status(200).json({ ok: true, data: response });
    } catch (error) {
      console.log(error);
      res.status(403).json({ ok: false });
      throw error;
    }
  });

  /* default route
     - allows Next to handle all other routes
     - includes the numerous `/_next/...` routes which must    be exposedfor the next app to work correctly
     - includes 404'ing on unknown routes */
  server.get("*", (req, res) => {
    handle(req, res);
  });

  server.listen(port, err => {
    if (err) throw err;
    console.log(`Server listening on ${ROOT_URL}`);
  });
});
