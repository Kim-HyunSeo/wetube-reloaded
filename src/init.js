import "dotenv/config";
import "./db";
import "./models/video";
import "./models/user";
import app from "./app";

const PORT = 4001;
app.listen(PORT, () => console.log(`✅ Server listening on port http://localhost:${PORT} 🚀`));
