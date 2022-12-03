module.exports = {
  group: {
    values: ['individual', 'company', 'development', 'human resource', 'content writer'],
    default: 'individual',
  },
  state: {
    values: ['pending', 'approved'],
    default: 'pending',
  },
  roles: {
    values: ['leader', 'member'],
    default: 'member',
  }
}