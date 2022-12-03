const catchAsync = require("../utils/catch-async");
const {boardService} = require("../services");
const pick = require("../utils/pick");
const httpStatus = require("http-status");
const ApiError = require("../utils/api-error");

const getBoards = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'project']);
  const boards = boardService.getBoards(filter);

  res.json({
    boards
  });
});

const addBoard = catchAsync(async (req, res) => {
  const board = await boardService.createBoard(req.body);

  res.json({
    message: "Created board successfully",
    board
  });
});


const updateBoard = catchAsync(async (req, res) => {
  const board = await boardService.findOne({_id: req.params.boardId});

  if (!board) {
    throw new ApiError(httpStatus.NOT_FOUND, "Board not found");
  }

  Object.assign(board, req.body);
  await board.save();

  res.json({
    message: "Updated board successfully",
    board
  });
});

const deleteBoard = catchAsync(async (req, res) => {
  const board = await boardService.findOne({_id: req.params.boardId});

  if (!board) {
    throw new ApiError(httpStatus.NOT_FOUND, "Board not found");
  }

  await board.deleteOne();

  res.json({
    message: "Deleted board successfully",
    board
  });
});

module.exports = {
  getBoards,
  addBoard,
  updateBoard,
  deleteBoard
}
