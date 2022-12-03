const mongoose = require('mongoose');
import {slugify} from "../utils/slugify";

const {paginate, toJSON} = require("./plugins");
const fs = require('fs');
const path = require('path');
const Comment = require("./comment.model");
const Notification = require("./notification.model");

const postSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  slug: {
    type: String
  },
  content: {
    type: String,
    required: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  privacy: {
    type: String,
    default: "public",
    enum: ["public", "private"]
  },
  file: {
    type: String
  }
}, {
  collection: 'posts',
  timestamps: true
});

/**
 * Slug generator
 * @param {string} postName - The post's name
 * @returns {Promise<string>}
 */
postSchema.statics.slugGenerator = async function (postName) {
  let newSlug = slugify(postName);
  let count = 0;
  while (await this.exists({slug: newSlug})) {
    newSlug = `${slugify(postName)}_${++count}`;
  }
  return newSlug;
};

postSchema.pre('save', async function (next) {
  const post = this;
  if (post.isModified("name")) {
    post.slug = await Post.slugGenerator(post.name);
  }
  if (post.isModified("file")) {
    let original = await Post.findOne({_id: post._id});
    if (original.file) {
      let filePath = path.join(__dirname, '../public', original.file.substring(1));
      if (fs.existsSync(filePath)) fs.promises.unlink(filePath).catch(err => console.log(err));
    }
  }
  next();
});

// will call before remove method => cascading delete all post model references
postSchema.pre("deleteOne", {document: true, query: false}, async function (next) {
  const post = this;
  if (post.file) {
    let filePath = path.join(__dirname, '../public', post.file.substring(1));
    if (fs.existsSync(filePath)) fs.promises.unlink(filePath).catch(err => console.log(err));
  }
  await Comment.deleteMany({post: post._id});

  if (await Notification.find({type: "post"})) {
    await Notification.deleteMany({notificationBy: post._id})
  }
  next();
});

postSchema.plugin(paginate);
postSchema.plugin(toJSON);

/**
 * @typedef Post
 */
const Post = mongoose.models.Post || mongoose.model(
  "Post",
  postSchema
);

module.exports = Post;