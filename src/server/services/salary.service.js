
const httpStatus = require("http-status");
const ApiError = require("../utils/api-error");
const {Salary} = require("../models");

const createSalary = async (body) => {
  const createdSalary = await Salary.create(body);
  let salary = await Salary.findOne(createdSalary).populate('user department');
  salary = {
    ...salary._doc,
    createdAt: new Date(salary.createdAt).getTime(),
  };

  return salary;
};

const querySalary = async (filter, options) => {
  Object.assign(options, {
    populate: 'user',
    filter: {
      user: {
        select: '_id username email fullName avatar department',
        populate: {
          path: "department",
          model: "Department"
        }
      }
    }
  });
  return Salary.paginate(filter, options);
}

const getSalaryById = async (salaryId) => {
  let salary = await Salary.findOne({_id: salaryId}).populate('user');
  if (!salary) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Salary not found');
  }
  return salary;
};


const updateSalary = async (salaryId, salaryBody) => {
  let salary = await Salary.findOne({_id: salaryId});
  if (!salary) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Salary not found');
  }
  Object.assign(salary, salaryBody);
  salary.save();
  return salary;
}

const deleteSalary = async (salaryId) => {
  let salary = await Salary.findOne({_id: salaryId});
  if (!salary) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Salary not found');
  }
  await salary.deleteOne();
  return salary;
}

module.exports = {
  createSalary,
  querySalary,
  getSalaryById,
  updateSalary,
  deleteSalary,
}