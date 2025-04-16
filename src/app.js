const express = require("express");
const connectDB = require("./config/database");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");

// app.use(
//   cors({
//     origin: "http://localhost:5173/",
//     credentials: true,
//   })
// );
const corsOptions = {
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};
app.use(cors(corsOptions));
// app.options("*", cors(corsOptions));

app.use(express.json());
app.use(cookieParser());


const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

connectDB()
  .then(() => {
    console.log("successfully connected to databse");
    app.listen(8888, () => {
      console.log("listen on port 8888");
    });
  })
  .catch((err) => {
    console.log("Database can't connect!!!");
  });
