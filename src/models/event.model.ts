import mongoose, { ObjectId } from "mongoose";
import * as Yup from "yup";

const Schema = mongoose.Schema;

export const eventDAO = Yup.object({
  name: Yup.string().required(),
  startDate: Yup.string().required(),
  endDate: Yup.string().required(),
  description: Yup.string().required(),
  banner: Yup.string().required(),
  isFeatured: Yup.boolean().required(),
  isOnline: Yup.boolean().required(),
  isPublish: Yup.boolean(),
  category: Yup.string().required(),
  slug: Yup.string(),
  createdBy: Yup.string().required(),
  createdAt: Yup.string(),
  updateAt: Yup.string(),
  location: Yup.object().required(),
});

export type TEvent = Yup.InferType<typeof eventDAO>;

export interface Event extends Omit<TEvent, "category" | "createdBy"> {
  category: ObjectId;
  createdBy: ObjectId;
}

const EventSchema = new Schema<Event>(
  {
    name: {
      type: Schema.Types.String,
      require: true,
    },
    startDate: {
      type: Schema.Types.String,
      require: true,
    },
    endDate: {
      type: Schema.Types.String,
      require: true,
    },
    description: {
      type: Schema.Types.String,
      require: true,
    },
    banner: {
      type: Schema.Types.String,
      require: true,
    },
    isFeatured: {
      type: Schema.Types.Boolean,
      require: true,
    },
    isOnline: {
      type: Schema.Types.Boolean,
      require: true,
    },
    isPublish: {
      type: Schema.Types.Boolean,
    },
    category: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Category",
    },
    slug: {
      type: Schema.Types.String,
      unique: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      require: true,
      ref: "User",
    },
    location: {
      type: {
        region: {
          type: Schema.Types.Number
        },
        coordinates: {
          type: [Schema.Types.Number],
          default: [0, 0],
        },
      },
    },
  },
  {
    timestamps: true,
  }
);

EventSchema.index({
  name: 'text',
  description: 'text'
});

EventSchema.pre('save', function () {
    if (!this.slug) {
        const slug = this.name.split(' ').join('-').toLowerCase()
        this.slug= slug
    }
})

const EventModel = mongoose.model('Event', EventSchema)

export default EventModel