import { Response } from "express";
import { IPaginationQuery, IReqUser } from "../utils/interface";
import response from "../utils/response";
import EventModel, { eventDAO, TEvent } from "../models/event.model";
import { FilterQuery } from "mongoose";

export default {
  async create(req: IReqUser, res: Response) {
    try {
      const payload = { ...req.body, createdBy: req.user?.id } as TEvent;
      await eventDAO.validate(payload);
      const result = await EventModel.create(payload);
      response.succes(res, result, "success created an event");
    } catch (error) {
      response.error(res, error, "failed created an event");
    }
  },
  async findAll(req: IReqUser, res: Response) {
    try {
      const {
        page = 1,
        limit = 10,
        search,
      } = req.query as unknown as IPaginationQuery;

      const query: FilterQuery<TEvent> = {};

      if (search) {
        Object.assign(query, {
          $text: {
            $search: search,
          },
        });
      }

      const result = await EventModel.find(query)
        .limit(limit)
        .skip((page - 1) * limit)
        .sort({ createdAt: -1 })
        .exec();

      const count = await EventModel.countDocuments(query);

      response.pagination(
        res,
        result,
        {
          current: page,
          total: count,
          totalPages: Math.ceil(count / limit),
        },
        "success find all event"
      );
    } catch (error) {
      response.error(res, error, "failed find all event");
    }
  },
  async findOne(req: IReqUser, res: Response) {
    try {
      const { id } = req.params;
      const result = await EventModel.findById(id);
      response.succes(res, result, "success find one an event");
    } catch (error) {
      response.error(res, error, "failed find one event");
    }
  },
  async update(req: IReqUser, res: Response) {
      try {
        const { id } = req.params;
      const result = await EventModel.findByIdAndUpdate(id, req.body, { new: true });
      response.succes(res, result, "success update an event");
    } catch (error) {
      response.error(res, error, "failed update an event");
    }
  },
  async remove(req: IReqUser, res: Response) {
    try {
      const { id } = req.params;
      const result = await EventModel.findByIdAndDelete(id, { new: true });
      response.succes(res, result, "success delete an event");
    } catch (error) {
      response.error(res, error, "failed delete an event");
    }
  },
  async findOneBySlug(req: IReqUser, res: Response) {
    try {
      const { slug } = req.params;
      const result = await EventModel.findOne({slug});
      response.succes(res, result, "success find one by slug an event");
    } catch (error) {
      response.error(res, error, "failed find one by slug an event");
    }
  },
};
