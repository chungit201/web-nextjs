import React, {useCallback, useEffect, useState} from "react";
import {Avatar, Button, List, Tag, Tooltip, Grid, Card, notification} from "antd";
import {CalendarOutlined, MessageOutlined, UserOutlined} from "@ant-design/icons";
import Link from "next/link";
import utils from "../../../utils";
import moment from "moment";

const {useBreakpoint} = Grid

const IssueList = props => {
  const {projectId} = props
  const isMobile = !utils.getBreakPoint(useBreakpoint()).includes('lg');

  return (
    <div>
      <List
        itemLayout="horizontal" dataSource=""
        renderItem={issue => {
          return (
            <List.Item>
              <List.Item.Meta
                key={issue.id}
                title={
                  <div className="d-flex align-items-center">
                    <Tag color={issue.state === "closed" ? "#f50" : "#87d068"}>{issue.state.toUpperCase()}</Tag>
                    <Link href={`/app/projects/${projectId}/issue/${issue.id}`}
                          style={{color: `rgb(26 51 83)`}}><a>{issue?.title}</a></Link>
                  </div>
                }
                description={!isMobile ? (
                  <div className="d-flex align-items-center">
                    <div className="mr-2">#{issue?.index}</div>
                    <div className="mr-2">-
                      created {moment(issue?.createdAt).fromNow()} by {issue?.gitLabAuthor?.name}</div>
                    {issue.dueDate && (
                      <Tooltip title="Due Date" className="d-flex justify-content-between align-items-center mr-2">
                        <div>
                          <CalendarOutlined className="mr-1"/>
                        </div>
                        <div>{moment(issue?.dueDate).format("DD MMMM YYYY")}</div>
                      </Tooltip>
                    )}
                    <div>
                      <div>
                        {issue?.labels.map((label, index) => (
                          <Tag color={label.color} key={index} className="mr-2">{label.title}</Tag>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    {issue?.labels.map((label, index) => (
                      <Tag color={label.color} key={index} className="mr-2">{label.title}</Tag>
                    ))}
                  </div>
                )}
              />
              <div className="text-center">
                <div className="d-flex align-items-center justify-content-end">
                  <div className="mr-1">
                    {issue?.assignees.map((assignee, index) => (
                      <div className={`d-flex ${issue?.assignees.length > 1 ? 'ml-n2' : ''} align-items-center `}>
                        <Tooltip title={`Assigned to ${assignee?.name}`}>
                          <Avatar
                            className="cursor-pointer"
                            size={22}
                            src={assignee?.avatar_url}
                            style={issue?.assignees.length > 1 ? {border: '2px solid #fff'} : {}}
                            icon={<UserOutlined/>}
                          >
                          </Avatar>
                        </Tooltip>
                      </div>
                    ))}
                  </div>
                  <Tooltip title="Comment">
                    <Link href={`/app/projects/${projectId}/issue/${issue.id}`}>
                      <a><Button type="text" size="small" icon={<MessageOutlined style={{fontSize: 20}}/>}/></a>
                    </Link>
                  </Tooltip>
                </div>
                <div>
                  update {moment(issue?.lastEditedAt).fromNow()}
                </div>
              </div>
            </List.Item>
          )
        }}
      />
    </div>
  )
}
export default IssueList;