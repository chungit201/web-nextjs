import {AppLayout} from "../../../../../common/layouts/app-layout";
import UserForm from "../../../../../common/components/user-components/user-form";

const AddUser = (props) => {
  return (
    <AppLayout>
      <UserForm mode={"ADD"} roles={props.roles}/>
    </AppLayout>
  )
}

export const getServerSideProps = async (context) => {
  const res = context
  const auth = require("server/utils/auth");
  const {roleService} = require("server/services");

  let check;
  let roles = {};
  try {
    check = await auth(context, ["MANAGE_ALL_ROLE", "GET_ALL_ROLE"])
    roles = await roleService.queryRoles({}, {limit: 10, page: 1});

  } catch (err) {
    res.statusCode = 302;
    res.setHeader('Location', '/auth/login');
    return {
      props: {}
    }
  }
  return {
    props: {
      roles: JSON.parse(JSON.stringify(roles.results)),
      pageInfo: {
        totalResults: roles.totalResults,
        hasNextPage: roles.page < roles.totalPages
      }
    }
  }
}

export default AddUser