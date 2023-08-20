import UserModel from "../Models/userModel.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'

//get all users for follow suggestion
export const getAllUsers = async (req,res)=>{
    try {
        let users = await UserModel.find();
        users = users.map((user)=>{
            const { password, ...otherDetails} = user._doc;
            return otherDetails;
        })
        res.status(200).json(users)
    } catch (error) {
        res.status(500).json(error);
    }
}

//get a single user
export const getUser = async (req, res) => {
    const id = req.params.id;

    try {
        const user = await UserModel.findById(id);

        if (user) {
            const { password, ...otherDetails } = user._doc;
            res.status(200).json(otherDetails);
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const updateUser = async (req, res) => {
    const id = req.params.id;

    const { _id, currentUserAdminStatus, password } = req.body;

    if (id === _id) {
        try {
            if (password) {
                const salt = await bcrypt.genSalt(10);
                const hashedPass = await bcrypt.hash(password, salt);
                req.body.password = hashedPass;
            }
            console.log(req.body);
            const user = await UserModel.findByIdAndUpdate(id, req.body, { new: true, });

            const token = jwt.sign(
                { username: user.username, id: user._id },
                process.env.JWT_SECRET,
                { expiresIn: "1h" }
            )

            res.status(200).json({ user, token });
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }

    } else {
        res.status(403).json({ message: "Access denied ! You can only update your profile" });
    }
}

export const deleteUser = async (req, res) => {
    const id = req.params.id;

    const { currentUserId, currentUserAdminStatus } = req.body;

    if (currentUserId === id || currentUserAdminStatus) {
        try {
            await UserModel.findByIdAndDelete(id);
            res.status(200).json({ message: "User deleted Successfully ." });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    } else {
        res.status(403).json({ message: "Access denied ! You can only delete your profile" });
    }
}
// 1:11 minutes

// Follow user routes below

export const followUser = async (req, res) => {
    const id = req.params.id; // id of the person you want to follow

    const { _id } = req.body; // your id || id of the person who is goind to follow

    if (id === _id) {
        res.status(403).json({ message: "Action Forbidden" });
    } else {
        try {
            const followUser = await UserModel.findById(id);
            const followingUser = await UserModel.findById(_id);

            if (!followUser.followers.includes(_id)) {
                await followUser.updateOne({ $push: { followers: _id } });
                await followingUser.updateOne({ $push: { following: id } });
                res.status(200).json({ message: "User followed !" });
            } else {
                res.status(403).json({ message: "User is already followed by you !" });
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

export const unfollowUser = async (req, res) => {
    const id = req.params.id;

    const { _id } = req.body;

    if (_id === id) {
        res.status(403).json({ message: "Action Forbidden !" });
    } else {
        try {
            const followUser = await UserModel.findById(id);
            const followingUser = await UserModel.findById(_id);

            if (followUser.followers.includes(_id)) {
                await followUser.updateOne({ $pull: { followers: _id } });
                await followingUser.updateOne({ $pull: { following: id } });
                res.status(200).json({ message: "User unfollowed !" });
            } else {
                res.status(403).json({ message: "User is not followed by you !" });
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}
