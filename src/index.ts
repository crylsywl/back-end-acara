import express from "express";
import routes from "./routes/api";
import bodyParser from "body-parser";
import db from "./utils/database";
import docs from "./docs/route";
import cors from "cors";

async function init() {
  try {
    const result = await db();

    console.log("database Status: ", result);

    const app = express();

    app.use(cors());
    app.use(bodyParser.json());

    const PORT = 3000;

    app.use("/api", routes);
    docs(app);

    app.get("/", (req, res) => {
      res.status(200).json({
        message: "Server is running, use /api-docs to view the API documentation.",
        data: null,
      });
    });

    app.listen(PORT, () => {
      console.log(`Server running on port http://localhost:${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
}

init();
