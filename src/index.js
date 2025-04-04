import "dotenv/config.js";
import express from "express";
import fileUpload from "express-fileupload";

const app = express();

const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(fileUpload());

const initServer = async () => {
  try {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (error) {
    console.table(error);
    process.exit(1);
  }
};
