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
        // 2 MB
        fileSize: 2000000,
    },
    storage: multerS3({
        s3: s3,
        bucket: "clone-wetube-node/images",
        acl: "public-read",
    }),
});

export const deleteAvatar = (req, res, next) => {
    if (!req.file) next();
    s3.deleteObject(
        {
            bucket: "clone-wetube-node/images",
            key: `images/${req.session.user.avatarURL.split("/")[4]}`,
        },
        (err, data) => {
            if (err) throw err;
            console.log(`${data}: deleted in AWS S3`);
        },
    );
    next();
};

export const uploadVideo = multer({
    dest: "uploads/videos",
    limits: {
        // 20 MB
        fileSize: 20000000,
    },
});
