import React from "react";
import {Drawer} from "antd";

const CustomDrawer = (props) => {
  return (
    <Drawer
      title={props.title}
      visible={props.visible}
      width={props.width || 320}
      onClose={props.onClose}
      closable={false}
    >
      {props.children}
    </Drawer>
  )
}
export default CustomDrawer