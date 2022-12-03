import React, {useEffect, useState} from "react";
import {DeleteOutlined, LoadingOutlined, UserOutlined} from "@ant-design/icons";
import AvatarStatus from "../shared-components/AvatarStatus";
import {Avatar, Button, Col, Divider, Grid, Input, Mentions, Menu, Modal, notification, Row, Spin, Tooltip} from "antd";
import moment from "moment";
import utils from "../../utils";
import EllipsisDropdown from "../shared-components/EllipsisDropdown";
import {useRouter} from "next/router";
import {useSelector} from "react-redux";
import ApiService from "../../services/ApiService";

const {useBreakpoint} = Grid;

const {Option} = Mentions;

const ViewRequest = (props) => {
  const {request} = props;
  const router = useRouter();
  const {placeholder} = router.query;
  const [stateRequest, setStateRequest] = useState("pending");
  const isMobile = !utils.getBreakPoint(useBreakpoint()).includes('lg');
  const [loading, setLoading] = useState(false);
  const [comments, setComments] = useState(props.comments)
  const [comment, setComment] = useState('');
  const user = useSelector(state => state.user)
  const handleActionRequest = (state) => {
    setLoading(true)
    const {_id} = request
    ApiService.updateRequest(_id, {state: state}).then(res => {
      setStateRequest(res.data.request.state)
      if (res) {
        setLoading(false)
        notification.success({
          message: res.data.message
        })
      }
    }).catch(err => {
      setLoading(false)
      notification.error({
        message: err?.message ?? "Some errors occurred"
      })
    })
  }

  const showDeleteConfirm = (commentId, userId) => {
    Modal.confirm({
      title: "Are you sure to delete this request?",
      content: "This action can not undo, so do you want to delete this request?",
      onOk: async () => {
        await ApiService.deleteComment(commentId, userId).then(res => {
          if (res) {
            const newComments = [...comments].filter(comment => comment._id !== commentId);
            setComments(newComments);
            notification.success({
              message: res.data.message
            })
          }
        }).catch(err => {
          notification.error({
            message: err?.message ?? "Some errors occurred"
          })
        })
      },
      onCancel() {
      }
    })
  }

  const confirmModal = (state) => {
    Modal.confirm({
      title: `Are you sure to ${state} this request?`,
      content: "This action can not undo, so do you want to continue?",
      onOk() {
        handleActionRequest(state);
      },
      onCancel() {
      }
    })
  }

  return (
    <Spin spinning={loading} tip="Loading....">
      <Row gutter={16}>
        <Col xs={24} md={24} lg={17} xl={17} xxl={17}>
          <div className="mb-3">
            <div className="d-lg-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center mb-3">
                <div>
                  <AvatarStatus icon={<UserOutlined/>} src={request?.sender?.avatar} name={request?.sender?.fullName}
                                subTitle={`At: ${moment(request?.createdAt).format("HH:mm DD-MM-YYYY")}`}
                                isText={true}/>
                </div>
              </div>
              {stateRequest === "pending" &&
                user && user.role && user.role.permissions &&
                user.role.permissions.includes('MANAGE_ALL_REQUEST') &&
                placeholder === "inbox" && (
                  <div className="mail-detail-action mb-3">
                    <Tooltip title="Approved">
                      <Button type="primary" size="small" className="mr-2"
                              onClick={() => confirmModal("resolved")}>Resolve</Button>
                    </Tooltip>
                    <Tooltip title="Disapproved">
                      <Button danger type="ghost" size="small"
                              onClick={() => confirmModal("rejected")}>Reject</Button>
                    </Tooltip>
                  </div>
                )}
            </div>
            <div className="request-detail-content">
              <h3 className="mb-2 font-size-md">{request?.subject}</h3>
              {/*<div dangerouslySetInnerHTML={{__html: formatHtmlFormat(request?.content)}}/>*/}
              <p>{request?.content}</p>
            </div>
          </div>
        </Col>
        {!isMobile && (
          <Col span={1}>
            <Divider type='vertical' style={{height: "100vh"}}/>
          </Col>
        )}
        <Col xs={24} md={24} lg={6} xl={6} xxl={6}>
          <div
            className='h-100 overflow-auto'
            style={{height: 900}}
          >
            <div className="d-flex mb-3">
              <div>
                <Avatar src={user.avatar} icon={<UserOutlined/>} className="mr-3"/>
              </div>
              <Input
                placeholder='Enter comment ...'
                value={comment}
                onChange={(e) => {
                  setComment(e.target.value);
                }}
                onPressEnter={async () => {
                  if(comment === '') {
                    return notification.error({message: 'Please enter comment'});
                  }
                  try {
                    setComment('');
                    const res = await ApiService.addComments({request: request._id, user: user._id, content: comment});
                    if(res.status === 200) {
                      setComments(state => [res.data.comments, ...state])
                    }
                  }
                  catch(err) {
                    notification.error({message: 'Comment failed'});
                  }
                }}
              />
            </div>
            <Divider/>
            <div
              className='overflow-auto custom-list-scroll-bar'
              style={{height: 900}}
            >
              {comments.length > 0 && comments.map(comment => {
                return (
                  <div
                    className="d-flex mb-3"
                    key={comment._id}
                    style={{width: 'calc(100% - 20px)'}}
                  >
                    <div>
                      <Avatar src={comment.user.avatar} icon={<UserOutlined/>} className="mr-3"/>
                    </div>
                    <div
                      style={{
                        padding: '10px 15px',
                        borderRadius: 20,
                        backgroundColor: '#F0F2F5',
                        fontSize: 15,
                        flex: 1
                      }}
                    >
                      <div
                        style={{
                          fontSize: 12,
                          fontWeight: 600,
                          // display: 'flex',
                          // alignItems: 'center',
                          // justifyContent: 'space-between'
                        }}
                      >
                        <div
                          className='d-flex justify-content-between'
                        >
                          <p className='mb-0' style={{color: 'black', fontSize: 15}}>{comment.user.fullName}</p>
                          <div>
                            <EllipsisDropdown
                              menu={
                                <Menu>
                                  <Menu.Item
                                    key='1'
                                    onClick={() => {
                                      showDeleteConfirm(comment._id, comment.user._id)
                                    }}
                                  >
                                    <DeleteOutlined/> Delete
                                  </Menu.Item>
                                </Menu>
                              }
                            />
                          </div>
                        </div>
                        {/*<div>*/}
                        {/*  <CaretRightOutlined style={{margin: '0 1px'}}/>*/}
                        {/*</div>*/}
                        <p className='mb-0' style={{color: 'black', lineHeight: 1.2}}>{moment(comment['createdAt']).format('DD-MM-YYYY - H:mm:ss a')}</p>
                      </div>
                      <div>
                        {comment.content}
                      </div>
                    </div>
                  </div>
                )
              })}
              {/*{loadMoreComment && <div*/}
              {/*  className='d-flex py-2'*/}
              {/*>*/}
              {/*  <LoadingOutlined className='m-auto' style={{fontSize: 30}}/>*/}
              {/*</div>}*/}
            </div>
          </div>
        </Col>
      </Row>
    </Spin>
  )
}
export default ViewRequest
