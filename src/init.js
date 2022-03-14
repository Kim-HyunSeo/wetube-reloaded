import "./db";
import "./models/video";
import "./models/user";
import app from "./app";

const PORT = 8654;
app.listen(PORT, () => console.log(`✅ Server listening on port http://localhost:${PORT} 🚀`));
