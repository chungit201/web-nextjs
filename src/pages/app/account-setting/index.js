import React, {useState} from 'react';
import {PageHeaderAlt} from "../../../common/components/layout-components/PageHeaderAlt";
import Flex from "../../../common/components/shared-components/Flex";
import {
  Avatar,
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Input,
  notification,
  Radio,
  Row,
  Select,
  Spin,
  Tabs,
  Upload
} from "antd";
import moment from "moment";
import {InfoCircleOutlined, KeyOutlined, LoadingOutlined, UserOutlined} from "@ant-design/icons";
import ImgCrop from 'antd-img-crop';
import {AppLayout} from "../../../common/layouts/app-layout";
import {useSelector} from "react-redux";
import ApiServices from "../../../common/services/ApiService";
import axios from "axios";
import ApiService from "../../../common/services/ApiService";
import {setUserData} from "../../../common/redux/actions/User";

const AccountSettings = (props) => {
  const [tab, setTab] = useState('1');
  const user = useSelector(state => state.user);
  const [loadingTab1, setLoadingTab1] = useState(false);
  const [loadingTab2, setLoadingTab2] = useState(false);
  const [form] = Form.useForm();
  const [avatar, setAvatar] = useState(user?.avatar)
  const [onUpload, setOnUpLoad] = useState(false)

  const onFinish = (values) => {
    let data;
    if (tab === '1') {
      data = {
        address: values.address,
        dob: (new Date(values.dob)).getTime(),
        email: values.email,
        fullName: values.fullName,
        phoneNumber: values.phoneNumber,
        username: values.username,
      }
    } else {
      data = {
        currentPassword: values.currentPassword,
        password: values.newPassword,
      }
    }
    if (tab === '1') {
      setLoadingTab1(true);
    } else {
      setLoadingTab2(true);
    }
    ApiServices.updateSelfProfile(data).then(res => {
      const {message} = res.data;
      if (message) {
        notification.success({message: message})
      }
      setLoadingTab1(false);
      setLoadingTab2(false);
    }).catch(err => {
      setLoadingTab2(false);
      setLoadingTab1(false);
      console.log(err)
    })
  }
  return (
    <AppLayout>
      <Form
        onFinish={onFinish}
        form={form}
        name="dynamic_rule"
        layout="vertical"
        initialValues={{
          fullName: user.fullName,
          username: user.username,
          dob: user.dob === 'unassigned' ? moment() : moment(parseInt(user.dob)),
          identityNumber: user.identityNumber,
          address: user.address,
          phoneNumber: user.phoneNumber,
          email: user.email,
        }}
      >
        <PageHeaderAlt className="border-bottom" overlap>
          <div className="container">
            <Flex className="py-2" mobileFlex={false} justifyContent="between" alignItems="center">
              <h2 className="mb-3">{"Edit User Information"}</h2>
              <div className="mb-3">
                <Button type="primary" htmlType="submit">
                  {"Save"}
                </Button>
              </div>
            </Flex>
          </div>
        </PageHeaderAlt>
        <div className="container" style={{
          marginTop: "30px"
        }}>
          <Tabs defaultActiveKey={tab} onChange={(activeKey) => setTab(activeKey)}>
            <Tabs.TabPane
              tab={
                <span>
                  <InfoCircleOutlined/>
                  Personal Information
                </span>
              }
              key="1"
            >
              <Flex alignItems="center" mobileFlex={false} className="text-center text-md-left mb-3">
                <Avatar size={90}
                        src={onUpload ? avatar : user.avatar}/>
                <div className="ml-3 mt-md-0 mt-3">
                  <ImgCrop rotate>
                    <Upload showUploadList={false} beforeUpload={(file, fileList) => {
                      const data = new FormData();
                      data.append("file", file);
                      data.append("user", JSON.stringify(user));
                      if (file) {
                        let access_token = JSON.parse(localStorage.getItem("ACCESS_TOKEN"));
                        axios.post('/api/users/update-self-profile', data,
                          {
                            headers:
                              {
                                'Content-Type': 'multipart/form-data',
                                "Authorization": `Bearer ${access_token.token}`
                              }
                          }
                        ).then(res => {
                          let url = URL.createObjectURL(file);
                          setAvatar(url)
                          setOnUpLoad(true)
                          notification.success({
                            message: res.data.message
                          })
                        }).catch(err => {
                          console.log(err)
                        })
                      }
                      return false;
                    }}
                    >
                      <Button type="primary">Change Avatar</Button>
                    </Upload>
                  </ImgCrop>
                  <Button className="ml-2">Remove</Button>
                </div>
              </Flex>
              <Row gutter={32}>
                <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
                  <Card>
                    <Form.Item
                      label="Full Name"
                      name="fullName"
                      rules={[{required: tab === '1' ? true : false, message: 'Please input your username!'}]}
                    >
                      <Input placeholder="Enter full name..."/>
                    </Form.Item>
                    <Form.Item
                      label="Username"
                      name="username"
                      rules={[{
                        required: tab === '1' ? true : false,
                        message: "Please provide username!"
                      },]}
                    >
                      <Input placeholder="Enter username..."/>
                    </Form.Item>
                    <Form.Item
                      label="Email"
                      name="email"
                      rules={[{
                        required: tab === '1' ? true : false,
                        message: 'Please input your email!',
                        type: "email"
                      }]}
                    >
                      <Input placeholder="Enter personal email..."/>
                    </Form.Item>
                  </Card>
                  <Card>
                    {!user.wakaTimeConnected ? (
                      <Button
                        onClick={() => {
                          window.open(props.wakaAuthUrl);
                        }}
                      >
                        Connect WakaTime
                      </Button>
                    ): (
                      <Button
                        onClick={() => {
                          ApiService.disconnectWakaTime().then(() => {
                            setUserData({
                              wakaTimeConnected: false
                            });
                          });
                        }}
                      >
                        Disconnect WakaTime
                      </Button>
                    )}
                    <Button
                      className={"ml-2"}
                      onClick={() => {
                        window.open(props.gitlabAuthUrl);
                      }}
                    >
                      Connect GitLab
                    </Button>
                  </Card>
                </Col>
                <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
                  <Card>
                    <Form.Item
                      label="Date of Birth"
                      name="dob"
                    >
                      <DatePicker style={{display: 'block'}}/>
                    </Form.Item>
                    {user.identityNumber
                      ? <Form.Item
                        label="Identity Number"
                        name="identityNumber"
                      >
                        <Input placeholder="Enter identity number..."/>
                      </Form.Item>
                      : null}
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
                      <Input placeholder="Enter phone number..."/>
                    </Form.Item>
                  </Card>
                </Col>
              </Row>
            </Tabs.TabPane>
            <Tabs.TabPane
              tab={
                <span>
                  <KeyOutlined/>
                  Password
                </span>
              }
              key="2"
            >
              <Card>
                <Form.Item
                  label="Current Password"
                  name="currentPassword"
                  rules={[
                    {
                      required: tab !== '1' ? true : false,
                      message: 'Please input current password!',
                    }
                  ]}
                >
                  <Input type='password' placeholder="Enter current password..."/>
                </Form.Item>
                <Form.Item
                  label="New Password"
                  name="newPassword"
                  rules={[
                    {
                      required: tab !== '1' ? true : false,
                      message: 'Please input new password!',
                    }
                  ]}
                >
                  <Input type='password' placeholder="Enter new password..."/>
                </Form.Item>
                <Form.Item
                  label="Confirm new password"
                  name="repeatPassword"
                  rules={[
                    {
                      required: tab !== '1' ? true : false,
                      message: 'Please confirm your password!',
                    },
                    ({getFieldValue}) => ({
                      validator(_, value) {
                        if (!value || getFieldValue('newPassword') === value) {
                          return Promise.resolve();
                        }

                        return Promise.reject(new Error('The two passwords that you entered do not match!'));
                      },
                    }),
                  ]}
                >

                  <Input type='password' placeholder="Enter new password..."/>
                </Form.Item>
              </Card>
            </Tabs.TabPane>
          </Tabs>
        </div>
      </Form>
    </AppLayout>
  )
}

export const getServerSideProps = (context) => {
  const redirectUri = process.env.WAKATIME_REDIRECT_URI;
  const wakaAuthUrl = `https://wakatime.com/oauth/authorize?client_id=${process.env.WAKATIME_APP_ID}&response_type=code&redirect_uri=${redirectUri}&scope=email,read_logged_time,write_logged_time,read_stats,read_orgs`;
  // const gitlabAuthUrl = `https://gitlab.com/oauth/authorize?client_id=${process.env.GITLAB_APP_ID}&redirect_uri=${process.env.GITLAB_CALLBACK_URL}&response_type=token`;
  const gitlabAuthUrl = `https://gitlab.com/oauth/authorize?client_id=${process.env.GITLAB_APP_ID}&redirect_uri=${process.env.GITLAB_CALLBACK_URL}&response_type=code&scope=api&code_challenge=&code_challenge_method=S256`
  return {
    props: {
      wakaAuthUrl,
      gitlabAuthUrl,
    }
  }
}

export default AccountSettings;
