const Joi = require('joi');
const {ObjectId} = require("./custom.validations");

const createExpense = {
  body: Joi.object().keys({
    title: Joi.string().required(),
    description: Joi.string(),
    note: Joi.string(),
    date: Joi.string(),
    type: Joi.string().required(),
    user: Joi.string().custom(ObjectId).required(),
    actualAmount: Joi.number().required(),
    expectedAmount: Joi.number(),
  })
};

const getExpenses = {
  query: Joi.object().keys({
    title: Joi.string(),
    type: Joi.string(),
    user: Joi.string().custom(ObjectId),
    creator: Joi.string().custom(ObjectId),
    start: Joi.string(),
    end: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer()
  })
};

const getExpense = {
  params: Joi.object().keys({
    expenseId: Joi.string().custom(ObjectId).required()
  })
};

const updateExpense = {
  params: Joi.object().keys({
    expenseId: Joi.string().custom(ObjectId).required()
  }),
  body: Joi.object().keys({
    title: Joi.string(),
    description: Joi.string(),
    note: Joi.string(),
    date: Joi.string(),
    type: Joi.string(),
    actualAmount: Joi.number(),
    expectedAmount: Joi.number(),
  })
};

const deleteExpense = {
  params: Joi.object().keys({
    expenseId: Joi.string().custom(ObjectId).required()
  })
};


module.exports = {
  createExpense,
  getExpenses,
  getExpense,
  updateExpense,
  deleteExpense,
}