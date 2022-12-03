import {Card, Form, Row, Col, Input, Button, Select, notification, Tabs} from "antd";
import {PageHeaderAlt} from "../layout-components/PageHeaderAlt";
import Flex from "../shared-components/Flex";
import {allPermissions} from "../../constants/Permissions";
import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import ApiServices from "../../services/ApiService";

const RoleForm = (props) => {
  const [form] = Form.useForm();
  const mode = props.mode;

  useEffect(() => {
    if (mode !== 'ADD') {
      const roleList = Object.assign({}, props.role.permissions);
      let users = [];
      let roles = [];
      let comments = [];
      let posts = [];
      let requests = [];
      let reports = [];
      let projects = [];
      let tasks = [];
      let members = [];
      let boards = [];
      let issues = [];
      let labels = [];

      for (let key in roleList) {
        if (roleList[key].endsWith('_USER')) {
          users.push(roleList[key]);
        } else if (roleList[key].endsWith('_ROLE')) {
          roles.push(roleList[key]);
        } else if (roleList[key].endsWith('_PROJECT')) {
          projects.push(roleList[key]);
        } else if (roleList[key].endsWith('_TASK')) {
          tasks.push(roleList[key]);
        } else if (roleList[key].endsWith('_REQUEST')) {
          requests.push(roleList[key]);
        } else if (roleList[key].endsWith('_REPORT')) {
          reports.push(roleList[key]);
        } else if (roleList[key].endsWith('_MEMBER')) {
          members.push(roleList[key]);
        } else if (roleList[key].endsWith('_ISSUE')) {
          issues.push(roleList[key]);
        } else if (roleList[key].endsWith('_LABEL')) {
          labels.push(roleList[key]);
        } else if (roleList[key].endsWith('_COMMENT')) {
          comments.push(roleList[key]);
        } else if (roleList[key].endsWith('_BOARD')) {
          boards.push(roleList[key]);
        } else if (roleList[key].endsWith('_POST')) {
          posts.push(roleList[key]);
        }
      }
      form.setFieldsValue({
        name: props.role?.name,
        user: users,
        role: roles,
        project: projects,
        task: tasks,
        comment: comments,
        post: posts,
        request: requests,
        report: reports,
        member: members,
        board: boards,
        issue: issues,
        label: labels
      })
    } else {
      form.resetFields();
    }
  }, [mode, form, props.role]);

  const getOptions = values => {
    return values.map((value, index) => {
      return (
        <Select.Option value={value} key={`${value}-${index}`}>{value}</Select.Option>
      )
    })
  }

  const onFinish = (values) => {
    const keyList = Object.keys(values).filter(key => key !== 'name');
    let permissionsList = [];
    for (let key of keyList) {
      permissionsList = permissionsList.concat(values[key])
    }
    permissionsList = permissionsList.filter(permission => permission);

    let data = {
      name: values.name,
      permissions: permissionsList
    }

    if (mode === "ADD") {
      ApiServices.addRole(data).then(res => {
        if (res.status === 200) {
          notification.success({
            message: res.data.message
          })
        }
      }).catch(err => {
        console.log(err);
      })
    } else {
      ApiServices.updateRole(props.role._id, data).then(res => {
        if (res.status === 200) {
          notification.success({
            message: res.data.message
          })
        }
      }).catch(err => {
        console.log(err)
      })
    }
  }

  return (
    <div>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
      >
        <PageHeaderAlt className="border-bottom">
          <div className="container">
            <Flex className="py-2" mobileFlex={false} justifyContent="between" alignItems="center">
              <h2>{mode === 'ADD' ? 'Add Role' : 'Edit Role Information'}</h2>
              <div className="mb-3">
                <Button type="primary" htmlType="submit">
                  {mode === 'ADD' ? 'Submit' : 'Save'}
                </Button>
              </div>
            </Flex>
          </div>
        </PageHeaderAlt>

        <div className="container mt-3">
          <Row gutter={16}>
            <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
              <Card title="Required Information">
                <Form.Item
                  label="Name"
                  name="name"
                  rules={[{required: true, message: 'Please input role name'}]}
                >
                  <Input placeholder="Enter role name..."/>
                </Form.Item>
              </Card>
            </Col>
            <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
              <Card title="Permissions Information">
                <Tabs>
                  <Tabs.TabPane key={0} tab="User Permissions">
                    <Form.Item
                      label="User Permissions"
                      name="user"
                    >
                      <Select
                        mode="multiple"
                        allowClear
                        style={{width: '100%'}}
                        placeholder="Please select"
                      >
                        {getOptions(allPermissions.user)}
                      </Select>
                    </Form.Item>
                    <Form.Item
                      label="Role Permissions"
                      name="role"
                    >
                      <Select
                        mode="multiple"
                        allowClear
                        style={{width: '100%'}}
                        placeholder="Please select"
                      >
                        {getOptions(allPermissions.role)}
                      </Select>
                    </Form.Item>

                    <Form.Item
                      label="Post Permissions"
                      name="post"
                    >
                      <Select
                        mode="multiple"
                        allowClear
                        style={{width: '100%'}}
                        placeholder="Please select"
                      >
                        {getOptions(allPermissions.post)}
                      </Select>
                    </Form.Item>

                    <Form.Item
                      label="Comment Permissions"
                      name="comment"
                    >
                      <Select
                        mode="multiple"
                        allowClear
                        style={{width: '100%'}}
                        placeholder="Please select"
                      >
                        {getOptions(allPermissions.comment)}
                      </Select>
                    </Form.Item>
                    <Form.Item
                      label="Request Permissions"
                      name="request"
                    >
                      <Select
                        mode="multiple"
                        allowClear
                        style={{width: '100%'}}
                        placeholder="Please select"
                      >
                        {getOptions(allPermissions.request)}
                      </Select>
                    </Form.Item>
                    <Form.Item
                      label="Report Permissions"
                      name="report"
                    >
                      <Select
                        mode="multiple"
                        allowClear
                        style={{width: '100%'}}
                        placeholder="Please select"
                      >
                        {getOptions(allPermissions.report)}
                      </Select>
                    </Form.Item>


                  </Tabs.TabPane>
                  <Tabs.TabPane key={1} tab="Project Permissions">
                    <Form.Item
                      label="Project Permissions"
                      name="project"
                    >
                      <Select
                        mode="multiple"
                        allowClear
                        style={{width: '100%'}}
                        placeholder="Please select"
                      >
                        {getOptions(allPermissions.project)}
                      </Select>
                    </Form.Item>
                    <Form.Item
                      label="Board Permissions"
                      name="board"
                    >
                      <Select
                        mode="multiple"
                        allowClear
                        style={{width: '100%'}}
                        placeholder="Please select"
                      >
                        {getOptions(allPermissions.board)}
                      </Select>
                    </Form.Item>
                    <Form.Item
                      label="Member Permissions"
                      name="member"
                    >
                      <Select
                        mode="multiple"
                        allowClear
                        style={{width: '100%'}}
                        placeholder="Please select"
                      >
                        {getOptions(allPermissions.member)}
                      </Select>
                    </Form.Item>
                    <Form.Item
                      label="Task Permissions"
                      name="task"
                    >
                      <Select
                        mode="multiple"
                        allowClear
                        style={{width: '100%'}}
                        placeholder="Please select"
                      >
                        {getOptions(allPermissions.task)}
                      </Select>
                    </Form.Item>
                    <Form.Item
                      label="Issue Permissions"
                      name="issue"
                    >
                      <Select
                        mode="multiple"
                        allowClear
                        style={{width: '100%'}}
                        placeholder="Please select"
                      >
                        {getOptions(allPermissions.issue)}
                      </Select>
                    </Form.Item>
                    <Form.Item
                      label="Label Permissions"
                      name="label"
                    >
                      <Select
                        mode="multiple"
                        allowClear
                        style={{width: '100%'}}
                        placeholder="Please select"
                      >
                        {getOptions(allPermissions.label)}
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

export default RoleForm