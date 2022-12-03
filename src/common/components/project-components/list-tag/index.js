import React, {useState} from "react"
import {Button, Card, Form, Input, List, Menu, notification, Typography, Modal} from "antd";
import EllipsisDropdown from "../../shared-components/EllipsisDropdown";
import {DeleteOutlined, EditOutlined, PlusOutlined} from "@ant-design/icons";
import ColorPicker from '../../shared-components/ColorPicker'

const TagList = props => {
  const [visible, setVisible] = useState(false);
  const [color, setColor] = useState(null);
  const [form] = Form.useForm();
  const [action, setAction] = useState('');

  const data = [];
  for (var i = 0; i < 5; i++) {
    data.push({
      id: i,
      name: 'Nguyen Thu Thuy',
      color: 'red'
    })
  }

  const handleAddTag = () => {
    if (!color) return notification.error({message: 'you have not selected the card color'})
    const formData = form.getFieldsValue();
    const {tagName} = formData;
    const tagData = {
      tagName,
      color: color.hex,
    }

    // handle submit tag name
    setColor('');
    setVisible(false);
    form.resetFields();
  }

  return (
    <Card>
      <div className='d-flex align-items-center justify-content-between'>
        <Typography.Title className='m-0' level={2}>
          Tag List
        </Typography.Title>
        <Button
          onClick={() => {
            setAction('add');
            setVisible(true);
          }}
          size='small'
          type='primary'
          icon={<PlusOutlined/>}
        >
          New
        </Button>
      </div>
      <List
        dataSource={data}
        renderItem={item =>
          <List.Item
            extra={
              <EllipsisDropdown
                menu={
                  <Menu mode='vertical'>
                    <Menu.Item
                      key={1}
                      onClick={() => {
                        setVisible(true);
                        setAction('edit');
                      }}
                    >
                      <div>
                        <EditOutlined/> Edit
                      </div>
                    </Menu.Item>
                    <Menu.Item
                      key={2}
                      onClick={() => {

                      }}>
                      <div className='text-center'>
                        <DeleteOutlined/> Delete
                      </div>
                    </Menu.Item>
                  </Menu>
                }
              />
            }
          >
            <div className='d-flex justify-content-between align-item-center'>
              <div className='d-flex mr-2'>
                <div style={{height: 15, width: 15, backgroundColor: item.color, margin: 'auto', borderRadius: 4}}/>
              </div>
              <Typography.Text ellipsis>
                {item.name}
              </Typography.Text>
            </div>
          </List.Item>
        }
      />
      <Modal
        visible={visible}
        onCancel={() => {
          setColor('');
          setVisible(false);
          form.resetFields();
        }}
        onOk={handleAddTag}
        title={action === 'add' ? 'Add Tag' : 'Edit Tag'}
      >
        <Form
          labelCol={{span: 4}}
          wrapperCol={{span: 20}}
          className='mt-4'
          form={form}
        >
          <Form.Item
            label='Tag name'
            name='tagName'
            rule={[{required: true, message: 'Please input tag name'}]}
          >
            <Input/>
          </Form.Item>
          <Form.Item
            label='Color'
            className='m-0'
          >
            <ColorPicker
              color={color ? color.hex : ''}
              colorChange={setColor}
            />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  )
}
export default TagList
