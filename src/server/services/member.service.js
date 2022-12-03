const httpStatus = require("http-status");
const ApiError = require("../utils/api-error");
const {Member} = require("../models");

const createMember = async (memberBody) => {
  return Member.create(memberBody);
}

const queryMember = async (filter, options) => {
  Object.assign(options, {
    populate: 'user,dialog',
    filter: {
      user: {
        select: '_id username email fullName'
      },
    }
  });
  return Member.paginate(filter, options);
}

const memberById = async (memberId) => {
  const member = Member.findOne({_id: memberId});
  if (!member) {
    throw new ApiError(httpStatus.NOT_FOUND, 'member not found');
  }
  return member;
}

const updateMember = async (memberId, updateBody) => {
  const member = await Member.findOne({_id: memberBody});
  if (!member) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Member not found');
  }
  Object.assign(member, updateBody);
  await member.save();
  return member;
}

const deleteMember = async (memberId) => {
  let member = await Member.findOne({_id: memberId});
  if (!memberId) {
    throw new ApiError(httpStatus.NOT_FOUND, 'MemberId not found');
  }
  await Member.deleteOne();
  return member;
}

module.exports = {
  createMember,
  queryMember,
  memberById,
  updateMember,
  deleteMember
}
