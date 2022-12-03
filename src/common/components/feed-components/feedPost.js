import {Avatar, Button, Card, Form, List, Modal, Menu, notification} from "antd";
import {
  LikeOutlined,
  MessageOutlined,
  DeleteOutlined,
  EditOutlined, StopOutlined,
} from "@ant-design/icons";
import React, {useEffect, useState} from "react";
import CommentFeed from "./CommentFeed";
import EllipsisDropdown from "../shared-components/EllipsisDropdown";
import Editor from "../shared-components/Editor";
import ReactMarkdown from "react-markdown";
import ApiService from "../../services/ApiService";
import {useSelector} from "react-redux";
import moment from "moment";
import Link from "next/link";

const FeedPost = ({post, onRemove, onUpdate}) => {
  const [form] = Form.useForm();
  const [postVisible, setPostVisible] = useState(false);
  const [comments, setComments] = useState([]);
  const [react, setReact] = useState(null);
  const [commentPost, setCommentPost] = useState('');
  const [showComment, setShowComment] = useState(false);
  const publicUrl = new URL(process.env.PUBLIC_URL, window.location);
  const [reaction, setReaction] = useState({
    isReacted: post.isReacted,
    totalReaction: post.reactionCount,
  })
  const user = useSelector(state => state.user);
  useEffect(() => {
    getDataComment();
  }, [])

  const getDataComment = async () => {
    const {data} = await ApiService.getComments({post: post._id});
    const commentLevel = data.results.filter(x => x.level === 1);
    setComments(commentLevel);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCommentPost('');
    if (post.author._id !== user._id) {
      const {data} = await ApiService.addNotification({
        sender: user._id,
        action: "comment",
        receiver: post.author._id,
        type: "post",
        notificationBy: post._id
      });
    }

    const {data} = await ApiService.getDeviceToken({user: post.author._id});
    if (post.author._id !== user._id) {
      await ApiService.sendToOne({
        "title": "Northstudio :: Internal",
        "body": `${user.fullName} comment on your post`,
        click_action: `${publicUrl.origin}/`,
        "icon": "https://northstudio.vn/wp-content/uploads/2021/10/logo-colored-01.png",
        "to": `${post.author.deviceToken}`
      })
    }
    try {
      const {data} = await ApiService.addComments({
        user: user._id,
        post: post._id,
        content: commentPost,
      });
      setShowComment(true);
      setComments(state => [...state, data.comments]);
    } catch (err) {
      console.log(err)
    }
  }

  const handleShowComment = async () => {
    setShowComment(true);
  }

  const handleReaction = () => {
    if (reaction.isReacted) {
      setReaction(state => ({
        isReacted: false,
        totalReaction: state.totalReaction - 1,
      }))
      ApiService.handleReaction({post: post._id, state: 'remove'}).catch(err => {
        setReaction(state => ({
          isReacted: true,
          totalReaction: state.totalReaction - 1,
        }))
      })
    } else {
      setReaction(state => ({
        isReacted: true,
        totalReaction: state.totalReaction + 1,
      }))
      ApiService.handleReaction({post: post._id, name: 'like'}).catch(err => {
        setReaction(state => ({
          isReacted: false,
          totalReaction: state.totalReaction - 1,
        }))
      })
    }
  }

  const handleRemoveComment = async (comment) => {
    try {
      await ApiService.deleteComment(comment._id).then(res => {
        if(res.status === 200){
          const newComments = [...comments].filter(item => item._id !== comment._id)
          setComments(newComments)
          notification.success({message:res.data.message})
        }
      })
    } catch (err) {

    }
  }
  return (
    <div>
      <Card
        size="small"
        bodyStyle={{
          padding: "0 16px"
        }}
      >
        <List.Item
          extra={
            <EllipsisDropdown menu={
              <Menu>
                {post.author._id === user._id &&
                  <Menu.Item key="update" onClick={() => {
                    setPostVisible(true)
                    onUpdate(post)
                  }}>
                    <EditOutlined/>
                    <span>Update Post</span>
                  </Menu.Item>
                }
                <Menu.Item key="hide" onClick={() => {
                }}>
                  <StopOutlined/>
                  <span>Hide Posts</span>
                </Menu.Item>
                <Menu.Item style={{display: user.role.name === "user" ? "none" : "block"}} key="delete" onClick={() => {
                  Modal.confirm({
                    title: "Are you sure to delete this post?",
                    content: "This action can not undo, are you sure to delete?",
                    onOk: async () => {
                      onRemove(post._id)
                    },
                    onCancel() {
                    }
                  })
                }
                }>
                  <DeleteOutlined/>
                  <span>Delete Post</span>
                </Menu.Item>
              </Menu>
            }/>}>
          <List.Item.Meta
            avatar={<Avatar src={post.author.avatar}/>}
            title={
              <Link
                href={
                  post.author._id !== user._id
                    ? `/app/profile/${post.author._id}`
                    : `/app/profile`
                }
              >
                {post.author.fullName}
              </Link>
            }
            description={moment(post.createdAt).fromNow()}
          >

          </List.Item.Meta>

        </List.Item>
        <div className='convert-markdown-post'>
          <ReactMarkdown>{post.content}</ReactMarkdown>
        </div>
        {/*<Image src={'https://i.pinimg.com/474x/d9/a4/bf/d9a4bf82af8cafd1dac027cb1aac26fc.jpg'} style={{maxWidth: 550}}/>*/}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: 'center',
          height: 50,
          padding: '8px 0',
          borderTop: '1px solid #f2f5f0',
          borderBottom: '1px solid #f2f5f0',
          marginBottom: 12,
        }}>
          <span
            className="post-button-action d-flex justify-content-center"
            style={{border: 'none', color: reaction.isReacted ? '#0A7FEC' : '', fontSize: 16}}
            onClick={handleReaction}
          ><LikeOutlined style={{marginTop: "2px"}}/>
            <span className="ml-1"> {reaction.totalReaction}  </span>

          </span>
          <span
            className="post-button-action d-flex justify-content-center"
            onClick={handleShowComment}
            style={{border: 'none', color: react ? '#0A7FEC' : '', fontSize: 16}}
          ><MessageOutlined style={{marginTop: "2px"}}/>
            <span className="ml-1"> {post.replyCount} </span>

          </span>
        </div>
        <div>
          {/*<Form onFinish={handleSubmit}>*/}
          {/*  <Form.Item name="content">*/}
          <form onSubmit={handleSubmit}>
            <input
              className="comment-input-main"
              placeholder="Comment Input ..."
              value={commentPost}
              onChange={(e) => {
                setCommentPost(e.target.value);
              }}
            />
          </form>
          {/*  </Form.Item>*/}
          {/*</Form>*/}
        </div>
        <div
          style={{display: showComment ? "block" : "none"}}
        >
          {comments && (comments.map(item => {
            return (
              <><CommentFeed onRemove={handleRemoveComment} key={item._id} comments={item} post={post}/></>
            )
          }))}
        </div>
      </Card>
      <Modal
        title="Update Status"
        visible={postVisible}
        footer={null}
        onCancel={() => setPostVisible(false)}
      >
        <Form layout="vertical">
          <Form.Item name='content'>
            <Editor
              initialEditType={"wysiwyg"}
              initialValue={"XD"}
              height={"300px"}
            />
          </Form.Item>
          <div style={{
            textAlign: "end",
            marginTop: '20px'
          }}>
            <Button className="mr-2" type="default" danger onClick={() => {
              form.resetFields();
              setPostVisible(false)
            }}>Cancel</Button>
            <Button type="primary" ghost htmlType="submit">Submit</Button>
          </div>
        </Form>
      </Modal>
    </div>
  )
}


export default FeedPost