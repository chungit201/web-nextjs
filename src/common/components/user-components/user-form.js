import {Form, Card, Input, Button, DatePicker, Select, Row, Col, Steps, Radio, Tabs, notification, Spin} from 'antd';
import {PageHeaderAlt} from "../layout-components/PageHeaderAlt";
import Flex from "../shared-components/Flex";
import {useEffect, useState} from "react";
import moment from "moment";
import ApiServices from "../../services/ApiService";

const UserForm = (props) => {
  const mode = props.mode;
  const [form] = Form.useForm();
  const [phone, setPhone] = useState(null);
  const [user, setUser] = useState(props.user || null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      if (user.phoneNumber !== "unassigned") setPhone(user.phoneNumber)
      form.setFieldsValue({
        username: user?.username,
        email: user?.email,
        password: user?.password,
        fullName: user?.fullName,

        //personal information
        dob: user?.dob === "unassigned" ? null : moment(parseInt(user.dob)),
        gender: user?.gender === "unassigned" ? null : user?.gender,
        identityNumber: user?.identityNumber === "unassigned" ? null : user.identityNumber,
        address: user?.address === "unassigned" ? null : user?.address,
        telegramId: user?.telegramId === "unassigned" ? null : user?.telegramId,
        gitlabId: user?.gitlabId === "unassigned" ? null : user?.gitlabId,


        //System Information
        department: user?.position === "unassigned" ? null : user.department,
        typeOfWork: user?.typeOfWork === "unassigned" ? null : user.typeOfWork,
        state: user?.state === "unassigned" ? null : user.state,
        role: user?.role.name,
        startedWorkingAt: (user?.startedWorkingAt === "unassigned") ? null : moment(parseInt(user.startedWorkingAt)),
        isInternship: user?.isInternship
      })
    } else {
      form.resetFields()
    }
  }, [mode, user])

  const datePickerStyle = {
    width: '100%',
  }

  const onFinish = (values) => {
    setLoading(true)
    let data = {
      //required
      username: values?.username,
      email: values?.email,
      fullName: values?.fullName,

      //personal information
      dob: values?.dob !== undefined ? new Date(values?.dob).getTime() : "unassigned",
      gender: values?.gender ?? "unassigned",
      identityNumber: values?.identityNumber ?? "unassigned",
      telegramId: values?.telegramId ?? "unassigned",
      gitlabId: values?.gitlabId ??parseInt("00000"),
      address: values?.address ?? "unassigned",
      phoneNumber: phone ? phone : "unassigned",

      //System Information
      department: values?.department ?? "unassigned",
      typeOfWork: values?.typeOfWork ?? "unassigned",
      state: values?.state ?? "unassigned",
      role: values?.role ?? "user",
      startedWorkingAt: values?.startedWorkingAt !== undefined ? new Date(values?.startedWorkingAt).getTime() : "unassigned",
      isInternship: values?.isInternship !== undefined ? values?.isInternship : false
    }
    if (mode === "ADD") {
      ApiServices.addUser({...data, password: values?.password}).then(res => {
        if (res.status === 200) {
          notification.success({
            message: res.data.message
          })
        }
        setLoading(false)
      }).catch(err => {
        console.log(err)
        setLoading(false)
      })
    } else {
      ApiServices.updateUser(user._id, values?.password === undefined ? data : {
        ...data,
        password: values?.password
      }).then(res => {
        setLoading(false)
        if (res) {
          notification.success({
            message: res.data.message
          })
        }
      }).catch(err => {
        setLoading(false)
        console.log(err)
      })
    }
  }

  return (
    <div>
      <Form
        form={form}
        name="dynamic_rule"
        layout="vertical"
        onFinish={onFinish}
      >
        <PageHeaderAlt className="border-bottom">
          <div className="container">
            <Flex className="py-2" mobileFlex={false} justifyContent="between" alignItems="center">
              <h2 className="mb-3">{mode === "ADD" ? "Add User" : "Edit User Information"}</h2>
              <div className="mb-3">
                {mode === "ADD" && (
                  <Button className="mr-2" onClick={() => {
                    form.resetFields()
                  }}>Reset</Button>
                )}
                <Button type="primary" htmlType="submit">
                  {mode === "ADD" ? "Submit" : "Save"}
                </Button>
              </div>
            </Flex>
          </div>
        </PageHeaderAlt>
        <div className="container">
          <Row gutter={32} className="mt-3">
            <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
              <Card title="Required Information">
                <Form.Item
                  label="Full Name"
                  name="fullName"
                  rules={[{required: true, message: 'Please input your username!'}]}
                >
                  <Input placeholder="Enter full name..."/>
                </Form.Item>
                <Form.Item
                  label="UserName"
                  name="username"
                  rules={[{
                    required: true,
                    message: "Please provide username!"
                  },]}
                >
                  <Input placeholder="Enter username..."/>
                </Form.Item>
                <Form.Item
                  label="Email"
                  name="email"
                  rules={[{required: true, message: 'Please input your email!', type: "email"}]}
                >
                  <Input placeholder="Enter personal email..."/>
                </Form.Item>
                <Form.Item
                  label={mode === "ADD" ? "Password" : "Password (Optional)"}
                  name="password"
                  rules={mode === "ADD" ? [
                    {
                      required: true,
                      message: "Please input password"
                    },
                  ] : []}
                >
                  <Input placeholder="Enter password..."/>
                </Form.Item>
                {mode === "ADD" && (
                  <Form.Item
                    label="Confirm Password"
                    name="confirmPassword"
                    rules={[
                      {
                        required: true,
                        message: "Please input password"
                      },
                      ({getFieldValue}) => ({
                        validator(rule, value) {
                          if (!value || getFieldValue('password') === value) {
                            return Promise.resolve();
                          }
                          return Promise.reject('Passwords do not match!');
                        },
                      })
                    ]}
                  >
                    <Input placeholder="Enter confirm password..."/>
                  </Form.Item>
                )}
              </Card>
            </Col>
            <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
              <Card title="Optional Information">
                <Tabs>
                  <Tabs.TabPane key={0} tab="Personal Information">
                    <Form.Item
                      label="Date of Birth"
                      name="dob"
                    >
                      <DatePicker style={datePickerStyle}/>
                    </Form.Item>
                    <Form.Item
                      name="gender"
                      label="Gender"
                    >
                      <Select placeholder="Select gender...">
                        <Select.Option value="0">Male</Select.Option>
                        <Select.Option value="1">Female</Select.Option>
                      </Select>
                    </Form.Item>
                    <Form.Item
                      label="Identity Number"
                      name="identityNumber"
                    >
                      <Input placeholder="Enter identity number..."/>
                    </Form.Item>
                    <Form.Item
                      label="Address"
                      name="address"
                    >
                      <Input placeholder="Enter address..."/>
                    </Form.Item>

                    <Form.Item
                      label="Phone Number"
                      name="phoneNumber"
                    >
                      <Input.Group compact>
                        <Input defaultValue={"+84"} style={{width: "15%"}}/>
                        <Input placeholder="Enter phone number..." style={{width: "85%"}}/>
                      </Input.Group>
                    </Form.Item>
                    <Form.Item
                      name="telegramId"
                      label="Telegram ID"
                    >
                      <Input placeholder="Enter telegram Id..."/>
                    </Form.Item>
                    <Form.Item
                      name="gitlabId"
                      label="GitLab ID"
                    >
                      <Input placeholder="Enter telegram Id..."/>
                    </Form.Item>
                  </Tabs.TabPane>
                  <Tabs.TabPane tab="System Information">
                    <Form.Item
                      name="role"
                      label="Role"
                    >
                      <Select placeholder="Please select roles">
                        {props.roles.map((role, index) => {
                          return (
                            <Select.Option style={{textTransform: "capitalize"}} value={role.name}
                                           key={role._id + index}><span
                              style={{textTransform: "capitalize"}}>{role.name}</span></Select.Option>
                          )
                        })}
                      </Select>
                    </Form.Item>
                    <Form.Item
                      label="Department"
                      name="department"
                    >
                      <Select placeholder="Select department...">
                        <Select.Option value="human-resource">Human Resource</Select.Option>
                        <Select.Option value="developer">Developer</Select.Option>
                        <Select.Option value="content-writer">Content Writer</Select.Option>
                        <Select.Option value="tester">Tester</Select.Option>
                      </Select>
                    </Form.Item>
                    <Form.Item
                      name="isInternship"
                      label="Internship State"
                    >
                      <Radio.Group>
                        <Radio value={true}>Yes</Radio>
                        <Radio value={false}>No</Radio>
                      </Radio.Group>
                    </Form.Item>
                    <Form.Item
                      name="startedWorkingAt"
                      label="Started At"
                    >
                      <DatePicker style={{
                        width: "100%"
                      }}/>
                    </Form.Item>
                    <Form.Item
                      name="typeOfWork"
                      label="Type of Work"
                    >
                      <Select placeholder="Select state of work...">
                        <Select.Option value="full-time">Full Time</Select.Option>
                        <Select.Option value="part-time">Part Time</Select.Option>
                      </Select>
                    </Form.Item>
                    <Form.Item
                      name="state"
                      label="State"
                    >
                      <Select placeholder="Select state of work...">
                        <Select.Option value="offline">Offline</Select.Option>
                        <Select.Option value="remote">Remote</Select.Option>
                        <Select.Option value="former">Former</Select.Option>
                      </Select>
                    </Form.Item>
                  </Tabs.TabPane>
                </Tabs>
              </Card>
            </Col>
          </Row>
        </div>
      </Form>
    </div>
  )
}

export default UserForm