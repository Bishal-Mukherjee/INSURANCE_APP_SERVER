const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
// const easyinvoice = require("easyinvoice");

exports.signup = async (req, res) => {
  try {
    const { deviceid, password, secretpin } = req.body;

    const existing = await User.find({ deviceid }).select("-password");
    if (existing.length > 0) {
      return res.status(200).json({
        message: {
          text: "User already registered",
          type: "error",
        },
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedpassword = await bcrypt.hash(password, salt);
    const hashedsecretpin = await bcrypt.hash(secretpin, salt);

    const newuser = User({
      ...req.body,
      password: hashedpassword,
      secretpin: hashedsecretpin,
    });

    await newuser.save();
    return res
      .status(200)
      .json({ message: { text: "Registered successfully", type: "success" } });
  } catch (err) {
    console.log("error sigin up user");
    console.log(err.message);
    return res
      .status(500)
      .json({ message: { text: "Something went wrong", type: "error" } });
  }
};

exports.siginwithemail = async (req, res) => {
  try {
    const { email, password, deviceid } = req.body;
    const user = await User.findOne({ email }).select("-secretpin");
    user.deviceid = deviceid; // updating device id

    if (!user) {
      return res
        .status(200)
        .json({ message: { text: "Inavlid Credentials", type: "error" } });
    }
    const isMatch = await bcrypt.compareSync(password, user.password);
    if (isMatch) {
      const payload = {
        user: {
          id: user.id,
        },
      };
      user.password = undefined;
      const token = jwt.sign(payload, "insurance", {
        expiresIn: 1000000,
      });
      await user.save();
      return res.status(200).json({ token, user });
    } else {
      return res
        .status(200)
        .json({ message: { text: "Inavlid Credentials", type: "error" } });
    }
  } catch (err) {
    console.log("error sign in with email");
    console.log(err);
    return res.status(500).json({ err: err.message });
  }
};

exports.siginwithotp = (req, res) => {
  try {
    const { phonenumber } = req.body;
  } catch (err) {
    console.log(err);
  }
};

exports.siginwithpin = async (req, res) => {
  try {
    const { deviceid, secretpin } = req.body;
    const user = await User.findOne({ deviceid }).select("-password");

    if (!user) {
      return res
        .status(200)
        .json({ message: { text: "Inavlid Credentials", type: "error" } });
    }
    const isMatch = await bcrypt.compareSync(secretpin, user.secretpin);
    if (isMatch) {
      const payload = {
        user: {
          id: user.id,
        },
      };
      user.secretpin = undefined;
      const token = jwt.sign(payload, "insurance", {
        expiresIn: 1000000,
      });
      return res.status(200).json({ token, user });
    } else {
      return res
        .status(200)
        .json({ message: { text: "Inavlid Credentials", type: "error" } });
    }
  } catch (err) {
    console.log("error sign in with pin");
    console.log(err);
    return res.status(500).json({ err: err.message });
  }
};

exports.generatepdf = () => {};
