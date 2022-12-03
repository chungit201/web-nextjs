import React, {Component, useState} from 'react';
import {SettingOutlined} from '@ant-design/icons';
import {Menu} from 'antd';
import {connect, useSelector} from "react-redux";
import Link from "next/link";

const NavPanel = () => {
  const [visible, setVisible] = useState(false)
  const user = useSelector(state => state.user);
  const showDrawer = () => {
    setVisible(true)
  };

  const onClose = () => {
    setVisible(false)
  };

  return (
    <>
      <Menu mode="horizontal">
        <Menu.Item style={{display: user.role.name === "user" ? "none" :"block"}} key="panel">
          <Link href="/app/manage-system/manage-users"><a><SettingOutlined className="nav-icon mr-0"/></a></Link>
        </Menu.Item>
      </Menu>
    </>
  );
}

const mapStateToProps = ({theme}) => {
  const {locale} = theme;
  return {locale}
};

export default connect(mapStateToProps)(NavPanel);