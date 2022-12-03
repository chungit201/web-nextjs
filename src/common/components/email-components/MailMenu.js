import React from 'react'
import {Menu, Button, Badge} from 'antd';
import {
  InboxOutlined,
  FileTextOutlined,
  MailOutlined,
  StarOutlined,
  DeleteOutlined,
  EditOutlined
} from '@ant-design/icons';
import Link from "next/link"
import {useRouter} from "next/router";

const MailMenu = () => {
  const router = useRouter();
  const match = {
    url: '/app/emails'
  }
  return (
    <div className="w-100">
      <div className="p-3">
        <Button type="primary" block onClick={() => {
          router.push(match.url + '/compose', undefined, {shallow: false});
        }}>
          <EditOutlined/>
          <span>Compose</span>
        </Button>
      </div>
      <Menu
        defaultSelectedKeys={`${match.url}/inbox/1`}
        mode="inline"
        selectedKeys={[location.pathname]}
      >
        <Menu.Item
          key={`${match.url}/`}
          onClick={() => {
            router.push(match.url + '/', undefined, {shallow: false});
          }}
        >
          <InboxOutlined/>
          <span>Inbox</span>
        </Menu.Item>
      </Menu>
    </div>
  );
}

export default MailMenu
