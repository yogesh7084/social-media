import mongoose from "mongoose";
import UserModel from "../Models/userModel.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const registerUser = async (req, res) => {

    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(req.body.password, salt);
    req.body.password = hashedPass;
    const newUser = new UserModel(req.body);

    try {
        const oldUser = await UserModel.findOne({ username: req.body.username });
        if (oldUser) {
            res.status(400).json({ message: "Username already exist !" })
        } else {
            const user = await newUser.save();
            const token = jwt.sign(
                {
                    username: user.username,
                    id: user._id
                },
                process.env.JWT_SECRET,
                {
                    expiresIn: '1h'
                }
            )
            res.status(200).json({ user, token });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const loginUser = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await UserModel.findOne({ username });
        if (user) {
            const isMatch = await bcrypt.compare(password, user.password);

            if (isMatch) {
                const token = jwt.sign(
                    {
                        username: user.username,
                        id: user._id
                    },
                    process.env.JWT_SECRET,
                    { expiresIn: '1h' }
                )
                res.status(200).json({ user, token })
            } else {
                res.status(400).json({ message: "Invalid password" })
            }

        }
        else {
            res.status(404).json({ message: "User not found" });
        }

    } catch (error) {
        res.status(500).json({ message: error.message })
    }

}