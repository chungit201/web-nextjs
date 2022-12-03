import React, {useEffect, useState} from 'react';
import {Menu, Dropdown, Badge, Avatar, List, Button, Spin} from 'antd';
import Link from "next/link";
import {
  MailOutlined,
  BellOutlined,
  WarningOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';
import Flex from '../shared-components/Flex'
import ApiService from "../../services/ApiService";
import {useSelector} from "react-redux";
import moment from "moment";
import InfiniteScroll from "react-infinite-scroll-component";

const getIcon = icon => {
  switch (icon) {
    case 'mail':
      return <MailOutlined/>;
    case 'alert':
      return <WarningOutlined/>;
    case 'check':
      return <CheckCircleOutlined/>
    default:
      return <MailOutlined/>;
  }
}

const getNotificationBody = list => {
  return list.length > 0 ?
    <List
      size="small"
      itemLayout="horizontal"
      dataSource={list}
      renderItem={item => (
        <Link href={item.click_action ? item.click_action : ""} passHref>
          <List.Item className="list-clickable">
            <Flex alignItems="center">
              <div className="pr-3">
                {item ? <Avatar src={item.sender?.avatar}/> :
                  <Avatar className={`ant-avatar-${item.type}`} icon={getIcon(item.icon)}/>}
              </div>
              <div className="mr-3">
                <span className="font-weight-bold text-dark">{item.sender.fullName}</span>
                <span
                  className="text-gray-light">{item.type ? ` ${item.action} on your ${item.type}` : ` ${item.action}`}.</span>
              </div>
              <small className="ml-auto">{moment(item.createdAt).fromNow()}</small>
            </Flex>
          </List.Item>
        </Link>
      )}
    />
    :
    <div className="empty-notification">
      <img src="https://gw.alipayobjects.com/zos/rmsportal/sAuJeJzSKbUmHfBQRzmZ.svg" alt="empty"/>
      <p className="mt-3">You have viewed all notifications</p>
    </div>;
}

export const NavNotification = () => {
  const [visible, setVisible] = useState(false);
  const [notification, setNotification] = useState([])
  const user = useSelector(state => state.user);
  const [page, setPage] = useState(2);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [totalResult, setTotalResults] = useState();
  const limit = 10
  const handleVisibleChange = (flag) => {
    setVisible(flag);
  }
  useEffect(() => {
    getDataNotification();
  }, [])

  const getDataNotification = async () => {
    const {data} = await ApiService.getNotifications({
      receiver: user._id,
      page: 1,
      limit: limit,
      sortBy: "-createdAt"
    });
    setNotification(data.results);
    setTotalResults(data.totalResults)
  }

  const handleView = async () => {
    setPage(state => state + 1);
    const {data} = await ApiService.getNotifications({
      receiver: user._id,
      page: page,
      limit: limit,
      sortBy: "-createdAt"
    });
    setNotification(notification.concat(data.results));
  }

  const notificationList = (
    <div className="nav-dropdown nav-notification">
      <div className="nav-notification-header d-flex justify-content-between align-items-center">
        <h4 className="mb-0">Notification</h4>
        <Button className="text-primary" type="link" onClick={() => setNotification([])} size="small">Clear </Button>
      </div>
      <div className="nav-notification-body">
        {getNotificationBody(notification)}
      </div>
      {
        notification.length > 0 ?
          <div className="nav-notification-footer">
            <span style={{cursor: "pointer", display: notification.length === totalResult ? "none" : "block"}}
                  onClick={handleView}
            >
              View more
            </span>
          </div>
          :
          null
      }
    </div>
  );

  return (
    <Dropdown
      placement="bottomRight"
      overlay={notificationList}
      onVisibleChange={handleVisibleChange}
      visible={visible}
      trigger={['click']}
    >
      <Menu mode="horizontal" onClick={async () => {
        setTotal(0);
        const res = await ApiService.seenAll();

      }}>
        <Menu.Item key="notification">
          <Badge count={total}>
            <BellOutlined className="nav-icon mx-auto" type="bell"/>
          </Badge>
        </Menu.Item>
      </Menu>
    </Dropdown>
  )
}


export default NavNotification;
