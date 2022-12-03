const {PROJECT_TYPES} = require("common/configs/ProjectConfig");
module.exports = {
  departments: {
    values: ['development', 'human-resource', 'content-writer', 'tester'],
  },
  types: {
    values: [...PROJECT_TYPES.map(t => t.name),],
    exceptions: ['reactjs']
  },
  state: {
    values: ['ongoing', 'finished', 'pending', 'due', 'approved'],
    default: 'pending'
  },
  roles: {
    values: ["maintainer", "member"],
    default: "member"
  },
  activities: {
    values: ["gitlabRecord", "other"],
    default: "gitlabRecord"
  }
}
