import {AppLayout} from "common/layouts/app-layout";
import UserForm from "common/components/user-components/user-form";
import {useState} from "react";

const EditUser = (props) => {
  const [user, setUser] = useState(props.user || {});
  return (
    <AppLayout>
      <UserForm user={user} setUser={setUser} mode={"EDIT"} roles={props.roles}/>
    </AppLayout>
  )
}

export const getServerSideProps = async (ctx) => {
  const res = ctx
  const auth = require("server/utils/auth");
  const {userService, roleService} = require("server/services");
  const {userId} = ctx.query
  let roles ={};
  let user = {};
  try {
    await auth(ctx, ["MANAGE_ALL_ROLE", "GET_ALL_ROLE", "MANAGE_ALL_USER"])
    roles = await roleService.queryRoles({}, {limit: 10, page: 1});
    user = await userService.getUserByFilter({_id: userId});
  } catch (err) {
    res.statusCode = 302;
    res.setHeader('Location', '/auth/login');
    return {
      props: {}
    }
  }

  return {
    props: {
      user: JSON.parse(JSON.stringify(user)),
      roles: JSON.parse(JSON.stringify(roles.results)),
      pageInfo: {
        totalResults: roles.totalResults,
        hasNextPage: roles.page < roles.totalPages
      }
    }
  }
}

export default EditUser