import React from "react";
import {Avatar, Tooltip} from "antd";
import {UserOutlined} from "@ant-design/icons";

const AvatarList = ({member, chain, size, name, index}) => {
  if (member) {
    return (
      <div className={`d-flex ${chain && index !== 1 ? 'ml-n2' : ''} align-items-center `}>
        <Tooltip title={name ? 'EOF User' : member.name}>
          <Avatar
            className="cursor-pointer"
            size={size}
            src={member.hasOwnProperty("avatar") ? member.avatar : "https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png"}
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
  return null
}
export default AvatarList;