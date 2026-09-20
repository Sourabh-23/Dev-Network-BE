const express = require('express');
const userRouter = express.Router();
const { userAuth } = require("../../middlewares/auth");
const ConnectionRequestModel = require("../models/connectionRequest");
const UserModel = require("../models/user");
const { validateProfileEditData } = require("../utils/validation");
const USER_SAFE_DATA = "firstName lastName age gender photourl about";

const serializeUser = (user) => {
  if (!user) return null;

  const plainUser = user.toObject ? user.toObject() : { ...user };

  if (plainUser.photourl && !plainUser.photoUrl) {
    plainUser.photoUrl = plainUser.photourl;
  }

  if (plainUser.photoUrl && !plainUser.photourl) {
    plainUser.photourl = plainUser.photoUrl;
  }

  delete plainUser.password;
  return plainUser;
};

userRouter.get("/user", userAuth, async (req, res) => {
  try {
    res.json({ message: "User fetched successfully", data: serializeUser(req.user) });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

userRouter.delete("/user", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    await UserModel.findByIdAndDelete(loggedInUser._id);
    res.clearCookie("token");

    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

userRouter.patch("/user/:id", userAuth, async (req, res) => {
  try {
    const { id } = req.params;

    if (req.user._id.toString() !== id) {
      return res.status(403).json({ message: "You can update only your own profile" });
    }

    validateProfileEditData(req);

    const user = await UserModel.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    Object.keys(req.body).forEach((key) => {
      user[key] = req.body[key];
    });

    await user.save();

    res.json({ message: "User updated successfully", data: user });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get all pending connection requests for a user

// Get all the pending connection request for the loggedIn user
userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequests = await ConnectionRequestModel.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", USER_SAFE_DATA);
    // }).populate("fromUserId", ["firstName", "lastName"]);

    res.json({
      message: "Data fetched successfully",
      data: connectionRequests,
    });
  } catch (err) {
    req.statusCode(400).send("ERROR: " + err.message);
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequests = await ConnectionRequestModel.find({
      $or: [
        { toUserId: loggedInUser._id, status: "accepted" },
        { fromUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", USER_SAFE_DATA)
      .populate("toUserId", USER_SAFE_DATA);

    const data = connectionRequests.map((row) => {
      const connectedUser = row.fromUserId?._id?.toString() === loggedInUser._id.toString()
        ? row.toUserId
        : row.fromUserId;

      return serializeUser(connectedUser);
    });

    res.json({ data });
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    let limit = parseInt(req.query.limit, 10) || 10;
    limit = Math.min(Math.max(limit, 1), 50);
    const skip = (page - 1) * limit;

    const connectionRequests = await ConnectionRequestModel.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select("fromUserId  toUserId");

    const hideUsersFromFeed = new Set();
    connectionRequests.forEach((req) => {
      hideUsersFromFeed.add(req.fromUserId.toString());
      hideUsersFromFeed.add(req.toUserId.toString());
    });

      const filter = {
      $and: [
        { _id: { $nin: Array.from(hideUsersFromFeed) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    };

    const totalCount = await UserModel.countDocuments(filter);   // ← ye ek line add ki


    console.log("hideUsersFromFeed", hideUsersFromFeed);

    const users = await UserModel.find({
      $and: [
       { _id: { $nin: Array.from(hideUsersFromFeed) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    })
      .select(USER_SAFE_DATA)
      .skip(skip)
      .limit(limit);

    const data = users.map((user) => serializeUser(user));

    res.json({ totalCount, data });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = userRouter;