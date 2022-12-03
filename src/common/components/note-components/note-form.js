import {createRef, useEffect, useState} from "react";
import {Button, Card, Form, Input, notification, Spin} from "antd";
import {PageHeaderAlt} from "../layout-components/PageHeaderAlt";
import Flex from "../shared-components/Flex";
import {useRouter} from "next/router";
import Editor from "../util-components/DynamicImport/dynamic-editor";
import ApiService from "../../services/ApiService";

const NoteForm = (props) => {
  const router = useRouter();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");
  const editorRef = createRef();
  const id = router.query.noteId;

  useEffect(() => {
    if (id && props.mode === "edit") {
      setLoading(true)
      form.setFieldsValue({
        title: props.note.title
      })
      setContent(props.note.content);
      setLoading(false)
    }
  }, [])

  const submit = async (mode, noteId = {}) => {
    setLoading(true)
    if (mode === "add" && JSON.stringify(noteId) === "{}") {
      try {
        const res = await ApiService.addNote({
          ...form.getFieldsValue(),
          searchDate: new Date().getTime(),
          content: editorRef.current.getInstance().getMarkdown()
        })
        if (res.status === 200) {
          form.resetFields();
          setLoading(false)
          notification.success({
            message: res.data.message
          })
        }
      } catch (err) {
        setLoading(false)
        notification.error({
          message: err,
        })
      }
    } else {
      const res = await ApiService.updateNote({
        ...form.getFieldsValue(),
        content: editorRef.current.getInstance().getMarkdown()
      }, noteId);
      try {
        if (res.status === 200) {
          setLoading(false)
          notification.success({
            message: res.data.message
          })
          setTimeout(() => {
            router.replace({
              pathname: "/app/notes/view-note/" + noteId,
            })
          }, 1000)
        }
      } catch (err) {
        setLoading(false)
        notification.error({
          message: err?.message ?? "Some errors occurred"
        })
      }
    }
  }

  return (
    <Spin spinning={loading} tip={"Loading..."}>
      <PageHeaderAlt className="border-bottom">
        <div className="container-fluid">
          <Flex justifyContent="between" alignItems="center" className="py-4">
            <h2>{props.mode === "edit" ? "Edit Note" : "Add Note"}</h2>
            <div>
              <Button className="mr-2" danger onClick={() => {
                router.replace("/app/notes")
              }}>Cancel</Button>
              <Button type="primary" onClick={() => {
                props.mode === "edit" ? submit("edit", id) : submit("add")
              }}>{props.mode === "edit" ? "Edit Note" : "Add Note"}</Button>
            </div>
          </Flex>
        </div>
      </PageHeaderAlt>
      <div className="container mt-3">
        <Card>
          <Form
            layout="vertical"
            form={form}
            onFinish={submit}
          >
            <Form.Item
              name="title"
              label="Note title"
            >
              <Input placeholder="Enter note title...."/>
            </Form.Item>
            <Form.Item
              label="Content"
              name="content"
            >
              <Editor
                initialValue={content}
                previewStyle="vertical"
                height="500px"
                initialEditType="wysiwyg"
                useCommandShortcut={true}
                ref={editorRef}
              />
            </Form.Item>
          </Form>
        </Card>
      </div>
    </Spin>
  )
}

export default NoteForm;