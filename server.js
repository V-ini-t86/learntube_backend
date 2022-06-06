const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const dsaRoutes = require("./routes/dsaRoutes");
const userRoutes = require("./routes/userRoutes");
const questionRoutes = require("./routes/questionRoutes");
const playlistRoutes = require("./routes/playlistRoutes");
const historyRoutes = require("./routes/historyRoutes");
const playgroundRoutes = require("./routes/playgroundRoutes");
const passport = require("passport");
const morgan = require("morgan");
const { verifyAccessToken } = require("./config/jwt.helper");
const cors = require("cors");
const session = require("express-session");
const MongoStore = require("connect-mongo");

const port = process.env.PORT || 5000;
require("./db/conn");

app.use(cors());
app.use(morgan("tiny"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(passport.initialize());
const options = {
  mongoUrl: process.env.LOCAL_DATABASE,
  collectionName: "sessions",
};
require("./config/passport").Passport(passport);

app.use("/dsa", dsaRoutes);
app.use("/api", userRoutes);
app.use("/api/question", questionRoutes);
app.use("/api/user", verifyAccessToken, playlistRoutes);
app.use("/api/user/history", verifyAccessToken, historyRoutes);
app.use("/playground", playgroundRoutes);

app.listen(process.env.PORT || 5000, () =>
  console.log(`Server is listening on port: ${port}`)
);

module.exports = app;
