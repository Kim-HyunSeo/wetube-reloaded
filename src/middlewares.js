import multer from "multer";
import multerS3 from "multer-s3";
import aws from "aws-sdk";

const s3 = new aws.S3({
    credentials: {
        accessKeyId: process.env.AWS_ID,
        secretAccessKey: process.env.AWS_SECRET,
    },
});

export const localsMiddleware = (req, res, next) => {
    res.locals.siteName = "WeTube";
    res.locals.loggedIn = Boolean(req.session.loggedIn);
    res.locals.loggedInUser = req.session.user || {};
    console.log(res.locals);
    next();
};

export const protectorMiddleware = (req, res, next) => {
    if (req.session.loggedIn) {
        next();
    } else {
        return res.redirect("/login");
    }
};

export const publicMiddleware = (req, res, next) => {
    if (!req.session.loggedIn) {
        next();
    } else {
        return res.redirect("/");
    }
};

export const uploadAvatar = multer({
    dest: "uploads/avatars",
    limits: {
        fileSize: 10000000,
    },
    storage: multerS3({
        s3: s3,
        bucket: "clone-wetube-node",
    }),
});

export const uploadVideo = multer({
    dest: "uploads/videos",
    limits: {
        fileSize: 10000000000,
    },
});
