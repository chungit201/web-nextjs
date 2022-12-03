const mongoose = require('mongoose');
const UserEvent = require("./user-event.model");
import {slugify} from "../utils/slugify";
const {paginate, toJSON} = require("./plugins");
const {group, state} = require("../config/event.config");

const eventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  slug: {
    type: String
  },
  description: {
    type: String
  },
  startDate: {
    type: String,
    required: true
  },
  endDate: {
    type: String
  },
  group: {
    type: String,
    enum: group.values,
    default: group.default,
  },
  state: {
    type: String,
    enum: state.values,
    default: state.default,
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
}, {
  collection: 'events',
  timestamps: true
});

eventSchema.plugin(paginate);
eventSchema.plugin(toJSON);

/**
 * Slug generator
 * @param {string} eventName - The event's name
 * @returns {Promise<string>}
 */
eventSchema.statics.slugGenerator = async function(eventName) {
  let newSlug = slugify(eventName);
  let count = 0;
  while (await this.exists({slug: newSlug})) {
    newSlug = `${slugify(eventName)}_${++count}`;
  }
  return newSlug;
};

eventSchema.pre('save', async function (next) {
  const event = this;
  if (event.isModified("name")) {
    event.slug = await Event.slugGenerator(event.name);
  }
  next();
});

// will call before remove method => cascading delete all event model references
eventSchema.pre("deleteOne", { document: true, query: false }, async function (next) {
  const event = this;
  await UserEvent.deleteMany({event: event._id});
  next();
});

/**
 * @typedef Event
 */
const Event =mongoose.models.Event || mongoose.model(
  "Event",
  eventSchema
);

module.exports = Event;