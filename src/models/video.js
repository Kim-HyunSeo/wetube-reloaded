import mongoose from "mongoose";
const Schema = mongoose.Schema;

const VideoSchema = new mongoose.Schema(
    {
        title: { type: String, required: true, trim: true, maxLength: 20 },
        fileUrl: { type: String, required: true },
        description: { type: String, required: true, trim: true, maxLength: 200 },
        hashtags: [{ type: String, trim: true }],
        meta: {
            views: { type: Number, default: 0, required: true },
            ratings: { type: Number, default: 0, required: true },
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    { timestamps: true },
);

VideoSchema.static("formatHashtags", (hashtags) => {
    return hashtags
        .replace(/ /gi, "")
        .split(",")
        .map((word) => (word.startsWith("#") ? `${word}` : `#${word}`));
});

const Video = mongoose.model("Video", VideoSchema);

export default Video;
