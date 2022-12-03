import {Avatar, Button, Card, Col, Drawer, Form, Input, Modal, notification, Row, Spin, Dropdown, Menu} from "antd";
import React, {useState} from "react";
import {AppLayout} from "../../../common/layouts/app-layout";
import {AssigneeAvatar} from "../../../common/components/project-components/board-components/utils";
import Image from 'next/image'
import ApiService from "../../../common/services/ApiService";
import AssignMemberDepartment from "../../../common/components/manage-compoments/AssignMemberDepartment";
import MemberDepartment from "../../../common/components/manage-compoments/MemberDepartment";
import {
  LoadingOutlined,
  MoreOutlined,
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined
} from "@ant-design/icons";
import {useSelector} from "react-redux";
import EllipsisDropdown from "../../../common/components/shared-components/EllipsisDropdown";

const {confirm} = Modal;
const antIcon = <LoadingOutlined style={{fontSize: 24}} spin/>

const Department = (props) => {
  const [users, setUsers] = useState(props.users.results || []);
  const [department, setDepartment] = useState(props.departments.results || []);
  const [visible, setVisible] = useState(false);
  const [editDepartment, setEditDepartment] = useState({})
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const user = useSelector(state => state.user);
  const [id, setId] = useState()
  const onClose = () => {
    setVisible(false);
  };

  const addDepartment = async (values) => {
    await ApiService.addDepartment(values).then((res) => {
      if (res.status === 200) {
        notification.success({message: res.data.message});
        setIsModalVisible(false);
        setDepartment(state => [...state, res.data.department])
      }
    })
  }

  const handleLoading = (value) => {
    setLoading(value)
  }

  const showDeleteConfirm = async (id) => {
    confirm({
      title: 'Are you sure delete this department?',
      icon: <ExclamationCircleOutlined/>,
      content: 'Some descriptions',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: async () => {
        try {
          const {data} = await ApiService.deleteDepartment(id);
          if (data) {
            notification.success({message: data.message});
            const newData = department.filter(x => x._id !== data.department._id);
            setDepartment(newData)
          }
        } catch (err) {
          notification.error({message: err});
        }
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }


  return (
    <AppLayout>
      <Modal title="Add Department"
             visible={isModalVisible}
             onCancel={() => {
               setIsModalVisible(false)
             }}
             footer={null}>

        <Form onFinish={addDepartment}>
          <Form.Item name="name">
            <Input placeholder="Please enter your name..."/>
          </Form.Item>
          <div style={{
            textAlign: "end",
            marginTop: '20px'
          }}>
            <Button className="mr-2" type="default" danger onClick={() => {
              setIsModalVisible(false)
            }}>Cancel</Button>
            <Button type="primary" ghost htmlType="submit">Submit</Button>
          </div>
        </Form>
      </Modal>
      <Drawer
        title={editDepartment.name}
        placement={"right"}
        width={400}
        onClose={onClose}
        visible={visible}
        key={"right"}
      >
        <AssignMemberDepartment id={id}/>
      </Drawer>
      <Card style={{position: "relative"}}>
        <div>
          <h3>Department</h3>
        </div>
        <div className="mt-4">
          <Row className="d-flex justify-content-center">
            <Col xl={12} xs={24}>
              <Card>
                <div>
                  <div className="d-flex justify-content-center">
                    <Image width={40} height={40} src='/img/logo-internal-sm.png' alt={"northstudio"}/>
                    <div style={{fontSize: "20px", fontWeight: 600}}><span
                      style={{lineHeight: "40px"}}>NORTHSTUDIO</span></div>
                  </div>
                  <div className="text-right">Number of employees : {users.length}</div>
                </div>
              </Card>
            </Col>
          </Row>
        </div>

        <Row>
          <Col span={8}/>
          <Col span={16}>
            <div className="d-flex" style={{float: "right", maxWidth: "100%"}}>
              <Row gutter={16}>
                <Col xs={24}>
                  <div style={{float: "right"}}>
                    <Button type="primary"
                            style={{display: user.role.name === 'user' ? 'none' : 'block'}}
                            ghost className="mr-2"
                            size="small"
                            onClick={() => setIsModalVisible(true)}
                    >Add new</Button>
                  </div>
                </Col>
                <Col xs={24}>
                  <div className="d-flex justify-content-end mb-3 mt-2">
                    {users.map((member, i) => i < 4 ?
                      <AssigneeAvatar key={member._id} member={member} size={30} chain/> : null)}
                    <Avatar className="ml-n2" size={30}>
                      <span className="text-gray font-weight-semibold font-size-base">+{users.length - 4}</span>
                    </Avatar>
                  </div>
                </Col>
                <div>
                </div>
              </Row>
            </div>
          </Col>
        </Row>

        <div className="mt-4">
          <Row gutter={16}>
            {department.map(item => {
              return (
                <Col key={item._id} xl={6} md={8} lg={8} xs={24}>
                  <Card style={{position: "relative"}}>
                    <div className="title text-center">
                      <h5>{item.name.charAt(0).toUpperCase() + item.name.slice(1)}</h5>
                      <div style={{position: "absolute", top: "20px", right: "20px"}}>
                        <EllipsisDropdown menu={
                          <Menu>
                            <Menu.Item key="0">
                              <div><EditOutlined/> <span className='ml-1'>Rename</span></div>
                            </Menu.Item>
                            <Menu.Item key="1">
                              <div onClick={() => showDeleteConfirm(item._id)}><DeleteOutlined/> <span
                                className='ml-1'>Delete</span></div>
                            </Menu.Item>
                          </Menu>
                        }
                        >
                        </EllipsisDropdown>
                      </div>
                      {/*<div>Number of employees : {member.length}</div>*/}
                    </div>
                    <Spin indicator={antIcon} spinning={loading}>
                      <MemberDepartment onloading={handleLoading} id={item?._id}/>
                    </Spin>
                    <div className="text-center"  style={{display: user.role.name === 'user' ? 'none' : 'block'}}>
                      <Button
                        onClick={() => {
                        setVisible(true);
                        setId(item._id)
                        setEditDepartment(item)
                      }
                      }>Assign member</Button>
                    </div>
                  </Card>
                </Col>
              )
            })}
          </Row>
        </div>
      </Card>
    </AppLayout>
  )
}

export const getServerSideProps = async (ctx) => {
  const {res} = ctx;
  const {userService, departmentService} = require("server/services");
  const auth = require("server/utils/auth");
  let users = {};
  let departments = {};
  try {
    const {user} = await auth(ctx, []);
    users = await userService.queryUsers({}, {page: 1, limit: 100});
    departments = await departmentService.queryDepartment({}, {page: 1, limit: 10});
    return {
      props: {
        users: JSON.parse(JSON.stringify(users)),
        departments: JSON.parse(JSON.stringify(departments)),
      }
    }
  } catch (err) {
    res.statusCode = 302;
    res.setHeader('Location', '/auth/login');
    return {
      props: {}
    }
  }
}

export default Department