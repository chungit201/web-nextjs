import React, {useEffect, useState} from "react";
import CommentItem from "./CommentItem";
import {LoadingOutlined, RetweetOutlined} from "@ant-design/icons";
import moment from "moment";
import {useSelector} from "react-redux";

const CommentReplyItem = (props) => {
  const {data, handleUpdateCommentCounter} = props;
  const user = useSelector(state => state.user);
  const [loading, setLoading] = useState(false);
  const [showComment, setShowComment] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [nextPage, setNextPage] = useState(1);
  const [totalPages, setTotalPages] = useState(2);
  const [commentReplyList, setCommentReplyList] = useState([]);
  const [commentReply, setCommentReply] = useState('');

  const replyCommentOutLevel = (comment) => {
    setCommentReplyList(state => [...state, comment])
  }

  const handleReply = async (e) => {

  }

  const fetchCommentReply = async (pageNum, limit) => {

  }

  const renderComment = () => {

  }
  return (
    <div className="comment-post__list" style={{marginBottom: 0, maxWidth: 550}}>
      <div className="comment-post">
        <p style={{display: data.replyFor ? 'block' : 'none'}}/>
        <div className="comment-post__user">
          <img
            src={data.user.avatar}
            className="comment-post__avatar"
          />
          <div
            className="comment-post__straight-line"
            style={{display: data.replyCount !== 0 || showInput || showComment ? 'block' : 'none'}}
          />
        </div>
        <div className="comment-post__content">
          <div className="comment-post__box">
            <span className="comment-post__username">{data.user.fullName}</span>
            <div className="comment-post__text">{data.content}</div>
          </div>
          <div className="comment-post__action">
            <span className="c omment-post__action-item">Like</span>
            <span className="comment-post__action-dot">.</span>
            <span
              className="comment-post__action-item"
              onClick={() => {
                setShowInput(true);
                setShowComment(true);
                if (commentReplyList.length === 0 && data.replyCount !== 0) {
                  (async () => fetchCommentReply(1, 5))()
                }
              }}
            >Reply</span>
            <span className="comment-post__action-dot">.</span>
            <span className="comment-post__action-item">{moment(data.createdAt).fromNow()}</span>
          </div>

          <div
            className="comment-post__reply-list"
            style={{display: showComment ? 'block' : 'none'}}
          >
            {
              renderComment()
            }
          </div>
          <div style={{display: loading ? 'flex' : 'none', justifyContent: 'center', width: '100%'}}><LoadingOutlined
            style={{fontSize: 20, margin: '8px 0'}}/></div>
        </div>
      </div>
      <div style={{display: nextPage <= totalPages && data.replyCount > 0 ? 'block' : 'none'}}
           className="comment-post__reply-counter">
        <span
          style={{marginBottom: 8, display: 'block'}}
          onClick={() => {
            setShowComment(true)
            setShowInput(true);
            (async () => {
              await fetchCommentReply(nextPage, 5);
            })()
          }}
        >
          <RetweetOutlined/> See more replies
        </span>
      </div>
      <div style={{display: showInput ? 'flex' : 'none'}} className="comment-post__reply-input">
        <img src={user.avatar} className="comment-post__avatar"/>
        <form style={{display: 'block'}} onSubmit={handleReply}>
          <input value={commentReply} style={{width: '100%', flex: 1}} onChange={(e) => {
            setCommentReply(e.target.value)
          }} placeholder="Input comment"/>
        </form>
      </div>
    </div>
  )
}

export default CommentReplyItem;
