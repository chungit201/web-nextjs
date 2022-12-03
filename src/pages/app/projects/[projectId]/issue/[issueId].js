import {Button, Upload, Divider, Dropdown, Form, Input, Menu, Space, Tag, Timeline, Card, notification} from "antd";
import Flex from "../../../../../common/components/shared-components/Flex"
import React, {createRef, useEffect, useState} from "react";
import {
  LikeTwoTone,
  DislikeTwoTone,
  SmileTwoTone,
  ClockCircleOutlined,
  DownOutlined,
  InboxOutlined
} from "@ant-design/icons";
import Editor from '../../../../../common/components/shared-components/Editor';
import moment from "moment";
import {useRouter} from "next/router";

const {Dragger} = Upload;
const issues = [];

const IssueDetail = (props) => {
  const [issue, setIssue] = useState(null);
  const router = useRouter();
  const id = router.query.issueId

  useEffect(() => {
    let test = issues.filter(x => x.id === id)
    setIssue(test[0]);
  }, [id])

  return (
    <div className="container">
      <Card>
        <div>
          <Flex justifyContent="between" alignItems="center">
            <Tag color={issue?.state === 'closed' ? '#f50' : '#87d068'}>{issue?.state}</Tag>
            <div className="font-weight-bold">
              Created {moment(issue?.closedAt).format("DD MMMM YYYY")} by {issue?.gitLabAuthor?.name}
            </div>
            <div style={{flex: 1, display: 'flex', justifyContent: 'flex-end'}}>
              <Button type='secondary' size="small">Close issue</Button>
            </div>
          </Flex>
        </div>
        <Divider/>
        <h1>{issue?.title}</h1>
        <div>{issue?.description}</div>
        <br/>
        <Dragger>
          <p className="ant-upload-drag-icon">
            <InboxOutlined/>
          </p>
          <p className="ant-upload-text">Click or drag file to this area to upload</p>
        </Dragger>
        <Divider/>

        <Flex justifyContent="between" alignItems="center" mobileFlex={true}>
          <Space>
            <Button icon={<LikeTwoTone/>}>0</Button>
            <Button icon={<DislikeTwoTone/>}>0</Button>
            <Button icon={<SmileTwoTone/>}/>
          </Space>
          <div style={{flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
            <Space style={{flex: 1, display: 'flex', justifyContent: 'flex-end'}}>
              <Dropdown overlay={
                <Menu>
                  <Menu.Item key="Newest">
                    Newest First
                  </Menu.Item>
                  <Menu.Item key="Older">
                    Older First
                  </Menu.Item>
                </Menu>}>
                <Button>
                  Sort By <DownOutlined/>
                </Button>
              </Dropdown>
              <Dropdown overlay={
                <Menu>
                  <Menu.Item key="activity">
                    Show all activity
                  </Menu.Item>
                  <Menu.Item key="comments">
                    Show comments only
                  </Menu.Item>
                  <Menu.Item key="history">
                    Show history only
                  </Menu.Item>
                </Menu>}>
                <Button>
                  Show By <DownOutlined/>
                </Button>
              </Dropdown>
              <Button>Create merge request</Button>
            </Space>
          </div>
        </Flex>
        <Divider/>
        <Timeline>
          <Timeline.Item>Create a services site 2015-09-01</Timeline.Item>
          <Timeline.Item>Solve initial network problems 2015-09-01</Timeline.Item>
          <Timeline.Item dot={<ClockCircleOutlined style={{fontSize: '16px'}}/>} color="red">
            Technical testing 2015-09-01
          </Timeline.Item>
          <Timeline.Item>Network problems being solved 2015-09-01</Timeline.Item>
        </Timeline>
        <Form>
          <Form.Item>
            <Editor
              initialValue={issue?.description}
              height={"200px"}
              initialEditType={"wysiwyg"}
            />
          </Form.Item>
          <Form.Item>
            <Space style={{float: 'right'}}>
              <Button type='secondary' size="small">Close Issue</Button>
              <Button type='primary' size="small">Comment</Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}

export default IssueDetail
