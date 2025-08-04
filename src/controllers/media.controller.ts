import { IReqUser } from "../utils/interface";
import { Response } from "express";
import uploader from "../utils/uploader";

export default {
  async single(req: IReqUser, res: Response) {
    if (!req.file) {
      return res.status(400).json({
        data: null,
        message: "file is not axist",
      });
    }
    try {
      const result = await uploader.uploadSingle(
        req.file as Express.Multer.File
      );
      res.status(200).json({
        data: result,
        message: "succes upload a file",
      });
    } catch {
      res.status(500).json({
        data: null,
        message: "failed upload a file",
      });
    }
  },
  async multiple(req: IReqUser, res: Response) {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        data: null,
        message: "file are not axist",
      });
    }
    try {
      const result = await uploader.uploadMultiple(
        req.files as Express.Multer.File[]
      );
      res.status(200).json({
        data: result,
        message: "succes upload files",
      });
    } catch {
      res.status(500).json({
        data: null,
        message: "failed upload files",
      });
    }
  },
  async remove(req: IReqUser, res: Response) {
    try {
      const { fileUrl } = req.body as { fileUrl: string };
      const result = await uploader.remove(fileUrl);
      res.status(200).json({
        data: result,
        message: "succes remove a file",
      });
    } catch {
      res.status(500).json({
        data: null,
        message: "failed remove a file",
      });
    }
  },
};
