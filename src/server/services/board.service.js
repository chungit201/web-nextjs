const {Board, Project} = require("../models");
const ApiError = require("../utils/api-error");
const httpStatus = require("http-status");

/**
 * @param {Object} filter
 * @return {Promise<Object>}
 */
const getBoards = async (filter) => {
  return Board.find(filter);
}

const createBoard = async (boardBody) => {
  if (await Project.countDocuments({_id: boardBody.project}) <= 0) {
    throw new ApiError(httpStatus.NOT_FOUND, "Project not found");
  }

  return Board.create(boardBody);
}

const updateBoard = async (boardId, boardBody) => {
  const board = await Board.findOne({_id: boardId});
  if (!board) {
    throw new ApiError(httpStatus.NOT_FOUND, "Board not found");
  }
  return Board.create(boardBody);
}

const deleteBoard = async (boardId) => {
  const board = await Board.findOne({_id: boardId});
  if (!board) {
    throw new ApiError(httpStatus.NOT_FOUND, "Board not found");
  }
  return Board.deleteOne({_id: boardId});
}


module.exports = {
  getBoards,
  createBoard,
  updateBoard,
  deleteBoard
}