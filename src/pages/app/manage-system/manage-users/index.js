import React, {useEffect, useState} from "react"
import {
  Table,
  Card,
  Button,
  Tooltip,
  Modal,
  Avatar,
  Input,
  Pagination,
  Drawer,
  Row,
  Col, Divider, notification, Spin
} from "antd";
import {EyeOutlined, DeleteOutlined, EditOutlined, UserOutlined} from '@ant-design/icons';
import {UserAddOutlined} from '@ant-design/icons';
import {useRouter} from "next/router";
import ManageSystem from "../index";
import {useUser} from "../../../../common/hooks/useRequest";
import ApiService from "../../../../common/services/ApiService";


const {confirm} = Modal;

const ManageUser = (props) => {
  const router = useRouter();
  const limit = 10;
  const [page, setPage] = useState(1);
  const [visible, setVisible] = useState(false);
  const [users, setUsers] = useState(props.users || [])
  const [pageInfo, setPageInfo] = useState(props.pageInfo || {});
  const {data, loading, error} = useUser({page: page, limit: limit});
  const [user, setUser] = useState('');

  useEffect(() => {
    if (data) {
      const {results, totalResults, page, totalPages} = data.data
      setUsers(results)
      setPageInfo({
        totalResults: totalResults,
        hasNextPage: page < totalPages
      })
    }
  }, [page, data])

  const showDeleteConfirm = (userId) => {
    return (
      confirm({
        title: 'Are you sure delete this user?',
        content: 'This action can not undo, so do you want to delete?',
        okText: 'Yes',
        okType: 'danger',
        okButtonProps: {
          disabled: false,
        },
        cancelText: 'No',
        onOk: async () => {
          try {
            const res = await ApiService.deleteUser(userId);
            if (res.status === 200) {
              const newUsers = [...users].filter(user => user._id !== res.data.user._id)
              setUsers(newUsers)
              notification.success({
                message: res.data.message
              })
            }
          } catch (err) {
            console.log('err', err)
          }
        },
        onCancel() {
          console.log('Cancel');
        },
      })
    )
  };
  const columns = [
    {
      title: "Avatar",
      dataIndex: "avatar",
      align: "center",
      key: "avatar",
      render: (record) => (
        <Avatar src={record} icon={<UserOutlined/>}/>
      )
    },
    {
      title: "Full Name",
      align: "center",
      dataIndex: "fullName",
      key: "fullName",
    },
    {
      title: "Username",
      dataIndex: "username",
      key: "useName",
    },
    {
      title: "Role",
      dataIndex: "role",
      align: "center",
      key: "role",
      render: role => {
        return (
          <span>{role !== null ? role.name : null}</span>
        )
      }
    },
    {
      title: "Action",
      dataIndex: "action",
      align: "center",
      key: "action",
      render: (_, record) => (
        <div className="text-right d-flex justify-content-center">
          <Tooltip title="View">
            <Button type="primary" className="mr-2" icon={<EyeOutlined/>} size="small" onClick={() => {
              setVisible(true)
              setUser(record)
            }}/>
          </Tooltip>
          <Tooltip title="Update">
            <Button type="info" className="mr-2" icon={<EditOutlined/>} size="small" onClick={() => {
              router.push(`/app/manage-system/manage-users/edit-user/${record._id}`)
            }}/>
          </Tooltip>
          <Tooltip title="Delete">
            <Button type="danger" icon={<DeleteOutlined/>} onClick={() => showDeleteConfirm(record._id)}
                    size="small"/>
          </Tooltip>
        </div>
      )
    }
  ];

  return (
    <ManageSystem>
      <div>
        <div className="mb-3" style={{
          display: "flex",
          direction: "row",
          justifyContent: "space-between"
        }}>
          <Button type="primary" icon={<UserAddOutlined/>} onClick={() => {
            router.push(`/app/manage-system/manage-users/add-user`)
          }}>Add User</Button>
          <Input.Search style={{width: "30%"}} enterButton/>
        </div>
        <Card>
          <div className="table-responsive">
            <Spin spinning={loading} tip="Loading...">
              <Table columns={columns} dataSource={users} rowKey={record => record._id} pagination={false}
                     footer={() => {
                       return (
                         <Pagination
                           showQuickJumper
                           current={page}
                           defaultCurrent={1}
                           total={pageInfo.totalResults}
                           onChange={(page) => {
                             setPage(page);
                           }}
                         />
                       )
                     }}/>
            </Spin>
            <div>
              <Drawer
                visible={visible}
                title="User Profile"
                onOk={() => {
                  setVisible(true)
                }}
                onClose={() => setVisible(false)}
                width={700}
                footer={[
                  <Button key="back" onClick={() => {
                    setVisible(false)
                  }}>
                    Close
                  </Button>
                ]}
              >
                {
                  user !== ''
                    ?
                    <div>
                      <h3>Requirement Information</h3>
                      <Row gutter={24}>
                        <Col span={12} style={{marginTop: 24, marginBottom: 12}}>
                          <p>Full Name: {user.fullName}</p>
                        </Col>
                        <Col span={12} style={{marginTop: 24, marginBottom: 12}}>
                          <p>Username: {user.username}</p>
                        </Col>
                      </Row>
                      <Row gutter={24}>
                        <Col span={12}>
                          <p>Email: {user.email}</p>
                        </Col>
                        <Col span={12}>
                          <p>Internal Email: {user.internalEmail}</p>
                        </Col>
                      </Row>
                      <Divider/>
                      <h3>Job Information</h3>
                      <Row gutter={24}>
                        <Col span={12} style={{marginTop: 24, marginBottom: 12}}>
                          <p>Role: {user.role ? user.role.name : ''}</p>
                        </Col>
                        <Col span={12} style={{marginTop: 24, marginBottom: 12}}>
                          <p>Position: {user.position}</p>
                        </Col>
                      </Row>
                      <Row gutter={24}>
                        <Col span={12} style={{marginBottom: 12}}>
                          <p>Type of Work: {user.typeOfWork}</p>
                        </Col>
                        <Col span={12} style={{marginBottom: 12}}>
                          <p>State: {user.state}</p>
                        </Col>
                      </Row>

                      <Row gutter={24}>
                        <Col span={12}>
                          <p>Internship: {user.isInternship === false ? "No" : "Yes"}</p>
                        </Col>
                        <Col span={12}>
                          <p>{`Started At: ${new Date(parseInt(user.startedWorkingAt)).toLocaleDateString()}`} </p>
                        </Col>
                      </Row>

                      <Divider/>
                      <h3>Personal Information</h3>

                      <Row gutter={24}>
                        <Col span={12} style={{marginTop: 24, marginBottom: 12}}>
                          <p>{`Date of Birth: ${new Date(parseInt(user.dob)).toLocaleDateString()}`}</p>
                        </Col>
                        <Col span={12} style={{marginTop: 24, marginBottom: 12}}>
                          <p>Gender: {user.gender === '0' ? 'Male' : user.gender === '1' ? 'Female' : 'Unassigned'}</p>
                        </Col>
                      </Row>

                      <Row gutter={24}>
                        <Col span={12} style={{marginBottom: 12}}>
                          <p>Address: {user.address}</p>
                        </Col>
                        <Col span={12} style={{marginBottom: 12}}>
                          <p>Phone: {user.phoneNumber} </p>
                        </Col>
                      </Row>
                      <Row gutter={24}>
                        <Col span={12}>
                          <p>Identity Number: {user.identityNumber}</p>
                        </Col>
                        <Col span={12}>
                          <p>Telegram: No</p>
                        </Col>
                      </Row>
                    </div>
                    :
                    null
                }
              </Drawer>
            </div>
          </div>
        </Card>
      </div>
    </ManageSystem>
  )
}

export const getServerSideProps = async (context) => {
  const res = context
  const auth = require("server/utils/auth");
  const {userService} = require("server/services");
  let check;
  let users = {};
  try {
    check = await auth(context, ["MANAGE_ALL_USER", "GET_ALL_USER"])
    users = await userService.queryUsers({}, {limit: 10, page: 1});

  } catch (err) {
    res.statusCode = 302;
    res.setHeader('Location', '/auth/login');
    return {
      props: {}
    }
  }
  return {
    props: {
      users: JSON.parse(JSON.stringify(users.results)),
      pageInfo: {
        totalResults: users.totalResults,
        hasNextPage: users.page < users.totalPages
      }
    }
  }
}

export default ManageUser
