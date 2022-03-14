import bcrypt from "bcrypt";
import mongoose from "mongoose";
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    email: { type: String, required: true, unique: true },
    avatarUrl: { type: String, required: false },
    socialOnly: { type: Boolean, default: false },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    location: { type: String, required: false },
    videos: [
        {
            type: Schema.Types.ObjectId,
            ref: "Video",
        },
    ],
});

// Don't use arrow function !!!
UserSchema.pre("save", async function () {
    console.log(this);
    if (this.isModified("password")) {
        console.log(this);
        this.password = await bcrypt.hash(this.password, 5);
    }
});

const User = mongoose.model("User", UserSchema);

export default User;
