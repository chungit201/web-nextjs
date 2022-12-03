import React from "react";
import InnerAppLayout from "../../../common/layouts/inner-app-layout";
import {Menu} from "antd";
import Link from "next/link";
import {FileDoneOutlined, MailOutlined, SolutionOutlined, UserOutlined} from "@ant-design/icons";
import {AppLayout} from "../../../common/layouts/app-layout";
import {useRouter} from "next/router";


const ManageSystem = (props) => {
  const router = useRouter();

  const ManageSystemMenu = () => (
    <div className="w-100">
      <Menu
        defaultSelectedKeys={'/app/manage-system/manage-users'}
        selectedKeys={router.asPath}
        mode="inline"
      >
        <Menu.Item key={'/app/manage-system/manage-users'}>
          <Link href={`/app/manage-system/manage-users`} passHref>
            <a>
              <UserOutlined/>
              <span>Manage User</span>
            </a>
          </Link>
        </Menu.Item>
        <Menu.Item key={'/app/manage-system/manage-roles'}>
          <Link href={`/app/manage-system/manage-roles`}>
            <a>
              <SolutionOutlined/>
              <span>Manage Role</span>
            </a>
          </Link>
        </Menu.Item>
        <Menu.Item key={'/app/manage-system/manage-reports'}>
          <Link href={`/app/manage-system/manage-reports`}>
            <a>
              <FileDoneOutlined/>
              <span>Manage Reports</span>
            </a>
          </Link>
        </Menu.Item>

        <Menu.Item key={'/app/manage-system/manage-requests'}>
          <Link href={`/app/manage-system/manage-requests`}>
            <a>
              <MailOutlined/>
              <span>Manage Request</span>
            </a>
          </Link>
        </Menu.Item>

      </Menu>
    </div>
  )

  return (
    <AppLayout>
      <InnerAppLayout
        sideContent={<ManageSystemMenu {...props}/>}
        mainContent={props.children}
        border
      />
    </AppLayout>
  )
}
export default ManageSystem