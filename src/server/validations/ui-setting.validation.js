const Joi = require('joi');
const {ObjectId} = require("./custom.validations");

const createUISetting = {
  body: Joi.object().keys({
    navCollapsed: Joi.boolean(),
    sideNavTheme: Joi.string().empty(''),
    locale: Joi.string().empty(''),
    navType: Joi.boolean(),
    topNavColor: Joi.string().empty(''),
    headerNavColor: Joi.string().empty(''),
    mobileNav: Joi.boolean(),
    currentTheme: Joi.string().empty(''),
    direction: Joi.string().empty(''),
  })
};

const getUISettings = {
  query: Joi.object().keys({
    owner: Joi.string().custom(ObjectId),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer()
  })
};

const getUISettingById = {
  params: Joi.object().keys({
    uiSettingId: Joi.string().custom(ObjectId).required()
  })
};

const getUISettingByOwner = {
  /*params: Joi.object().keys({
    userId: Joi.string().custom(ObjectId).required()
  })*/
};

const updateUISettingById = {
  params: Joi.object().keys({
    uiSettingId: Joi.string().custom(ObjectId).required()
  }),
  body: Joi.object().keys({
    navCollapsed: Joi.boolean(),
    sideNavTheme: Joi.string(),
    locale: Joi.string(),
    navType: Joi.boolean(),
    topNavColor: Joi.string(),
    headerNavColor: Joi.string(),
    mobileNav: Joi.boolean(),
    currentTheme: Joi.string(),
    direction: Joi.string(),
  })
};

const updateUISettingByOwner = {
  /*params: Joi.object().keys({
    userId: Joi.string().custom(ObjectId).required()
  }),*/
  body: Joi.object().keys({
    navCollapsed: Joi.boolean(),
    sideNavTheme: Joi.string().empty(''),
    locale: Joi.string().empty(''),
    navType: Joi.boolean(),
    topNavColor: Joi.string().empty(''),
    headerNavColor: Joi.string().empty(''),
    mobileNav: Joi.boolean(),
    currentTheme: Joi.string().empty(''),
    direction: Joi.string().empty(''),
  })
};

const deleteUISetting = {
  params: Joi.object().keys({
    uiSettingId: Joi.string().custom(ObjectId).required()
  })
};

module.exports = {
  createUISetting,
  getUISettings,
  getUISettingById,
  getUISettingByOwner,
  updateUISettingByOwner,
  updateUISettingById,
  //deleteUISetting,
}