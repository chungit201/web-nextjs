const mongoose = require('mongoose');
import {slugify} from "../utils/slugify";
const { paginate, toJSON } = require("./plugins");

const uiSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  navCollapsed: {
    type: Boolean,
    default: false,
  },
  sideNavTheme: {
    type: String,
  },
  locale: {
    type: String,
    default: 'en',
  },
  navType: {
    type: Boolean,
    default: false,
  },
  topNavColor: {
    type: String,
  },
  headerNavColor: {
    type: String,
  },
  mobileNav: {
    type: Boolean,
    default: false,
  },
  currentTheme: {
    type: String,
  },
  direction: {
    type: String,
  },
}, {
  collection: 'uisettings',
  timestamps: true
});

uiSchema.pre('save', async function (next) {
  const ui = this;

  next();
});

uiSchema.plugin(paginate);
uiSchema.plugin(toJSON);

/**
 * @typedef Role
 */
const UISetting =mongoose.models.UISetting || mongoose.model(
  "UISetting",
  uiSchema
)

module.exports = UISetting;