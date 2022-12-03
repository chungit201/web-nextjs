import React, {createRef, useState} from "react";
import {Button, Card, Collapse, Divider, Input, Menu, Modal, Typography, Upload, Avatar} from "antd";
import Editor from '../../shared-components/Editor'
import {
  ClockCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  FileAddOutlined,
  FileImageOutlined,
  PlusOutlined
} from "@ant-design/icons";
import EllipsisDropdown from "../../shared-components/EllipsisDropdown";

const UploadStories = (props) => {
  const editorRef = createRef();
  const [content, setContent] = useState('');
  const [visible, setVisible] = useState(false);

  const handleAdd = () => {

  }

  const data = [];
  for(let i = 0; i < 5; i++) {
    data.push({
      id: i,
      name: 'name test',
      content: 'auth content'
    })
  }

  return (
    <div>
      <Card>
        <div className='d-flex'>
          <div>
            <Avatar className='mr-2' src={''}/>
          </div>
          <Input/>
        </div>
        <Divider/>
        <div className='d-flex'>
          <Upload className='flex-grow-1 d-flex justify-content-center'>
            <Button icon={<FileImageOutlined/>} type='link' style={{color: '#455560'}}>
              Image
            </Button>
          </Upload>
          <Upload className='flex-grow-1 d-flex justify-content-center'>
            <Button icon={<FileAddOutlined/>} type='link' style={{color: '#455560'}}>
              Attachment
            </Button>
          </Upload>
          <div className='flex-grow-1 d-flex justify-content-center'>
            <Button icon={<ClockCircleOutlined />} type='link' style={{color: '#455560'}}>
              Event
            </Button>
          </div>
        </div>
      </Card>

      {data.map(x => {
        return (
          <Card
            key={x.id}
            extra={
              <div className='w-100'>
                <EllipsisDropdown
                  menu={
                    <Menu mode='vertical'>
                      <Menu.Item
                        key={1}
                        onClick={() => {

                        }}
                      >
                        <div>
                          <EditOutlined /> Edit
                        </div>
                      </Menu.Item>
                      <Menu.Item
                        key={2}
                        onClick={() => {

                        }}                    >
                        <div className='text-center'>
                          <DeleteOutlined /> Delete
                        </div>
                      </Menu.Item>
                    </Menu>
                  }
                />
              </div>
            }
            title={
              <div className='d-flex'>
                <div className='mr-3'>
                  <Avatar/>
                </div>
                <div>
                  <Typography.Title className='mb-0' level={4}>Admin</Typography.Title>
                  <p style={{fontSize: 13}}>12:20:30 am 12/09/2020</p>
                </div>
              </div>
            }
          >

          </Card>
        )
      })}

      <Modal
        width={1000}
        title='Add Story'
        visible={visible}
        onCancel={() => setVisible(false)}
        onOk={handleAdd}
      >
        <Editor
          initialValue={content}
          height={"250px"}
          initialEditType={"wysiwyg"}
        />
      </Modal>
    </div>
  )
}
export default UploadStories;
