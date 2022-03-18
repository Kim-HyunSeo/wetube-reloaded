import bcrypt from "bcrypt";
import fetch from "node-fetch";
import User from "../models/user";
import Video from "../models/video";

export const getJoin = (req, res) => res.render("join", { pageTitle: "Join" });

export const postJoin = async (req, res) => {
    const pageTitle = "Join";
    const { name, username, email, password, password2, location } = req.body;
    const { file } = req;
    if (password !== password2) {
        return res.status(400).render("join", {
            pageTitle,
            errorMessage: "Password confirmation does not match.",
        });
    }
    const usernameExists = await User.exists({ username });
    if (usernameExists) {
        return res.render("join", { pageTitle, errorMessage: "This username is already taken." });
    }
    const emailExists = await User.exists({ email });
    if (emailExists) {
        return res.status(400).render("join", {
            pageTitle,
            errorMessage: "This email is already taken.",
        });
    }
    try {
        await User.create({
            name,
            username,
            email,
            password,
            location,
        });
        return res.redirect("/login");
    } catch (error) {
        console.log(error);
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
    const user = await User.findOne({ username, socialOnly: false });
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
    return res.redirect("/login");
};
export const logout = (req, res) => {
    req.session.destroy();
    return res.redirect("/");
};

export const getEdit = (req, res) => {
    return res.render("edit-profile", {
        pageTitle: "Edit Profile",
    });
};

export const postEdit = async (req, res) => {
    const { _id, avatarUrl } = req.session.user;
    const { name, email, username, location } = req.body;
    const { file } = req;
    console.log(file);
    const updatedUser = await User.findByIdAndUpdate(
        _id,
        {
            avatarUrl: !file ? avatarUrl : file.location,
            name,
            email,
            username,
            location,
        },
        { new: true },
    );
    req.session.user = updatedUser;
    console.log(req.file);
    return res.redirect("/users/edit");
};

export const getPassword = (req, res) => {
    return res.status(200).render("user/change-password", {
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
    const user = await User.findById(id).populate("videos");
    if (!user) return res.status(404).render("404", { pageTitle: "User not Found" });
    console.log(user);
    const videos = await Video.find({ owner: user.id });
    return res.render("user/profile", {
        pageTitle: `${user.name}'s Profile`,
        user,
    });
};

export const githubLogin = async (req, res) => {
    const baseUrl = "https://github.com/login/oauth/authorize";
    const config = {
        client_id: process.env.GITHUB_CLIENT,
        allow_signup: "false",
        scope: "read:user user:email",
    };
    const params = new URLSearchParams(config).toString();
    const finalUrl = `${baseUrl}?${params}`;
    return res.redirect(finalUrl);
};

export const githubCallback = async (req, res) => {
    const baseUrl = "https://github.com/login/oauth/access_token";
    const config = {
        client_id: process.env.GITHUB_CLIENT,
        client_secret: process.env.GITHUB_SECRET,
        code: req.query.code,
    };
    const params = new URLSearchParams(config).toString();
    const finalUrl = `${baseUrl}?${params}`;
    const token = await (
        await fetch(finalUrl, {
            method: "POST",
            headers: {
                Accept: "application/json",
            },
        })
    ).json();
    if (token.access_token) {
        const { access_token } = token;
        const apiUrl = "https://api.github.com";
        const userData = await (
            await fetch(`${apiUrl}/user`, {
                headers: {
                    Authorization: `token ${access_token}`,
                },
            })
        ).json();
        const emailData = await (
            await fetch(`${apiUrl}/user/emails`, {
                headers: {
                    Authorization: `token ${access_token}`,
                },
            })
        ).json();
        const emailObj = emailData.find((email) => email.primary === true && email.verified === true);
        console.log(userData, emailObj);
        if (!emailObj) {
            return res.redirect("/login");
        }
        let user = await User.findOne({ email: emailObj.email });
        if (!user) {
            user = await User.create({
                socialLogin: true,
                name: userData.name,
                username: userData.login,
                email: emailObj.email,
                password: "GITHUB_SIGNIN",
                location: userData.location,
            });
        }
        req.session.loggedIn = true;
        req.session.user = user;
        return res.redirect("/");
    } else {
        return res.redirect("/login");
    }
};
