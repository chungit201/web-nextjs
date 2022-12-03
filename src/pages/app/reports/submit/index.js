import {AppLayout} from "../../../../common/layouts/app-layout";
import {createRef, useEffect, useState} from "react";
import {Button, Card, Form, Input, notification, Spin} from "antd";
import Editor from "../../../../common/components/util-components/DynamicImport/dynamic-editor";
import {useRouter} from "next/router";
import ApiService from "../../../../common/services/ApiService";

const editorRef = createRef();
import {useSelector} from "react-redux";

const AddReport = (props) => {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState(props.users || []);
  const router = useRouter();
  const [form] = Form.useForm();
  const user = useSelector(state => state.user);
  const publicUrl = new URL(process.env.PUBLIC_URL, window.location);


  const submitReport = async () => {
    setLoading(true)

    for(const item of users){
      await ApiService.addNotification({
        sender: user._id,
        action: "add report",
        receiver: item._id,
        click_action:`${publicUrl.origin}/app/manage-system/manage-reports`,
      });
    }

    await ApiService.addReport({
      title: `Weekly Report by ${user.fullName}`,
      searchDate: new Date().getTime(),
      content: editorRef.current.getInstance().getMarkdown()
    }).then(res => {
      if (res) {
        notification.success({
          message: res.data.message
        })
        for (const item of users) {
          if (item.deviceToken) {
            ApiService.sendToOne({
              title: "Internal-web",
              body: `${user.fullName} sent a report`,
              click_action: `${publicUrl.origin}/`,
              icon: "https://northstudio.vn/wp-content/uploads/2021/10/logo-colored-01.png",
              to: item.deviceToken
            })
          }
        }
        setLoading(false)
      }
    }).catch(err => {
      notification.error({
        message: err?.message ?? "Some errors occurred"
      })
      setLoading(false)
    })
  }
  return (
    <AppLayout>
      <Card>
        <Form form={form} onFinish={submitReport} layout="vertical">
          <Form.Item label="Report Content" name="content">
            <Editor
              // initialValue={content}
              previewStyle="vertical"
              height="400px"
              initialEditType="wysiwyg"
              useCommandShortcut={true}
              ref={editorRef}
            />
          </Form.Item>
          <div className="text-right">
            <Button type="default" danger className="mr-3" onClick={() => {
              router.back();
            }}>Cancel</Button>
            <Button type="primary" htmlType="submit" loading={loading}>Send Report</Button>
          </div>
        </Form>
      </Card>
    </AppLayout>
  )
}

export const getServerSideProps = async (context) => {
  const {res} = context
  const auth = require("server/utils/auth");
  const {roleService} = require("server/services");
  let users = {};

  try {
    await auth(context, []);
    users = await roleService.getUsers('MANAGE_ALL_REPORT', {}, {page: 1, limit: 10});
    // const hasPermission = user.role.permissions.includes("MANAGE_ALL_PROJECT") || user.role.permissions.includes("GET_ALL_PROJECT");
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


export default AddReport