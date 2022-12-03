import {Avatar, Tooltip} from "antd";
import {UserOutlined} from "@ant-design/icons";
import React from "react";

const AssigneeAvatar = ({id, size = 32, name, chain, member}) => {
  if (id) {
    if (member) {
      return (
        <div className={`d-flex ${chain ? 'ml-n2' : ''} align-items-center `}>
          <Tooltip title={name ? '' : member.name}>
            <Avatar
              className="cursor-pointer"
              size={size}
              src={member.hasOwnProperty("avatar") ? member.avatar : "https://yt3.ggpht.com/ytc/AKedOLQUxT2ElMoIhE5JUmQcwIGYrGHj3r67aG0QTs1msQ=s900-c-k-c0x00ffffff-no-rj"}
              style={chain ? {border: '2px solid #fff'} : {}}
              icon={<UserOutlined/>}
            >
            </Avatar>
          </Tooltip>
          {name ? (
            <div style={{
              display: "flex",
              flexDirection: "column"
            }}>
              <span className="mb-0 ml-2 font-weight-semibold">{member.fullName}</span>
              <span className="mb-0 ml-2" style={{fontSize: "0.75rem"}}>@{member.username}</span>
            </div>
          ) : null}
        </div>
      )
    }
  }
  return null
}

export default AssigneeAvatar;
