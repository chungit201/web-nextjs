import RoleForm from "../../../../../common/components/role-components/role-form";
import {AppLayout} from "../../../../../common/layouts/app-layout";

const EditRole = (props) => {
  return (
    <AppLayout>
      <RoleForm role={props.role} mode={'EDIT'}/>
    </AppLayout>
  )
}

export const getServerSideProps = async (context) => {
  const res = context
  const auth = require("server/utils/auth");
  const {roleService} = require("server/services");
  const {roleId} = context.query
  let check;
  let role ={};
  try {
    check = await auth(context, ["MANAGE_ALL_ROLE", "GET_ALL_ROLE"]);
    role = await roleService.getRoleById({_id: roleId});
  } catch (err) {
    res.statusCode = 302;
    res.setHeader('Location', '/auth/login');
    return {
      props: {}
    }
  }

  return {
    props: {
      role: JSON.parse(JSON.stringify(role)),
    }
  }
}

export default EditRole