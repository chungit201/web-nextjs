import RequestInterface from "../index";
import {Button, Form, Input, Select, notification} from "antd";
import AssigneeAvatar from "../../../../common/components/project-components/assignee-avatar";
import Editor from "../../../../common/components/util-components/DynamicImport/dynamic-editor";
import {useRouter} from "next/router";
import {createRef, useEffect, useState} from "react";
import ApiService from "../../../../common/services/ApiService";
import {useSelector} from "react-redux";

const ref = createRef();

const Compose = (props) => {
  const router = useRouter();
  const [users, setUsers] = useState(props.users || []);
  const [form] = Form.useForm();
  const [isIndividual, setIsIndividual] = useState(null);
  const [loading, setLoading] = useState(false);
  const departments = ['individual', 'developer', 'human-resource', 'content-writer', 'tester']
  const types = ['absent', 'late', 'request', 'other'];
  const publicUrl = new URL(process.env.PUBLIC_URL, window.location);
  const user = useSelector(state => state.user)

  const onFinish = async (values) => {
    setLoading(true)
    try {
      const res = await ApiService.sendRequest({
        ...values,
        content: ref.current.getInstance().getMarkdown()
      })
      if (res.status === 200) {
        console.log(res.data.message)
        notification.success({
          message: res.data.message
        })
        for (const item of users) {
          if (item.deviceToken) {
            const {data} = ApiService.sendToOne({
              title: "Internal-web",
              body: `${user.fullName} sent a request`,
              click_action: `${publicUrl.origin}/`,
              icon: "https://northstudio.vn/wp-content/uploads/2021/10/logo-colored-01.png",
              to: item.deviceToken
            })
          }
        }
        setLoading(false)
      }
    } catch (err) {
      notification.error({
        message: err,
      })
      setLoading(false)
    }
  }

  return (
    <RequestInterface>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
      >
        <h4 className="mb-4">New Request</h4>
        <Form.Item
          name="subject"
          label="Form Title"
        >
          <Input placeholder="Input subject..."/>
        </Form.Item>
        <Form.Item
          name="toDepartment"
          label="To Department"
        >
          <Select placeholder="Choose department..." onChange={(value) => {
            if (value === "individual") setIsIndividual(true)
            else setIsIndividual(false)
          }}>
            {departments.map((department, index) => (
              <Select.Option value={department} key={`${department}_${index}`}><span
                style={{textTransform: "capitalize"}}>{department}</span></Select.Option>
            ))}
          </Select>
        </Form.Item>
        {isIndividual && (
          <Form.Item label="Send To" name="receiver">
            <Select
              filterOption={false}
              removeIcon={null}
              placeholder="Reviewer: "
              optionLabelProp="title"
            >
              {
                users.map(user => (
                  <Select.Option key={user._id} value={user._id} title={user.username}>
                    <AssigneeAvatar id={user._id} member={user} name/>
                  </Select.Option>
                ))
              }
            </Select>
          </Form.Item>
        )}

        <Form.Item
          name="type"
          label="Type"
        >
          <Select placeholder="Choose type....">
            {types.map((type, index) => (
              <Select.Option value={type} key={`${type}_${index}`}><span
                style={{textTransform: "capitalize"}}>{type}</span></Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="Reason" name="content">
          <Editor
            previewStyle="vertical"
            height="400px"
            initialEditType="wysiwyg"
            useCommandShortcut={true}
            ref={ref}
          />
        </Form.Item>
        <Form.Item>
          <div className="text-right">
            <Button type="default" danger className="mr-3" onClick={() => {
              router.back();
            }}>Cancel</Button>
            <Button type="primary" htmlType="submit" loading={loading}>Send Request</Button>
          </div>
        </Form.Item>
      </Form>
    </RequestInterface>
  )
}

export const getServerSideProps = async (context) => {
  const res = context;
  const auth = require("server/utils/auth");
  const {roleService} = require("server/services");
  let users = {};

  try {
    await auth(context, []);
    users = await roleService.getUsers('MANAGE_ALL_REQUEST', {}, {page: 1, limit: 10});

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

export default Compose