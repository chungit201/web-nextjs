import pick from "../utils/pick";
import {departmentService} from "../services";
import {slugify} from "server/utils/slugify";

export const addDepartment = async (req, res) => {
  const department = await departmentService.createDepartment(req.body);
  res.json({
    message: "Create department successFully",
    department
  })
};

export const getDepartments = async (req, res) => {
  const filter = pick(req.query, ['name']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const departments = await departmentService.queryDepartment(filter, options);
  res.json(departments)
};

export const removeDepartment = async (req, res) => {
  const dialog = await departmentService.deleteDepartment(req.query.departmentId);
  res.json({
    message: "Delete department successfully",
    department: dialog
  });
};