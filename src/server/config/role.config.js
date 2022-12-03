const authorities = {
  user: [],
  manager: [
    'GET_ALL_PROJECT',
    'MANAGE_ALL_PROJECT',
    'GET_ALL_PROJECT',
    'MANAGE_ALL_TASK',
    'GET_ALL_COMMENT',
    'MANAGE_ALL_COMMENT',
    'MANAGE_ALL_NOTE',
    'GET_ALL_SAMPLE_FORM',
    'MANAGE_ALL_SAMPLE_FORM',
    'GET_ALL_FORM',
    'MANAGE_ALL_FORM',
    'SUBMIT_FORM',
    'MANAGE_ALL_POST',
    'MANAGE_ALL_EVENT',
  ],
  admin: [
    'MANAGE_ALL_USER',
    'MANAGE_ALL_PROJECT',
    'MANAGE_ALL_ROLE',
    'MANAGE_ALL_TASK',
    'MANAGE_ALL_POST',
    'MANAGE_ALL_COMMENT',
    'MANAGE_ALL_NOTE',
    'MANAGE_ALL_SAMPLE_FORM',
    'MANAGE_ALL_FORM',
    'MANAGE_ALL_REPORT',
    'MANAGE_ALL_EVENT',
    'MANAGE_ALL_ISSUE',
    'MANAGE_ALL_REQUEST',
    'MANAGE_ALL_DEPARTMENT',
    'MANAGE_ALL_SALARY',
  ]
}

const roleConfig = Object.keys(authorities);

const PERMISSIONS = new Map(Object.entries(authorities));

const permissions = [
  // user permission
  'MANAGE_ALL_USER',
  'GET_ALL_USER',
  'ADD_ALL_USER',
  'UPDATE_ALL_USER',
  'DELETE_ALL_USER',

  // project permission
  'MANAGE_ALL_PROJECT',
  'GET_ALL_PROJECT',
  'ADD_ALL_PROJECT',
  'UPDATE_ALL_PROJECT',
  'DELETE_ALL_PROJECT',

  // role permission
  'MANAGE_ALL_ROLE',
  'GET_ALL_ROLE',
  'ADD_ALL_ROLE',
  'UPDATE_ALL_ROLE',
  'DELETE_ALL_ROLE',

  // task permission
  'MANAGE_ALL_TASK',
  'EDIT_COMMENT',
  'GET_ALL_MEMBER',

  // post permission
  'MANAGE_ALL_POST',
  'GET_ALL_POST',
  'ADD_ALL_POST',
  'UPDATE_ALL_POST',
  'DELETE_ALL_POST',

  // comment permission
  'MANAGE_ALL_COMMENT',
  'GET_ALL_COMMENT',
  'ADD_ALL_COMMENT',
  'UPDATE_ALL_COMMENT',
  'DELETE_ALL_COMMENT',

  //note permission
  'MANAGE_ALL_NOTE',
  'ADD_ALL_NOTE',
  'UPDATE_ALL_NOTE',
  'DELETE_ALL_NOTE',

  // sample form permission
  'MANAGE_ALL_SAMPLE_FORM',
  'GET_ALL_SAMPLE_FORM',

  //form permission
  'MANAGE_ALL_FORM',
  'GET_ALL_FORM',
  'SUBMIT_FORM',

  //report permission
  'MANAGE_ALL_REPORT',
  'GET_ALL_REPORT',
  'ADD_ALL_REPORT',
  'UPDATE_ALL_REPORT',
  'UPDATE_SAMPLE_REPORT',
  'DELETE_ALL_REPORT',

  //event permission
  'MANAGE_ALL_EVENT',
  'GET_ALL_EVENT',
  'ADD_ALL_EVENT',
  'UPDATE_ALL_EVENT',
  'DELETE_ALL_EVENT',

  //issue permission
  'MANAGE_ALL_ISSUE',
  'GET_ALL_ISSUE',
  'ADD_ALL_ISSUE',
  'UPDATE_ALL_ISSUE',
  'DELETE_ALL_ISSUE',

  //request permission
  'MANAGE_ALL_REQUEST',
  'GET_ALL_REQUEST',
  'ADD_ALL_REQUEST',
  'UPDATE_ALL_REQUEST',
  'DELETE_ALL_REQUEST',

  // project permission
  'MANAGE_ALL_DEPARTMENT',
  'GET_ALL_DEPARTMENT',
  'ADD_ALL_DEPARTMENT',
  'UPDATE_ALL_DEPARTMENT',
  'DELETE_ALL_DEPARTMENT',

  // salary permission
  'MANAGE_ALL_SALARY',
  'GET_ALL_SALARY',
  'ADD_ALL_SALARY',
  'UPDATE_ALL_SALARY',
  'DELETE_ALL_SALARY',
]

module.exports = {
  ROLES: roleConfig,
  PERMISSIONS,
  authorities,
  TYPES: ['developer', 'human resource', 'content writer'],
  permissions
}
