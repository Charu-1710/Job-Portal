import {User} from "../models/user.js"
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";

export const register = async (req,res)=>{
    try {
        const {fullname,email,phoneNumber,password,role} = req.body;
        // console.log(fullname,email,phoneNumber,password,role)
        if(!fullname || !email || !phoneNumber || !password || !role ){
            return res.status(400).json({
                message:"Something is missing",
                success:false
            })
        }

        const file = req.file
        const fileUri = getDataUri(file)
        const cloudResponse = await cloudinary.uploader.upload(fileUri.content)

        let user = await User.findOne({email});
        if(user){
            return res.status(400).json({
                message:"User already exist with this email",
                success:false,
            })       
        }
        
        const hashedPassword = await bcrypt.hash(password,10);
        await User.create({
            fullname,
            email,
            phoneNumber,
            password:hashedPassword,
            role,
            profile:{
                profilePhoto:cloudResponse.secure_url,
            }
        })

        return res.status(201).json({
            message:"Account created sucessfully",
            success : true
        })
    } catch (error) {
        console.log(error)
    }
}

export const login = async (req,res)=>{
    try {
        const {email,password,role} = req.body
        if(!email || !password || !role ){
            return res.status(400).json({
                message:"Something is missing",
                success:false
            })
        }
        let user = await User.findOne({email});
        if(!user){
            return res.status(400).json({
                message : "Incorrect email or password",
                success:false
            })
        }
        const isPasswordMatch = await bcrypt.compare(password,user.password)
        if(!isPasswordMatch){
            return res.status(400).json({
                message : "Incorrect email or password",
                success : false
            })
        }
        if(role != user.role){
            return res.status(400).json({
                message : "Account doesn't exist with current role",
                success : false
            })
        }

        const tokenData = {
            userId : user._id
        }

        const token = await jwt.sign(tokenData,process.env.SECRET_KEY,{expiresIn:'1d'})
        user = {
            _id:user._id,
            fullname : user.fullname,
            email:user.email,
            phoneNumber:user.phoneNumber,
            role:user.role,
            profile:user.profile
        }
        return res.status(200).cookie("token",token,{maxAge:1*24*60*60*1000,httpOnly:true,sameSite:'strict'}).json({
            message :`Welcome back ${user.fullname}`,
            user,
            success:true
        })
    } catch (error) {
        console.log(error)
    }
}

export const logout = async (req,res)=>{
    try {
        return res.status(200).cookie("token","",{maxAge:0}).json({
            message : "logged out successfully",
            success:true
        })
    } catch (error) {
        console.log(error);
    }
}

export const updateProfile = async (req,res)=>{
    try {
        const {fullname,email,phoneNumber,bio,skills} = req.body;
        console.log(fullname,email,phoneNumber,bio,skills)
        const file = req.file
        console.log(file)
                // cloudinary ayega idhr
        // const fileUri = getDataUri(file);
        // const cloudResponse = await cloudinary.uploader.upload(fileUri.content)
        


        let skillsArray;
        if(skills){
            skillsArray = skills.split(",")
        }
        const userId = req.id;
        let user = await User.findById(userId);

        if(!user){
            return res.status(400).json({
                message:"user not found",
                success:false
            })
        }
// updating data
        if(fullname) user.fullname = fullname
        if(phoneNumber) user.phoneNumber = phoneNumber
        if(email) user.email = email
        if(bio) user.profile.bio = bio
        if(skills) user.profile.skills = skillsArray
        
        // user.fullname = fullname,
        // user.email = email,
        // user.phoneNumber = phoneNumber,
        // user.profile.bio = bio,
        // user.profile.skills = skillsArray

        // resume comes later here
        if(file){
            user.profile.resume = file.path.replace(/\\/g, "/");
            console.log(user.profile.resume)
            user.profile.resumeOriginalName = file.originalname
            console.log(user.profile.resumeOriginalName)
        }

        await user.save();

        user = {
            _id:user._id,
            fullname : user.fullname,
            email:user.email,
            phoneNumber:user.phoneNumber,
            role:user.role,
            profile:user.profile
        }

        return res.status(200).json({
            message : "Profile Updated Successfully",
            user,
            success : true
        })

    } catch (error) {
        console.log(error)
        
    }
}





