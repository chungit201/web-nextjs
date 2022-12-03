import React, {useEffect, useState} from "react";
import {CaretRightOutlined, EllipsisOutlined, DeleteOutlined, RetweetOutlined, StopOutlined} from "@ant-design/icons";
import {Dropdown, Form, Menu, notification} from "antd";
import ApiService from "../../services/ApiService";
import {useSelector} from "react-redux";
import CommentItem from "./CommentItem";
import moment from "moment";

const CommentFeed = ({comments, post, onRemove}) => {

  const [commentReplyList, setCommentReplyList] = useState([]);
  const [form] = Form.useForm();
  const [commentPost, setCommentPost] = useState('')
  const [commentReply, setCommentReply] = useState([]);
  const [showComment, setShowComment] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const user = useSelector(state => state.user);

  useEffect(() => {
    getCommentReply();
  }, [])

  const getCommentReply = async () => {
    const {data} = await ApiService.getComments({replyFor: comments._id});
    setCommentReply(data.results);
  }

  const handleCommentRely = async () => {
    setShowComment(true);
    setShowInput(true)
  }

  const handleReply = async (e) => {
    e.preventDefault()
    setCommentPost('');
    try {

      const {data} = await ApiService.addComments({
        user: user._id,
        post: post._id,
        tag: comments.user._id,
        replyFor: comments._id,
        content: commentPost
      });
      if (data) {
        form.resetFields();
        setCommentReply(state => [...state, data.comments])
        notification.success({message: data.message});
      }
    } catch (err) {

    }
  }

  const menu = (
    <Menu>
      {user._id === post.author._id &&
        <Menu.Item key="0">
          <span onClick={() => onRemove(comments)}>
            <DeleteOutlined/> Delete</span>
        </Menu.Item>
      }
      <Menu.Item key="1">
        <a href="https://www.aliyun.com"><StopOutlined/> Report</a>
      </Menu.Item>
    </Menu>
  );
  return (
    <div>
      <div className="comment-post__list" style={{marginBottom: 0, maxWidth: 550, paddingBottom: 10}}>
        <div className="comment-post">
          <div className="comment-post__user" style={{display: showInput ? "flex" : ""}}>
            <img src={comments.user.avatar} alt={''}/>
            <div
              className="comment-post__straight-line"
              style={{display: 'block'}}
            />
          </div>
          <div>
            <div className="comment-post__content">
              <div className="comment-post__box">
                <span className="comment-post__username" style={{display: 'flex', alignItems: 'center'}}>
                  <span>{comments.user.fullName}</span>
                </span>
                <div className="comment-post__text">{comments.content}</div>
                <div className="comment-action"
                     style={{position: "absolute", left: "170px", top: "20px"}}>
                  <Dropdown overlay={menu} trigger={['click']}>
                    <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                      <EllipsisOutlined style={{fontSize: "16px", fontWeight: "bold"}}/>
                    </a>
                  </Dropdown>

                </div>
              </div>

            </div>
            <div className="comment-post__action">
              <span className="comment-post__action-item">Like</span>
              <span className="comment-post__action-dot">.</span>
              <span
                className="comment-post__action-item"
                onClick={async () => {
                  setShowInput(true);
                  setShowComment(true);
                }}
              >Reply</span>
              <span className="comment-post__action-dot">.</span>
              <span className="comment-post__action-item">
              {moment(comments.createdAt).fromNow()}
            </span>

            </div>


            <div
              className="comment-post__reply-list"
              style={{display: showComment ? 'block' : 'none'}}
            >
              {commentReply.map(item => {
                return (
                  <><CommentItem key={item._id} commentReply={item}/></>
                )
              })}
            </div>
            <div style={{justifyContent: 'center', width: '100%'}}>
              {/*<LoadingOutlined style={{fontSize: 20, margin: '8px 0'}}/>*/}
            </div>
          </div>
        </div>

        <div
          style={{display: commentReply.length === 0 ? "none" : 'block'}}
          className="comment-post__reply-counter">
             <span
               style={{marginBottom: 8, display: showComment === true ? "none" : "block"}}
               onClick={handleCommentRely}
             >
          <RetweetOutlined/> See more replies
        </span>
        </div>
        <div className="comment-post__reply-input" style={{display: showInput ? 'block' : 'none'}}>
          <form onSubmit={handleReply} className="d-flex">
            <img src={user.avatar} className="comment-post__avatar"/>
            <input
              className="ml-2"
              style={{width: '100%', flex: 1}}
              onChange={(e) => {
                setCommentPost(e.target.value)
              }}
              placeholder="Input comment"
            />
          </form>
        </div>
      </div>
      <div style={{display: 'flex', justifyContent: 'center'}}>
      </div>
    </div>
  )
}

export default CommentFeed