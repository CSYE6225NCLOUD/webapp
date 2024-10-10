const express = require("express");
const mysql = require("mysql");
const bcrypt = require("bcrypt");
const PORT = 4200;
const dotenv = require("dotenv");

const db = require("./models");
const basicAuth = require("basic-auth");
const { User } = require("./models");
dotenv.config();

const app = express();
app.use(express.json());

const checkdbConnection = async (req, res, next) => {
  try {
    await db.sequelize.authenticate();
    console.log("Database connection is healthy");
    next();
  } catch (error) {
    console.error("Database connection failed:", error.message);
    return res.status(503).json({ message: "Connection Failed" });
  }
};

app.use(checkdbConnection);

app.head("/healthz", (req, res) => {
  res.status(405).end();
});

app.head("/v1/user/self", (req, res) => {
  res.status(405).send();
});
const authenticate = async (req, res, next) => {
  const credentials = basicAuth(req);
  console.log("Credentials", credentials);

  if (!credentials || !credentials.name || !credentials.pass) {
    return res.status(401).send("Authentication required");
  }

  try {
    const user = await User.findOne({ where: { email: credentials.name } });

    if (!user || !(await bcrypt.compare(credentials.pass, user.password))) {
      return res.status(400).send("Invalid credentials");
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};

app.post("/v1/user", async (req, res) => {
  const { first_name, last_name, email, password } = req.body;

  try {
    if ("account_created" in req.body || "account_updated" in req.body) {
      return res.status(400).end();
    }
    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      first_name: first_name,
      last_name: last_name,
      email: email,
      password: hashedPassword,
      account_created: new Date(),
      account_updated: new Date(),
    });
    res.status(201).json({
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      account_created: user.account_created,
      account_updated: user.account_updated,
    });
  } catch (error) {
    if (error.name === "SequelizeValidationError") {
      return res.status(400).end();
    }
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({ error: "Email already exists" });
    }
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/v1/user/self", authenticate, async (req, res) => {
  res.setHeader("Cache-Control", "no-cache");

  const raw_body = Object.keys(req.body).length;
  if (req.body && raw_body > 0) {
    return res.status(400).end();
  }

  const url_check = Object.keys(req.query).length;
  if (url_check > 0) {
    return res.status(400).end();
  }
  if (req.headers["content-length"] > 0 || req.headers["transfer-encoding"]) {
    return res.status(400).end();
  }

  const user = req.user;
  try {
    res.status(200).json({
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      account_created: user.account_created,
      account_updated: user.account_updated,
    });
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.put("/v1/user/self", authenticate, async (req, res) => {
  const { first_name, last_name, email, password } = req.body;
  const user = req.user;

  if (email && email !== user.email) {
    return res.status(400).end();
  }

  if (req.body.account_created || req.body.account_updated) {
    return res.status(400).end();
  }

  if (!first_name && !last_name && !password) {
    return res.status(400).end();
  }

  const updatedUser = {};
  if (first_name) {
    updatedUser.first_name = first_name;
  }
  if (last_name) {
    updatedUser.last_name = last_name;
  }
  if (password) {
    updatedUser.password = await bcrypt.hash(password, 12);
  }

  console.log("updated_user", updatedUser);

  try {
    await user.update({
      ...updatedUser,
      account_updated: new Date(),
    });

    res.status(204).end();
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/healthz", async (req, res) => {
  res.setHeader("Cache-Control", "no-cache");

  const raw_body = Object.keys(req.body).length;
  if (req.body && raw_body > 0) {
    return res.status(400).end();
  }

  const url_check = Object.keys(req.query).length;
  if (url_check > 0) {
    return res.status(400).end();
  }
  if (req.headers["content-length"] > 0 || req.headers["transfer-encoding"]) {
    return res.status(400).end();
  }

  try {
    await db.sequelize.authenticate();
    return res.status(200).end();
  } catch (error) {
    return res.status(503).end();
  }
});

app.all("/healthz", (req, res) => {
  res.setHeader("Cache-Control", "no-cache");
  return res.status(405).end();
});

app.delete("/v1/user/self", (req, res) => {
  res.status(405).send();
});

app.options("/v1/user/self", (req, res) => {
  res.status(405).send();
});

app.patch("/v1/user/self", (req, res) => {
  res.status(405).send();
});

db.sequelize
  .sync()
  .then(() => {
    app.listen(4100, () => {
      console.log("server running");
    });
  })
  .catch((error) => {
    // console.error("Failed to sync database:", error);
  });

module.exports = app;
