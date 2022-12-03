import React from "react";
import {Menu, Dropdown, Avatar} from "antd";
import {connect, useSelector} from 'react-redux'
import {
  EditOutlined,
  SettingOutlined,
  LogoutOutlined
} from '@ant-design/icons';
import Icon from '../util-components/Icon';
import {signOut} from 'common/redux/actions/Auth';
import Link from 'next/link'
import ApiService from "../../services/ApiService";
import {getData, removeData} from "../../services/StorageService";
import {useRouter} from "next/router";
import {unregisterServiceWorker} from "../../services/configServiceWorker";

const menuItem = [
  {
    title: "View Profile",
    icon: EditOutlined,
    path: "/app/profile"
  },

  {
    title: "Account Setting",
    icon: SettingOutlined,
    path: "/app/account-setting"
  },
]

export const NavProfile = () => {
  const user = useSelector(state => state.user);
  const router = useRouter();
  const handleSignOut = async () => {
    const refreshToken = await getData('REFRESH_TOKEN');
    if (refreshToken) {
      try {
        const res = await ApiService.logout({refreshToken: refreshToken.token})
        if (res.status === 200) {
          localStorage.clear();
          await router.replace("/auth/login")
          await unregisterServiceWorker()
        }
      } catch (err) {
      }
    }
  }
  const profileMenu = (
    <div className="nav-profile nav-dropdown">
      <div className="nav-profile-header">
        <div className="d-flex">
          <Avatar size={45} src={user.avatar}/>
          <div className="pl-3">
            <h4 className="mb-0">{user.fullName}</h4>
            <span className="text-muted">@{user.username}</span>
          </div>
        </div>
      </div>
      <div className="nav-profile-body">
        <Menu>
          {menuItem.map((el, i) => {
            return (
              <Menu.Item key={i}>
                <Link href={el.path}>
                  <a href={el.path}>
                    <Icon className="mr-3" type={el.icon}/>
                    <span className="font-weight-normal">{el.title}</span>
                  </a>
                </Link>
              </Menu.Item>
            );
          })}
          <Menu.Item key={menuItem.length + 1} onClick={handleSignOut}>
            <span>
              <LogoutOutlined className="mr-3"/>
              <span className="font-weight-normal">Sign Out</span>
            </span>
          </Menu.Item>
        </Menu>
      </div>
    </div>
  );
  return (
    <Dropdown placement="bottomRight" overlay={profileMenu} trigger={["click"]}>
      <Menu className="d-flex align-item-center" mode="horizontal">
        <Menu.Item>
          <Avatar src={user.avatar}/>
        </Menu.Item>
      </Menu>
    </Dropdown>
  );
}

export default connect(null, {signOut})(NavProfile)
