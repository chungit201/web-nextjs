import {Button, Checkbox, Dropdown, Menu} from "antd";
import {EllipsisOutlined} from "@ant-design/icons";

const QuickPersonalTaskItem = ({item}) => {
  const menu = (
    <Menu>
      <Menu.Item key="0">
        <a href="http://www.alipay.com/">1st menu item</a>
      </Menu.Item>
      <Menu.Item key="1">
        <a href="http://www.taobao.com/">2nd menu item</a>
      </Menu.Item>
      <Menu.Divider/>
      <Menu.Item key="3">3rd menu item</Menu.Item>
    </Menu>
  );
  return (
    <div style={{
      display: "flex",
      marginBottom: "1rem",
      position: "relative",
      flexDirection: "row"
    }}>
      <div style={{
        alignSelf: "stretch",
        width: "3px",
        backgroundColor: "red",
        borderRadius: "1rem",
      }}/>
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 8px"
      }}>
        <Checkbox/>
      </div>
      <div style={{
        flexDirection: "column",
        flexGrow: 1
      }}>
        <div style={{
          fontSize: ".7rem",
          opacity: .5
        }}>
          Request
        </div>
        <div>
          Đơn xin nghỉ phép
        </div>
      </div>
      <div>
        <Dropdown overlay={menu} trigger={['click']}>
          <Button
            size={"small"}
            type={"text"}
            icon={<EllipsisOutlined/>}
          />
        </Dropdown>
      </div>
    </div>
  );
};

export default QuickPersonalTaskItem;
