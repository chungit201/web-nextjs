const catchAsync = require("../utils/catch-async");
const {projectActivityService} = require("../services");
const pick = require("../utils/pick");

const getProjectActivities = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['type']);
  filter.project = req.params.projectId;
  const options = pick(req.query, ['sortBy', 'limit', 'page']);

  const projectActivities = await projectActivityService.getProjectActivities(filter, options);
  res.json(projectActivities);
});

const deleteProjectActivity = catchAsync(async (req, res) => {
  const projectActivity = await projectActivityService.deleteProjectActivity({_id: req.params.projectActivityId});

  res.json({
    message: "Deleted projectActivity successfully",
    projectActivity
  });
});

module.exports = {
  getProjectActivities,
  deleteProjectActivity
}
