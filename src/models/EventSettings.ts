import { Schema, model, models } from "mongoose";
import { EVENT_NAME } from "../types/domain";

const EventSettingsSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, default: EVENT_NAME },
    tagline: { type: String, required: true, trim: true, default: "Player registration" },
    logoPath: { type: String, required: true, trim: true, default: "/logo.png" },
    logo: {
      data: { type: Buffer, default: null },
      contentType: { type: String, default: "" }
    },
    defaultPurse: { type: Number, required: true, min: 0, default: 10000 },
    singletonKey: { type: String, required: true, unique: true, default: "active-event" }
  },
  { timestamps: true }
);

export const EventSettings =
  models.EventSettings || model("EventSettings", EventSettingsSchema);
