import User from "../modals/user";
import { loginSchema, signUpSchema } from "../utils/validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { COOKIE_NAME } from "../utils/constants";

// get all user details

export const getAllUsers = async (req: any, res: any) => {
  try {
    const users = await User.find();
    return res.status(201).json({ message: "ok", users });
  } catch (error) {
    return res.status(400).json("error while fetching");
  }
};

// signup endpoint

export const createAccount = async (req: any, res: any) => {
  try {
    const user = await req.body;
    const { success, error } = signUpSchema.safeParse(req.body);
    if (!success) {
      return res.status(200).json({
        message: error.errors,
      });
    }
    const ifAlreadyExists = await User.findOne({
      email: user.email,
    });
    if (ifAlreadyExists) {
      return res.status(401).json({
        message: "user with email already exists",
        success: false,
      });
    }
    const hashedPassword = await bcrypt.hash(user.password, 10);
    const new_user = await User.create({
      ...user,
      password: hashedPassword,
    });

    res.clearCookie(COOKIE_NAME, {
      path: "/",
      httpOnly: true,
      domain: "localhost",
      signed: true,
    });
    const secret: string = process.env.JWT_SECRET || "";
    const accessToken = jwt.sign({ email: user.email }, secret, {
      expiresIn: "1h",
    });
    res.cookie(COOKIE_NAME, accessToken, {
      path: "/",
      domain: "localhost",
      expiresIn: "1h",
      httpOnly: true,
      signed: true,
    });
    return res.status(200).json({
      message: "Account created successfully",
      accessToken,
    });
  } catch (error) {
    console.log(error);
  }
};

// login

export const login = async (req: any, res: any) => {
  try {
    const data = await req.body;
    const { success, error } = loginSchema.safeParse(req.body);
    if (!success) {
      return res.status(400).json({
        message: "validation error",
        error: error.errors,
      });
    }
    const user = await User.findOne({
      email: data.email,
    });
    if (!user) {
      return res.status(400).json({
        message: "user doesnt exist please signup",
      });
    }
    const isMatched = await bcrypt.compare(data.password, user.password);
    if (!isMatched) {
      return res.status(400).json({
        message: "password is incorrect",
      });
    }
    res.clearCookie(COOKIE_NAME, {
      path: "/",
      httpOnly: true,
      domain: "localhost",
      signed: true,
    });
    const secret = process.env.JWT_SECRET;
    const accessToken = jwt.sign({ email: data.email }, secret || "", {
      expiresIn: "1h",
    });
    res.cookie(COOKIE_NAME, accessToken, {
      path: "/",
      domain: "localhost",
      expiresIn: "1h",
      httpOnly: true,
      signed: true,
    });
    return res.status(200).json({
      message: "logged in successfully",
      accessToken,
    });
  } catch (error) {
    console.log(error);
  }
};
