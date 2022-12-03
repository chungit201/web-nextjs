import React, {createRef, useEffect, useState} from "react";
import {Button, Card, Form, notification, Spin} from "antd";
import Editor from "../../../../common/components/util-components/DynamicImport/dynamic-editor";
import {AppLayout} from "../../../../common/layouts/app-layout";
import '@toast-ui/editor/dist/toastui-editor.css';
import ApiServices from "../../../../common/services/ApiService";
const editorRef = createRef();

const ReportSample = ({samples}) => {
  const [content, setContent] = useState(samples.content || {});
  const [hasSample, setHasSample] = useState(false);


  useEffect(() => {
    if (samples) {
      setHasSample(true)
    }
  }, [samples])

  useEffect(() => {
    if (editorRef.current && content) {
      editorRef.current.getInstance().setMarkdown(content)
    }
  }, [content])

  const submitReport = () => {
    if (hasSample) {
      ApiServices.updateSample({
        content: editorRef.current.getInstance().getMarkdown()
      }).then(res => {
        console.log(res)
        setContent(res.data.report.content)
        notification.success({
          message: res.data.message
        })
      }).catch(err => {

      })
    } else {
      ApiServices.addSample({
        title: user?.fullName ?? user.username,
        content: editorRef.current.getInstance().getMarkdown(),
        isSample: false
      }).then(res => {
        if (res) {
          setContent(res.data.report.content)
          notification.success({
            message: res.data.message
          })
        }
      }).catch(err => {
      })
    }
  }

  return (
    <AppLayout>
      <div className="container">
        <div>
          <Card title="Report Sample"
                extra={<Button type="primary" size="small" onClick={submitReport}>Submit</Button>}>
            <Editor
              initialValue={content}
              previewStyle={"vertical"}
              initialEditType={"markdown"}
              useCommandShortcut={true}
              height={'600px'}
              ref={editorRef}
            />
          </Card>
        </div>
      </div>
    </AppLayout>
  )
}

export const getServerSideProps = async (ctx) => {
  const {res} = ctx;
  const auth = require("server/utils/auth");
  const {reportService} = require("server/services");
  let samples = {};
  try {
    const {user} = await auth(ctx, [])
    samples = await reportService.getReportSample({isSample: true}, user);
  } catch (err) {
    res.statusCode = 302;
    res.setHeader('Location', '/auth/login');
    return {
      props: {}
    }
  }
  return {
    props: {
      samples: JSON.parse(JSON.stringify(samples)),
    }
  }
}

export default ReportSample;
