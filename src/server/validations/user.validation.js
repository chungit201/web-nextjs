const Joi = require('joi');
const {password, ObjectId} = require("./custom.validations");

const addUser = {
  body: Joi.object().keys({
    username: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().custom(password).required(),
    fullName: Joi.string(),
    role: Joi.string(),
    gender: Joi.string(),
    phoneNumber: Joi.string(),
    dob: Joi.alternatives().try(Joi.number(), Joi.string()),
    address: Joi.string(),
    department: Joi.string().custom(ObjectId),
    identityNumber: Joi.string(),
    bankAccount: Joi.string(),
    bankNumber: Joi.string(),
    salary: Joi.string(),
    jobTitle: Joi.string,
    startedWorkingAt: Joi.alternatives().try(Joi.number(), Joi.string()),
    state: Joi.string(),
    typeOfWork: Joi.string(),
    isInternship: Joi.boolean(),
    telegramId: Joi.string(),
    avatar: Joi.any(),
    gitlabId: Joi.number(),
  })
};

const getUsers = {
  query: Joi.object().keys({
    username: Joi.string(),
    role: Joi.string(),
    department: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer()
  })
};

const getUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(ObjectId).required()
  })
};

const updateUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(ObjectId).required()
  }),
  body: Joi.object().keys({
    username: Joi.string(),
    email: Joi.string().email(),
    role: Joi.string(),
    fullName: Joi.string(),
    password: Joi.string().custom(password),
    phoneNumber: Joi.string(),
    dob: Joi.alternatives().try(Joi.number(), Joi.string()),
    gender: Joi.string(),
    address: Joi.string(),
    identityNumber: Joi.string(),
    department: Joi.string().custom(ObjectId),
    bankAccount: Joi.string(),
    bankNumber: Joi.string(),
    salary: Joi.string(),
    jobTitle: Joi.string,
    startedWorkingAt: Joi.alternatives().try(Joi.number(), Joi.string()),
    state: Joi.string(),
    typeOfWork: Joi.string(),
    isInternship: Joi.alternatives().try(Joi.boolean(), Joi.string()),
    telegramId: Joi.string(),
    avatar: Joi.any(),
    cardId: Joi.string(),
    gitlabId: Joi.number(),
  })
};

// extends current Joi object
const updateSelfProfileBody = updateUser.body.keys({currentPassword: Joi.string()})
const updateSelfProfile = {
  body: updateSelfProfileBody
};

const deleteUser = {
  params: getUser.params
}

const getProjects = {
  params: getUser.params,
  query: Joi.object().keys({
    name: Joi.string(),
    state: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer()
  })
}

const getSelfProjects = {
  query: getProjects.query
}

const getTasks = {
  params: getUser.params,
  query: getProjects.query
}

const getSelfTasks = {
  query: getProjects.query
}

module.exports = {
  addUser,
  getUsers,
  getUser,
  updateUser,
  updateSelfProfile,
  deleteUser,
  getProjects,
  getSelfProjects,
  getTasks,
  getSelfTasks
}