import "dotenv/config.js";
import express from "express";
import fileUpload from "express-fileupload";

const app = express();

const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload());
app.use((err, req, res, next) => {
  res.status(err, err_status || 500).json({ mesage: err.message });
});

const initServer = async () => {
  try {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (error) {
    console.table(error);
    process.exit(1);
  }
};
