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

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
