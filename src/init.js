import "./db";
import "./models/video";
import "./models/user";
import app from "./server";

const PORT = 1444;

const handleListening = () =>
    console.log(`✅ Server listening on port http://localhost:${PORT} 🚀`);

app.listen(PORT, handleListening);