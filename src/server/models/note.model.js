const mongoose = require("mongoose");
import {slugify} from "../utils/slugify";
const {toJSON, paginate} = require("./plugins");
const {privacy} = require("../config/note.config")

const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    slug: {
      type: String,
    },
    content: {
      type: String
    },
    privacy: {
      type: String,
      enum: privacy,
      default: 'onlyme'
    },
    searchDate: {
      type: Number
    }
  },
  {
    collection: 'notes',
    timestamps: true
  }
);

noteSchema.plugin(toJSON);
noteSchema.plugin(paginate);

/**
 * Slug generator
 * @param {string} noteTitle - The note's title
 * @returns {Promise<string>}
 */
noteSchema.statics.slugGenerator = async function (noteTitle) {
  let newSlug = slugify(noteTitle);
  let count = 0;
  while (await this.exists({slug: newSlug})) {
    newSlug = `${slugify(noteTitle)}_${++count}`;
  }
  return newSlug;
};

// will call before save method
noteSchema.pre("save", async function (next) {
  const note = this;
  if (note.isModified("title")) {
    note.slug = await Note.slugGenerator(note.title);
  }
  next();
});

/**
 * @typedef Note
 */
const Note = mongoose.models.Note || mongoose.model("Note", noteSchema);

module.exports = Note;
