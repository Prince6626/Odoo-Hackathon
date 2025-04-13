const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const { set } = require("mongoose");
const User = require("../models/user");
const userRouter = express.Router();

userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedUserId = req.user._id;
    const USER_SAFE_DATA =
      "firstName lastName age gender profileurl about skills";
    const connectionRequest = await ConnectionRequest.find({
      toUserId: loggedUserId,
      status: "interested",
    }).populate("fromUserId", USER_SAFE_DATA);
    res.json({ message: "Requests", data: connectionRequest });
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const USER_SAFE_DATA =
      "firstName lastName age gender profileUrl about skills";
    const loggedUserId = req.user._id;
    const connectionRequest = await ConnectionRequest.find({
      $or: [
        { toUserId: loggedUserId, status: "accepted" },
        { fromUserId: loggedUserId, status: "accepted" },
      ],
    })
      .populate("fromUserId", USER_SAFE_DATA)
      .populate("toUserId", USER_SAFE_DATA);

    const data = connectionRequest.map((row) => {
      if (row.fromUserId._id.toString() === loggedUserId.toString()) {
        return row.toUserId;
      }
      return row.fromUserId;
    });
    res.json({ data });
  } catch (err) {
    res.status(400).send("ERROR :" + err.message);
  }
});

userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit;
    const skip = (page - 1) * limit;

    const USER_SAFE_DATA =
      "firstName lastName age gender profileUrl about skills";
    const loggedUserId = req.user._id;
    const connectionRequest = await ConnectionRequest.find({
      $or: [{ toUserId: loggedUserId }, { fromUserId: loggedUserId }],
    }).select("fromUserId toUserId");

    const hideUsersFromFeed = new Set();

    connectionRequest.forEach((req) => {
      hideUsersFromFeed.add(req.fromUserId.toString());
      hideUsersFromFeed.add(req.toUserId.toString());
    });

    const users = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUsersFromFeed) } },
        { _id: { $ne: loggedUserId } },
      ],
    })
      .select(USER_SAFE_DATA)
      .skip(skip)
      .limit(limit);

    res.send(users);
  } catch (err) {
    res.status(400).send("ERROR :" + err.message);
  }
});

module.exports = userRouter;
