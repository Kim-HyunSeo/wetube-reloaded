import bcrypt from "bcrypt";
import User from "../models/user";
import Video from "../models/video";

export const getJoin = (req, res) => res.render("join", { pageTitle: "Join" });
export const postJoin = async (req, res) => {
    const { name, username, email, password, password2, location } = req.body;
    const pageTitle = "Join";
    if (password !== password2) {
        return res.status(400).render("join", {
            pageTitle,
            errorMessage: "Password confirmation does not match.",
        });
    }
    const exists = await User.exists({ $or: [{ username }, { email }] });
    if (exists) {
        return res.status(400).render("join", {
            pageTitle,
            errorMessage: "This username/email is already taken.",
        });
    }
    // const usernameExists = await User.exists({ username });
    // if (usernameExists) {
    //     return res.render("join", {
    //         pageTitle,
    //         errorMessage: "This username is already taken."
    //     });
    // }
    // const emailExists = await User.exists({ email });
    // if (emailExists) {
    //     return res.render("join", {
    //         pageTitle,
    //         errorMessage: "This email is already taken."
    //     })
    // }
    try {
        await User.create({
            name,
            username,
            email,
            password,
            location,
        });
        return res.redirect("/login", pageTitle);
    } catch (error) {
        return res.status(400).render("join", {
            pageTitle,
            errorMessage: error._message,
        });
    }
};
export const getLogin = (req, res) => res.render("login", { pageTitle: "Login" });
export const postLogin = async (req, res) => {
    const { username, password } = req.body;
    const pageTitle = "Login";
    const user = await User.findOne({ username });
    if (!user) {
        return res.status(400).render("login", {
            pageTitle: "Login",
            errorMessage: "An account with his username doesn't exists.",
        });
    }
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
        return res.status(400).render("login", {
            pageTitle,
            errorMessage: "Wrong Password",
        });
    }
    req.session.loggedIn = true;
    req.session.user = user;
    return res.redirect("/");
};
export const logout = (req, res) => {};
export const getEdit = (req, res) => {
    return res.render("edit-profile", {
        pageTitle: "Edit Profile",
    });
};
export const postEdit = async (req, res) => {
    const {
        session: {
            user: { _id, avatarUrl },
        },
        body: { name, email, username, location },
        file,
    } = req;
    const updatedUser = await User.findByIdAndUpdate(
        _id,
        {
            avatarUrl: file ? file.path : avatarUrl,
            name,
            email,
            username,
            location,
        },
        { new: true },
    );
    req.session.user = updatedUser;
    return res.redirect("/user/edit");
};
export const getPassword = (req, res) => {
    return res.render("user/change-password", {
        pageTitle: "Change Password",
    });
};
export const postPassword = async (req, res) => {
    const {
        session: {
            user: { _id },
        },
        body: { oldPassword, newPassword, newPasswordConfirm },
    } = req;
    const user = await User.findById(_id);
    const ok = await bcrypt.compare(oldPassword, password);
    if (!ok) {
        return res.status(400).render("user/change-password", {
            pageTitle: "Change Password",
            errorMessage: "The current password is incorrect.",
        });
    }
    if (newPassword !== newPasswordConfirm) {
        return res.status(400).render("user/change-password", {
            pageTitle: "Change Password",
            errorMessage: "The password does not match the confirmation.",
        });
    }
    user.password = newPassword;
    await user.save();
    req.session.user.password = user.password;
    // send notification
    return res.redirect("/user/logout");
};

export const see = async (req, res) => {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
        return res.status(404).render("404", {
            pageTitle: "User not Found",
        });
    }
    const videos = await Video.find({ owner: user.id });
    return res.render("user/profile", {
        pageTitle: `${user.name}'s Profile`,
        user,
        videos,
    });
};
