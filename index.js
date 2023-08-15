const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();
require("dotenv").config();

app.use(cors());
app.use(express.json({ extended: false }));

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DATABASE CONNECTED"))
  .catch((err) => {
    console.log("DATABASE CONNECTION ERROR");
    console.log(err);
  });
mongoose.set("strictQuery", true);

app.get("/", (req, res) => {
  return res.status(200).json({ message: "SERVER WORKING" });
});

app.use("/api/users", require("./routes/users"));

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`SERVER WORKING ON ${PORT}`);
});
