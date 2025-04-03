import express from "express";
import routes from "./routes/api"

const app = express();

const PORT = 3000;

app.use("/api", routes);


app.listen(PORT, () => {
    console.log(`Server running on port http://localhost:${PORT}`);
});