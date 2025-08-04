import { Request, Response } from "express";
import * as Yup from "yup";
import UserModel from "../models/user.models";
import { encrypt } from "../utils/encryption";
import { generateToken } from "../utils/jwt";
import { IReqUser } from "../utils/interface";
import response from "../utils/response";

type TRegister = {
  fullName: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
};

type TLogin = {
  identifier: string;
  password: string;
};

const registerValidateSchema = Yup.object({
  fullName: Yup.string().required(),
  username: Yup.string().required(),
  email: Yup.string().required(),
  password: Yup.string()
    .required()
    .min(6, "Password must be at least 6 characters")
    .test(
      "at-least-one-uppercase",
      "contain at least one uppercase letter",
      (value) => {
        if (!value) return false;
        const regex = /^(?=.*[A-Z])/;
        return regex.test(value);
      }
    )
    .test(
      "at-least-one-number",
      "contain at least one number letter",
      (value) => {
        if (!value) return false;
        const regex = /^(?=.*\d)/;
        return regex.test(value);
      }
    ),
  confirmPassword: Yup.string()
    .required()
    .oneOf([Yup.ref("password"), ""], "Passwords must match"),
});

export default {
  async register(req: Request, res: Response) {
    /**
     #swagger.tags = ['Auth']
    */
    const { fullName, username, email, password, confirmPassword } =
      req.body as unknown as TRegister;

    try {
      await registerValidateSchema.validate({
        fullName,
        username,
        email,
        password,
        confirmPassword,
      });

      const result = await UserModel.create({
        fullName,
        username,
        email,
        password,
      });
      response.succes(res, result,"Success Registration")
    } catch (error) {
      response.error(res, error, 'failed registration')
    }
  },

  async login(req: Request, res: Response) {
    /**
     #swagger.tags = ['Auth']
     #swagger.requestBody = {
       required: true,
       schema: {
         $ref: "#/components/schemas/loginRequest"
       }
     }
     */

    try {
      const { identifier, password } = req.body as unknown as TLogin;
      const userByIdentyfier = await UserModel.findOne({
        $or: [
          {
            username: identifier,
          },
          {
            email: identifier,
          },
        ],
        isActive: true,
      });

      if (!userByIdentyfier) {
        return response.unauthorize(res, 'user not found');
        
      }

      const validatePassword: boolean =
        encrypt(password) === userByIdentyfier.password;

      if (!validatePassword) {
        return response.unauthorize(res, 'Invalid password')
      }

      const token = generateToken({
        id: userByIdentyfier._id,
        role: userByIdentyfier.role,
      });

      // res.status(200).json({
      //   message: "Success login",
      //   data: token,
      // });
      res.status(200).json({
        token, // Token di root level
        user: {
          _id: userByIdentyfier._id,
          role: userByIdentyfier.role,
          email: userByIdentyfier.email,
        },
      });
    } catch (error) {
      const err = error as unknown as Error;
      res.status(400).json({
        message: err.message,
        data: null,
      });
      response.error(res, error, 'login failed')
    }
  },

  async me(req: IReqUser, res: Response) {
    /**
     #swagger.tags = ['Auth']
     #swagger.security = [{
       "baererAuth": []
     }]
     */
    try {
      const user = req.user;
      const result = await UserModel.findById(user?.id);

      res.status(200).json({
        message: "Success get user profile",
        data: result,
      });
    } catch (error) {
      const err = error as unknown as Error;
      res.status(400).json({
        message: err.message,
        data: null,
      });
    }
  },
  async activation(req: Request, res: Response) {
    /**
     #swagger.tags = ['Auth']
     #swagger.requestBody = {
       required: true,
       schema: {
         $ref: "#/components/schemas/ActivationRequest"
       }
     }
     */
    try {
      const { code } = req.body as { code: string };

      const user = await UserModel.findOneAndUpdate(
        {
          activationCode: code,
        },
        {
          isActive: true,
        },
        {
          new: true,
        }
      );

      res.status(200).json({
        message: "user successfully activated",
        data: user,
      });
    } catch (error) {
      const err = error as unknown as Error;
      res.status(400).json({
        message: err.message,
        data: null,
      });
    }
  },
};
