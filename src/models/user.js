import bcrypt from "bcrypt";
import mongoose from "mongoose";
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    email: { type: String, required: true, unique: true },
    avatarUrl: String,
    socialOnly: { type: Boolean, default: false },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    location: String,
});

UserSchema.pre("save", async () => {
    this.password = await bcrypt.hash(this.password, 5);
    console.log(this.password);
});

const User = mongoose.model("User", UserSchema);

export default User;
