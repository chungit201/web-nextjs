const httpStatus = require("http-status");
const ApiError = require("../utils/api-error");
const {Dialog} = require("../models");

const createDialog = async (dialogBody) => {
  return Dialog.create(dialogBody);
}

const queryDialog = async (filter, options) => {
  Object.assign(options, {
    populate: 'user',
    filter: {
      user: {
        select: '_id username email fullName'
      }
    }
  });
  return Dialog.paginate(filter, options);
}

const dialogById = async (dialogId) =>{
  const dialog = Dialog.findOne({_id: dialogId});
  if(!dialog){
    throw new ApiError(httpStatus.NOT_FOUND, "Dialog not found");
  }
  return dialog;
}

const deleteDialog = async (dialogId) => {
  let dialog = await Dialog.findOne({_id: dialogId});
  if (!dialog) {
    throw new ApiError(httpStatus.NOT_FOUND, 'dialog not found');
  }
  await Dialog.deleteOne();
  return dialog;
}

module.exports = {
  createDialog,
  queryDialog,
  deleteDialog,
  dialogById,
}
