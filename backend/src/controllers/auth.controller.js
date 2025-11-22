import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../lib/utils.js";

export const signUp = async (req, res) => {
    const {fullName, email, password} = req.body;

    try{
        console.log(req.body);
        if (!fullName || !email || !password) return res.status(400).json({message: "All fields are required"});
        
        if (password.length < 6) return res.status(400).json({message: "Password must be at least 6 characters long"});
        
        const user = await User.findOne({email});

        if (user) return res.status(400).json({message: "Email already exists"});

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            fullName,
            email,
            password: hashedPassword,
        });

        if (newUser){
            generateToken(newUser._id, res);
            await newUser.save();
            res.status(201).json({
                message: "User created successfully",
                user:{
                    _id: newUser._id,
                    fullName: newUser.fullName,
                    email: newUser.email,
                }
            });
        } else{
            res.status(400).json({message: "Failed to create user: invalid data"});
        }

    } catch(error){
        console.log("Error during signup:", error.message || error);
        res.status(500).send("Error during signup", error);
    }
}

export const signIn = async (req, res) => {
    const {email, password} = req.body;

    try{
        const user = await User.findOne({email});
        if (!user) return res.status(400).json({message: "Invalid Data"});

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) return res.status(400).json({message: "Invalid Data"});

        const token = generateToken(user._id, res);

        res.status(200).json({
            message: `User ${user.fullName} logged in sucessfully`,
            userData: {
                _id: user._id,
                fullName: user.fullName,
                email: user.email,
                profilePic: user.profilePic,
            },
            auth : token,
        });

    } catch (error){
        console.log("Error during Sign In:", error.message || error);
        res.status(500).send("Error during Sign In", error);
    }
}

export const signOut = (req, res) => {
    try{
        res.cookie("jwt", "", {maxAge: 0});
        res.status(200).json({message: "User signed out successfully"});
    } catch (error){
        console.log("Error during Sign Out:", error.message || error);
        res.status(500).send("Error during Sign Out", error);
    }
}

export const updateUser = async (req, res) =>{
    try{
        const userId = req.params.id || req.user._id;
        const {fullName, email, password, profilePic} = req.body;
        
        const updateData = {};
        if (fullName) updateData.fullName = fullName;
        if (email) updateData.email = email;
        if (profilePic) updateData.profilePic = profilePic;
        if (password) updateData.password = await bcrypt.hash(password, await bcrypt.genSalt(10));

        // Only update if there's something to update
        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({ 
                message: "No fields to update" 
            });
        }

        if (email){
            const existingUser = await User.findOne({
                email,
                _id : {$ne: userId}
            })

            if (existingUser) return res.status(400).json({message: "Error Updating User: Email already in use"});
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {$set: updateData},
            {new: true, runValidators: true}
        );

        if (!updatedUser) return res.status(404).json({message: "Error Updating User: User not found"});

        res.status(200).json({
            message: `Profile Updated Successfully`,
            userData: {
                _id: updatedUser._id,
                fullName: updatedUser.fullName,
                email: updatedUser.email,
                profilePic: updatedUser.profilePic,
                createdAt: updatedUser.createdAt, // Include this too
            }
        });

    } catch(error){
        console.log("Error during User Update:", error.message || error);
        res.status(500).send("Error during User Update", error);
    }
}

