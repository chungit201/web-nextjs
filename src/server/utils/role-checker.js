const {Role, User} = require("../models");
const {ROLES, PERMISSIONS, authorities} = require("../config/role.config");

module.exports = (async () => {
  if (await Role.countDocuments() <= 0) {
    for (const role of ROLES) {
      await Role.create({
        name: role,
        permissions: PERMISSIONS.get(role),
        type: 'system'
      });
      if (role === 'admin') {
        await User.create({
          username: 'admin',
          password: 'admin@123',
          email: 'admin@default.vn',
          role: (await Role.findOne({name: "admin"}))._id
        })
      }
      console.log(`Created role ${role}`);
    }
  } else {
    const fn = [];
    for (const roleName in authorities) {
      const role = await Role.findOne({
        name: roleName
      }).lean();
      if (!role) {
        fn.push({
          insertOne: {
            document: {
              name: roleName,
              permissions: authorities[`${roleName}`]
            }
          }
        });
        console.log(`Added role ${roleName} successfully`);
      } else {
        for (const permission of authorities[`${roleName}`]) {
          // console.log(!role.permissions.includes(permission), role.permissions, permission)
          if (!role.permissions.includes(permission)) {
            fn.push({
              updateOne: {
                filter: {name: roleName},
                update: {
                  $push: {
                    permissions: permission
                  }
                }
              }
            });
            console.log(`Updated ${permission} permission for role ${roleName} successfully`);
          }
        }
      }
    }
    await Role.bulkWrite(fn);
  }
})()