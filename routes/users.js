const express = require("express");
const router = express.Router();
const {
  signup,
  siginwithemail,
  siginwithpin,
} = require("../controllers/users");
const path = require("path");
const fs = require("fs");

const handlebars = require("handlebars");
const puppeteer = require("puppeteer");

router.post("/signup", signup);

router.post("/siginemail", siginwithemail);

router.post("/signinpin", siginwithpin);

const compile = async function (data) {
  try {
    const filepath = path.join(process.cwd(), "templates", "templates.hbs");
    const html = await fs.readFileSync(filepath, "utf8");

    handlebars.registerHelper("isObject", function (variable, options) {
      return typeof variable === "object" && !Array.isArray(variable);
    });

    handlebars.registerHelper("isArray", function (variable, options) {
      return Array.isArray(variable);
    });

    handlebars.registerHelper("getKeys", function (variable, options) {
      return typeof variable === "object" && Object.keys(variable);
    });

    return handlebars.compile(html)(data);
  } catch (err) {
    console.log(err);
  }
};

const createPdf = async ({ html }) => {
  try {
    const browser = await puppeteer.launch({
      headless: "new",
    });
    const page = await browser.newPage();

    await page.setContent(html);
    await page.emulateMediaFeatures("screen");
    await page.pdf({
      path: "template.pdf",
      format: "A4",
      printBackground: true,
    });
    return;
  } catch (err) {
    console.log(err);
  }
};

const obj = {
  table1: [
    { label: "Vehicle Make", value: "Hero" },
    { label: "Model", value: "Hero Passion Pro" },
    { label: "Registration No.", value: "123456789" },
    { label: "Passengers", value: "2" },
    { label: "IDV of the Vehicle", value: "50000" },
    { label: "Zone", value: "A" },
    { label: "Year of Manufacture", value: "2018" },
    { label: "Seating Capacity", value: "2" },
  ],

  table2: {
    header: { label: "Own Damage Premium (A)", value: "Rupees" },
    rows: [
      { label: "Vehicle Basic Rate", value: "1.756" },
      { label: "Electrical Accessories", value: "1000" },
      { label: "Non-Electrical Accessories", value: "2000" },
      { label: "Basic OD Premium", value: "500" },
    ],
  },

  table3: {
    header: { label: "Addon Coverage (B)", value: "Rupees" },
    rows: [
      { label: "Vehicle Basic Rate", value: "1.756" },
      { label: "Electrical Accessories", value: "1000" },
      { label: "Non-Electrical Accessories", value: "2000" },
      { label: "Basic OD Premium", value: "500" },
    ],
  },

  table4: {
    header: { label: "Liability Premium (C)", value: "Rupees" },
    rows: [
      { label: "Vehicle Basic Rate", value: "1.756" },
      { label: "Electrical Accessories", value: "1000" },
      { label: "Non-Electrical Accessories", value: "2000" },
      { label: "Basic OD Premium", value: "500" },
    ],
  },
};

router.post("/generatetemplate", async (req, res) => {
  try {
    console.log("initiated");
    // const { name } = req.body;
    const html = await compile({ obj });
    await createPdf({ html });
    console.log("generated!");

    // once generated, upload and save the pdf to firebase
    // share the downloadable link along with the response

    return res.json({ message: "generated!" });
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
