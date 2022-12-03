const catchAsync = require("../utils/catch-async");
const pick = require("../utils/pick");
const {salaryService} = require("../services");

const addSalary = catchAsync(async(req,res)=>{
  const salary = await salaryService.createSalary(req.body);
  res.json({
    message: "Create salary successFully",
    salary: salary
  })
})

const getSalaries = catchAsync(async (req,res)=>{
  const filter = pick(req.query, ['user', 'department']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const salary = await salaryService.querySalary(filter,options);
  res.json(salary)
});


const getSalary = catchAsync(async (req,res)=>{
  const salary = await salaryService.getSalaryById(req.query.salaryId);
  res.json(salary);
});

const editSalary = catchAsync(async(req,res)=>{
  const salary = await salaryService.updateSalary(req.query.salaryId, req.body);
  res.json({
    message: "update salary successfully",
    salary: salary,
  })
})
const removeSalary = catchAsync(async (req,res)=>{
  const salary = await salaryService.deleteSalary(req.params.salaryId);
  res.json({
    message: "Delete salary successFully",
    salary: salary
  });
});

module.exports = {
  addSalary,
  getSalaries,
  getSalary,
  editSalary,
  removeSalary,
}

