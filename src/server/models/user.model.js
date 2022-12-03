const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const {toJSON, paginate} = require("./plugins");
const {gender, state, typeOfWork, department} = require("../config/user-info.config");
const {default: defaultURL} = require("../config/upload.config");
const fs = require('fs');
const path = require('path');
const Token = require("./token.model");
const UserTask = require("./user-task.model");
const UserProject = require("./user-project.model");
const Role = require("./role.model");
const Post = require("./post.model");
const Comment = require("./comment.model");
const gravatar = require("gravatar");
const ApiError = require("server/utils/api-error");
const httpStatus = require("http-status");

const userSchema = new mongoose.Schema({
  // personal info
  username: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    lowercase: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Invalid email");
      }
    }
  },
  internalEmail: {
    type: String,
    unique: true,
    trim: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Invalid email");
      }
    }
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minlength: 8,
    validate(value) {
      if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
        throw new Error("Password must contain at least one letter and one number");
      }
    },
    private: true // used by the toJSON plugin
  },
  role: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Role",
  },
  isEmailVerified: {
    type: Boolean,
    default: false,
    private: true
  },
  facebookId: {
    type: String,
    private: true,
    trim: true
  },
  fullName: {
    type: String,
  },
  phoneNumber: {
    type: String,
    trim: true
  },
  dob: {
    type: String
  },
  address: {
    type: String,
    trim: true
  },
  gender: {
    type: String
  },
  identityNumber: {
    type: String,
    trim: true
  },
  bankAccount: {
    type: String,
    trim: true
  },
  bankNumber: {
    type: String,
    trim: true
  },
  salary: {
    type: String,
    trim: true
  },

  jobTitle: {
    type: String,
    default: "unassigned"
  },
  startedWorkingAt: {
    type: String,
  },
  state: {
    type: String,
    enum: state,
    default: "unassigned"
  },
  typeOfWork: {
    type: String,
    enum: typeOfWork,
    default: "unassigned"
  },
  isInternship: {
    type: Boolean,
    default: false,
  },
  telegramId: {
    type: String
  },
  avatar: {
    type: String,
    default: "unassigned"
  },
  deviceToken: {
    type: String,
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Department"
  },
  cardId: {
    type: String
  },
  gitlabId: {
    type: Number
  },
  deleted: {
    type: Boolean,
    default: false,
  },
  wakaTimeId: String,
  wakaTimeToken: String,
  wakaTimeRefreshToken: String
}, {
  collection: 'users',
  timestamps: true
});

userSchema.virtual('projects', {
  ref: 'UserProject',
  localField: '_id',
  foreignField: 'author',
  justOne: true
})

userSchema.plugin(toJSON);
userSchema.plugin(paginate);

/**
 * Check if email is taken
 * @param {string} username - The user's username
 * @param {string} email - The user's email
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
userSchema.statics.isUsernameOrEmailTaken = async function (username, email, excludeUserId) {
  const user = await this.findOne({$or: [{username}, {email}], _id: {$ne: excludeUserId}});
  return !!user;
};

userSchema.statics.isFieldTaken = async function (filter, excludeUserId) {
  const user = await this.findOne({...filter, _id: {$ne: excludeUserId}});
  return !!user;
};

userSchema.statics.handleRole = async function (data) {
  const {_id: role} = await Role.findOne((mongoose.isValidObjectId(data) ? {_id: data} : {$or: [{slug: data}, {name: data}]}));
  if (!role) throw new ApiError(httpStatus.NOT_FOUND, "Role not found");
  return role;
};

/**
 * Check if password matches the user's password
 * @param {string} password
 * @returns {Promise<boolean>}
 */
userSchema.methods.isPasswordMatch = async function (password) {
  const user = this;
  return bcrypt.compareSync(password, user.password);
};

/**
 * Convert role's name to ObjectId
 * @param {string} role
 * @returns {Promise<ObjectId>}nst db = require("./app/models");
 */
userSchema.statics.convertRole = async function (role) {
  return (await Role.findOne({name: role}))._id;
};

// will call before save method => check if password is modified, then hash it
userSchema.pre("save", async function (next) {
  const user = this;
  if (!user.role) {
    user.role = (await Role.findOne({name: "user"}))._id
  }
  if (user.isModified("password")) user.password = bcrypt.hashSync(user.password, 8);
  if (user.isModified("gender") && gender.hasOwnProperty(this.gender)) user.gender = gender[this.gender];
  // if (user.isModified("email")) user.avatar = gravatar.url(this.email, {protocol: 'https', size: 200, d: "mp"});
  if (user.isModified("username")) {
    user.username = this.username.replace(/\s/g, "");
    user.internalEmail = user.username + "@northstudio.vn";
  }
  if (!user.fullName) user.fullName = this.username;
  next();
});

// will call before remove method => cascading delete all user model references
userSchema.pre("deleteOne", {document: true, query: false}, async function (next) {
  const user = this;
  if (user.avatar) {
    let avatarPath = path.join(__dirname, '../public', user.avatar.substring(1));
    if (fs.existsSync(avatarPath)) fs.promises.unlink(avatarPath).catch(err => console.log(err));
  }
  await Token.deleteMany({user: user._id});
  await UserTask.deleteMany({user: user._id});
  await UserProject.deleteMany({user: user._id});
  await Post.deleteMany({user: user._id});
  await Comment.deleteMany({user: user._id});
  next();
});

/**
 * @typedef User
 */
const User = mongoose.models.User || mongoose.model("User", userSchema);

module.exports = User;
