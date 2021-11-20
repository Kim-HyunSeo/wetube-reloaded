import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true, minLength: 1, maxLength: 20 },
    videoUrl: { type: String, required: true },
    description: { type: String, required: true, trim: true, minLength: 20, maxLength: 150 },
    createdAt: { type: Date, required: true, default: Date.now },
    hashtags: [{ type: String, trim: true }],
    meta: {
        view: { type: Number, default: 0, required: true },
        rating: { type: Number, default: 0, required: true },
    },
});

videoSchema.static("formatHashtags", function (hashtags) {
    return hashtags
        .replace(/ /gi, '')
        .split(",")
        .map((word) => word.startsWith('#') ? `${word}` : `#${word}`)
});

const Video = mongoose.model("Video", videoSchema);

export default Video;