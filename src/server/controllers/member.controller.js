const catchAsync = require('../utils/catch-async');
const pick = require("../utils/pick");
const {memberService} = require("../services");

const addMember = catchAsync(async (req, res) => {
  const member = await memberService.createMember(req.body);
  res.json({
    info: "Create member successFully",
    member: member
  })
})

const getMembers = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['user','dialog']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const members = await memberService.queryMember(filter, options);
  res.json(members)
});

const getMember = catchAsync(async (req, res) => {
  const member = await memberService.memberById(req.params.memberId);
  res.json(member);
})

const updateMember = catchAsync(async (req, res) => {
  const member = await memberService.updateMember(req.params.memberId, req.body);
  res.send({
    message: 'Updated member successfully',
    member: member
  });
});

const removeMember = catchAsync(async (req, res) => {
  const member = await memberService.deleteMember(req.params.memberId);
  res.json({
    message: "Delete member successFully",
    memberDelete: member
  });
});

module.exports = {
  addMember,
  getMembers,
  getMember,
  updateMember,
  removeMember
}
