const catchAsync = require("../utils/catch-async");
const {ReactionService} = require("../services");

const handleReaction = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const reaction = await ReactionService.handleReaction(userId, req.body);
  res.json(reaction);
});

module.exports = {
  handleReaction
}