import { Response } from "express";
import { IPaginationQuery, IReqUser } from "../utils/interface";
import response from "../utils/response";
import CategoryModel, { categoryDAO } from "../models/category.model";

export default {
  async create(req: IReqUser, res: Response) {
    try {
      await categoryDAO.validate(req.body);
      const result = await CategoryModel.create(req.body);
      response.succes(res, result, "Success created category");
      console.log(result)
    } catch (error) {
      response.error(res, error, "failed created a category");
    }
  },

  async findAll(req: IReqUser, res: Response) {
    const {
      page = 1,
      limit = 10,
      search,
    } = req.query as unknown as IPaginationQuery;
    try {
      const query = {};

      if (search) {
        Object.assign(query, {
          $or: [
            {
              name: { $regex: search, $options: "i" },
            },
            {
              description: { $regex: search, $options: "i" },
            },
          ],
        });
      }

      const result = await CategoryModel.find(query)
        .limit(limit)
        .skip((page - 1) * limit)
        .sort({ createAt: -1 })
        .exec();

        console.log(result)

      const count = await CategoryModel.countDocuments(query)

      response.pagination(res, result, {
        total: count,
        totalPages: Math.ceil(count/limit),
        current: page
      }, 'Success find all category')
    } catch (error) {
      response.error(res, error, "failed find all category");
    }
  },
  async findOne(req: IReqUser, res: Response) {
    try {
        const { id } = req.params
        const result = await CategoryModel.findById(id)
        response.succes(res, result, 'Success find one category')
    } catch (error) {
      response.error(res, error, "failed find one a category");
    }
  },
  async update(req: IReqUser, res: Response) {
    try {
        const { id } = req.params
        const result = await CategoryModel.findByIdAndUpdate(id, req.body, { new: true})
        response.succes(res, result, 'success update category')
    } catch (error) {
      response.error(res, error, "failed update a category");
    }
  },
  async remove(req: IReqUser, res: Response) {
    try {
        const { id } = req.params
        const result = await CategoryModel.findByIdAndDelete(id)
        response.succes(res, result, 'success remove category')
    } catch (error) {
      response.error(res, error, "failed remove a category");
    }
  },
};
