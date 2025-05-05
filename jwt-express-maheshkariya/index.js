const express = require("express");
const jwt = require("jsonwebtoken");

const app = express();
const port = 3000;

app.use(express.json());

app.get("/api/token", (req, res) => {
  const { name, email } = req.body;
  const payload = {
    name,
    email,
  };

  const secret = "mySecret";
  const token = jwt.sign(payload, secret, { expiresIn: "1h" });

  res.status(200).json({
    token,
  });
});

app.get("/api/verify", (req, res) => {
  const token = req.headers["authorization"].split(" ")[1] || "";
  const secret = "mySecret";

  try {
    const decoded = jwt.verify(token, secret);
    res.status(200).json({
      data: decoded,
    });
  } catch (err) {
    console.log(`Error: ${err}`);
    res.status(401).json({
      message: "Invalid Token",
    });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
