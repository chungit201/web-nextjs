const httpStatus = require('http-status')
const {Expense, User} = require('../models');
const ApiError = require("../utils/api-error");

/**
 * Create new Expense
 * @param {Object} expenseBody - Expense's object body
 * @return {Promise}
 */
const createExpense = async (expenseBody) => {
  if (await User.countDocuments({_id: expenseBody.user}) <= 0) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found")
  }
  return Expense.create(expenseBody);
}

/**
 * Query expenses
 * @param {Object} filter - Filter for find
 * @param {Object} options - Pagination options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryExpenses = async (filter, options) => {
  Object.assign(options, {populate: 'user', filter: {user: {select: "username fullName avatar email internalEmail"}}});
  return Expense.paginate(filter, options);
}

/**
 * Get expense by id
 * @param {ObjectId} id - Id for finding
 * @param {boolean} isManager
 * @param {ObjectId} userId
 * @returns {Object}
 */
const getExpenseById = async (id, isManager, userId) => {
  let expense = await Expense.findById(id).populate('user').lean();
  if (!expense) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Expense not found');
  }
  if (!isManager && expense.user._id !== userId) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Expense not found');
  }
  return expense;
}


/**
 * Update expense
 * @param {ObjectId} expenseId
 * @param {Object} updateBody
 * @return {Promise<Expense>}
 */
const updateExpense = async (expenseId, updateBody) => {
  const expense = await Expense.findOne({_id: expenseId});
  if (!expense) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Expense not found');
  }

  if (updateBody.date && (new Date(updateBody.date)).getTime() < 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid date');
  }
  Object.assign(expense, updateBody);
  await expense.save();
  return expense;
};

/**
 * Delete expense
 * @param {ObjectId} expenseId
 * @return {Promise<Expense>}
 */
const deleteExpense = async (expenseId) => {
  const expense = await Expense.findOne({_id: expenseId});
  if (!expense) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Expense not found');
  }

  await expense.deleteOne();
  return expense;
}

module.exports = {
  createExpense,
  queryExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
}
