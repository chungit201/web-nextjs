module.exports = {
  departments: {
    value: ['individual', 'developer', 'human-resource', 'content-writer', 'tester'],
    default: "individual"
  },
  types: {
    value: ['absent', 'late', 'request', 'other'],
    default: "other"
  },
  state: {
    value: ["pending", "in-progress", "resolved", "rejected"],
    default: "pending"
  },
  placeholder: {
    value: ["[inbox]", "sent", "[archived]"],
    default: "pending"
  },
  approval: {
    value: ["pending", "resolved", "rejected"],
    default: "pending"
  }
}