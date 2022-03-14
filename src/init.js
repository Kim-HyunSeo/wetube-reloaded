import "./db";
import "./models/video";
import "./models/user";
import app from "./app";

const PORT = 1356;
app.listen(PORT, () => console.log(`✅ Server listening on port http://localhost:${PORT} 🚀`));
