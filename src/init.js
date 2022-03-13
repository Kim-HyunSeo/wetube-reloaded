import "./db";
import "./models/video";
import "./models/user";
import app from "./app";

const PORT = 1456;

const handleListening = () => console.log(`✅ Server listening on port http://localhost:${PORT} 🚀`);

app.listen(PORT, handleListening);
