const catchAsync = require('../utils/catch-async');
const {expenseService} = require('../services');
const pick = require("../utils/pick");

const addExpense = catchAsync(async (req, res) => {
  let body = req.body;
  Object.assign(body, {creator: req.user._id});
  const expense = await expenseService.createExpense(body);
  res.json({
    message: `Created expense successfully`,
    expense: expense
  });
});

const getExpenses = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['title', 'type', 'creator', 'date', 'user']);
  if ((req.query['start'] || req.query['end']) && req.query['range']) {
    filter['queryRange'] = {
      field: req.query['range'],
      start: +req.query['start'] ?? null,
      end: +req.query['end'] ?? null,
    }
  }
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  if (!req.user.role.permissions.includes('MANAGE_ALL_EXPENSE')) filter['user'] = req.user.id;
  const results = await expenseService.queryExpenses(filter, options);
  res.json({results});
});

const getExpense = catchAsync(async (req, res) => {
  const result = await expenseService.getExpenseById(req.params.expenseId, req.user.role.permissions.includes('MANAGE_ALL_EXPENSE'), req.user._id);
  res.json(result);
});

const updateExpense = catchAsync(async (req, res) => {
  const expense = await expenseService.updateExpense(req.params.expenseId, req.body);
  res.send({
    message: `Updated expense successfully`,
    expense: expense
  });
});

const deleteExpense = catchAsync(async (req, res) => {
  const expense = await expenseService.deleteExpense(req.params.expenseId);
  res.send({
    message: "Deleted expense successfully",
    expense: expense
  })
});

module.exports = {
  addExpense,
  getExpense,
  getExpenses,
  updateExpense,
  deleteExpense
}
