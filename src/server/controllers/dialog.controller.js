const catchAsync = require('../utils/catch-async');
const pick = require("../utils/pick");
const {dialogService} = require("../services");

const addDialog = catchAsync(async(req,res)=>{
  const dialog = await dialogService.createDialog(req.body);
  res.json({
    info: "Create dialog successFully",
    dialog
  })
})

const getDialogs = catchAsync(async (req,res)=>{
  const filter = pick(req.query, ['user']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const dialog = await dialogService.queryDialog(filter,options);
  res.json(dialog)
});

const getDialog = catchAsync(async (req,res)=>{
  const dialog = await dialogService.dialogById(req.params.dialogId);
  res.json (dialog)
})

const removeDialog = catchAsync(async (req,res)=>{
  const dialog = await dialogService.deleteDialog(req.params.messageId);
  res.json({
    message: "Delete notification successFully",
    dialogDelete: dialog
  });
});

module.exports = {
  addDialog,
  getDialogs,
  removeDialog,
  getDialog
}