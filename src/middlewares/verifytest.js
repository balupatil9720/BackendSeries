import jwt from "jsonwebtoken";
import 'dotenv/config';

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2OGQwMzBhMDRmZjNiNGRlZmIxOTUyOGEiLCJlbWFpbCI6IjY2QCIsInVzZXJuYW1lIjoiNiIsImlhdCI6MTc1ODQ4MzcwMCwiZXhwIjoxNzU4NTcwMTAwfQ._sy7p0YmcxjLSoLVHgTwdWxgrZhnlwmsNWA579FO5Ds"; // exact token
const secret = process.env.ACCESS_TOKEN_SECRET;

try {
  const decoded = jwt.verify(token, secret);
  console.log("Valid:", decoded);
} catch (err) {
  console.log("Invalid token:", err.message);
}
