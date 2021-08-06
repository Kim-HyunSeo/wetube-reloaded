import User from "../models/user";
import bcrypt from "bcrypt";

export const getJoin = (req, res) =>
    res.render("join", { pageTitle: "Join" });
export const postJoin = async (req, res) => {
    const { name, username, email, password, password2, location } = req.body;
    const pageTitle = "Join";
    if (password !== password2) {
        return res.status(400).render("join", {
            pageTitle,
            errorMessage: "Password confirmation does not match."
        })
    }
    const exists = await User.exists({ $or: [{ username }, { email }] })
    if (exists) {
        return res.status(400).render("join", {
            pageTitle,
            errorMessage: "This username/email is already taken."
        })
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
        })
    }
};
export const getLogin = (req, res) => res.render("login", { pageTitle: "Login" });
export const postLogin = async (req, res) => {
    const { username, password } = req.body;
    const pageTitle = "Login"
    const user = await User.findOne({ username });
    if (!user) {
        return res.status(400).render("login", {
            pageTitle: "Login",
            errorMessage: "An account with his username doesn't exists."
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
// export const join = (req, res) => res.send("Join")
// export const join = (req, res) => res.send("Join")
// export const join = (req, res) => res.send("Join")