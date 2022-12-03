import React, {useState} from 'react';
import {CaretRightOutlined, LoadingOutlined, RetweetOutlined} from "@ant-design/icons";

import {useSelector} from "react-redux";

const CommentItem = ({commentReply}) => {
  const user = useSelector(state => state.user);
  const [loading, setLoading] = useState(false);
  const [showComment, setShowComment] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [nextPage, setNextPage] = useState(1);

  const fetchCommentReply = async (pageNum, limit) => {

  }

  const handleReply = async (e) => {

  }

  // const renderComment = () => {
  //   const result = commentReplyList.map(comment => {
  //     return (
  //       <CommentReplyItem handleUpdateCommentCounter={handleUpdateCommentCounter} key={comment._id} data={comment}/>
  //     )
  //   });
  //   return result;
  // }

  return (
    <div className="comment-post__list" style={{marginBottom: 0, maxWidth: 550}}>
      <div className="comment-post">
        <p style={{display: 'block'}}/>
        <div className="comment-post__user">
          <img src={commentReply.user.avatar} alt={''}/>
          <div
            className="comment-post__straight-line"
            style={{display: 'block'}}
          />
        </div>
        <div className="comment-post__content">
          <div className="comment-post__box">
            <span className="comment-post__username" style={{display: 'flex', alignItems: 'center'}}>
              <span>{commentReply.user.fullName}</span>
              <CaretRightOutlined style={{display: commentReply.tag ? 'block' : 'none', margin: '0 4px'}} />
              <span>
                {commentReply.tag ? commentReply.tag.fullName : ''}
              </span>
            </span>
            <div className="comment-post__text">{commentReply.content}</div>
          </div>
          <div className="comment-post__action">
            <span className="comment-post__action-item">Like</span>
            <span className="comment-post__action-dot">.</span>
            <span className="comment-post__action-item">
              {/*{moment(data.createdAt).fromNow()}*/}
            </span>
          </div>

          <div
            className="comment-post__reply-list"
            style={{display: showComment ? 'block' : 'none'}}
          >
            {/*{renderComment()}*/}
          </div>
          <div style={{display: loading ? 'flex' : 'none', justifyContent: 'center', width: '100%'}}><LoadingOutlined
            style={{fontSize: 20, margin: '8px 0'}}/></div>
        </div>
      </div>
      {/*<div style={{display: nextPage <= totalPages && data.replyCount > 0 ? 'block' : 'none'}} className="comment-post__reply-counter">*/}
      <span
        style={{marginBottom: 8, display: 'block'}}
        onClick={() => {
          setShowComment(true);
          setShowInput(true);
          (async () => {
            await fetchCommentReply(nextPage, 5)
          })()
        }}
      >
        </span>
      {/*</div>*/}
      <div style={{display: showInput ? 'flex' : 'none'}} className="comment-post__reply-input">
        <img src={user._id} className="comment-post__avatar"/>
        <form style={{display: 'block'}} onSubmit={handleReply}>
          <input  style={{width: '100%', flex: 1}} onChange={(e) => {
            // setCommentReply(e.target.value)
          }} placeholder="Input comment"/>
        </form>
      </div>
    </div>
  )
}

export default CommentItem;
