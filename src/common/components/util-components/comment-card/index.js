import React from "react";
import {Avatar, Button, Grid, Input} from "antd";
import {UserOutlined} from "@ant-design/icons";
// import "./custom.scss"
import utils from "../../../utils";

const {TextArea} = Input;
const {useBreakpoint} = Grid

const CommentCard = props => {
  const isMobile = !utils.getBreakPoint(useBreakpoint()).includes('lg')
  return (<div className="comment-list">
    {props.title && (<div className="label mb-4">
      <h4>{props.title}</h4>
    </div>)}
    {!props.hasInput && (
      <div className="comment-input mb-3 d-flex">
        <div className="mr-1">
          <Avatar shape="square" className="mr-1" icon={<UserOutlined/>}/>
        </div>
        <div className="flex-grow-1">
          <TextArea className="mb-2"/>
          {isMobile && (<Button className="float-right" type="primary" size="small">Submit</Button>)}
        </div>
      </div>
    )}
    <div className="comment-l1 mb-4">
      <div className="author d-flex">
        <div className="mr-1">
          <Avatar shape="square" className="mr-1" icon={<UserOutlined/>}/>
        </div>
        <div className="comment-content">
          <div className="mb-2">
            <span className="mr-2 font-weight-semibold">Nguyen Thu Thuy</span>
            <span className="mb-0  font-size-sm">24 mins ago</span>
          </div>
          <div className="ant-comment-content-detail">
            I’ve been doing some ajax request, to populate a inside drawer, the content of that drawer has a sub
            menu, that you are using in list and all card toolbar.
          </div>
        </div>
      </div>
    </div>
    <div className="comment-l2 mb-2">
      <div className="author d-flex">
        <div className="mr-1">
          <Avatar shape="square" className="mr-1" icon={<UserOutlined/>}/>
        </div>
        <div className="comment-content">
          <div className="mb-2">
            <span className="mr-2 font-weight-semibold">Nguyen Thu Thuy</span>
            <span className="mb-0  font-size-sm">24 mins ago</span>
          </div>
          <div className="ant-comment-content-detail">
            I’ve been doing some ajax request, to populate a inside drawer, the content of that drawer has a sub
            menu, that you are using in list and all card toolbar.
          </div>
        </div>
      </div>
    </div>
  </div>)
}
export default CommentCard;