import React from "react";
import InnerAppLayout from "../../../common/layouts/inner-app-layout";
import Link from 'next/link'
import {Button, Menu} from "antd";
import {
  EditOutlined,
  InboxOutlined,
  InfoCircleOutlined,
  MailOutlined
} from "@ant-design/icons";
import {useRouter} from "next/router";
import {AppLayout} from "../../../common/layouts/app-layout";

const RequestInterface = (props) => {
  const RequestMenu = (props) => {
    const router = useRouter();
    return (
      <div className="w-100">
        <div className="p-3">
          <Link href={`/app/requests/compose`}>
            <a>
              <Button type="primary" block>
                <EditOutlined/>
                <span>Compose</span>
              </Button>
            </a>
          </Link>
        </div>
        <Menu
          defaultSelectedKeys={'/app/requests/inbox'}
          mode="inline"
          selectedKeys={router.asPath}
        >
          <Menu.Item key={`/app/requests/inbox`}>
            <a href={`/app/requests/inbox`}>
              <MailOutlined/>
              <span>List request</span>
            </a>
          </Menu.Item>
          <Menu.Item key={`/app/requests/sent`}>
            <a href={`/app/requests/sent`}>
              <InboxOutlined/>
              <span>Sent</span>
            </a>
          </Menu.Item>
          <Menu.Item key={`/app/requests/archived`}>
            <a href={`/app/requests/archived`}>
              <InfoCircleOutlined/>
              <span>Archived</span>
            </a>
          </Menu.Item>
        </Menu>
      </div>
    )
  }

  return (
    <div className="mail">
      <AppLayout>
        <InnerAppLayout
          sideContent={<RequestMenu {...props}/>}
          mainContent={props.children}
          border
        />
      </AppLayout>
    </div>
  )
}
export default RequestInterface
