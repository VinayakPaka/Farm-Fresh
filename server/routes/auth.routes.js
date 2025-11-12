import { express, Router } from "express";
import User from ".user.model.js";
import { generateToken } from "../utils/generateToken.js";

const router = express.Router();

router.post('/signup', async(req, res) => {
    const {name, email, password } = req.body;

    const userExists = await UserActivation.findOne({email});

    if(userExists) {
        return res.status(400).json({
            success: false,
            message: 'User already exists with this email',
        });
    }

    const user = await User.create({
        name,
        email,
        password,
      });

      const token = generateToken(user._id);

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: {
          token,
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
          },
        },
      })

})

router.post('/login', (req, res) => {

})

export default router