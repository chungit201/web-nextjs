import React, {useCallback, useEffect, useState} from "react";
import {Alert, Avatar, Button, List, notification, Timeline} from "antd";
import {EditOutlined, UserOutlined} from "@ant-design/icons";
import moment from "moment";

const ProjectActivities = ({projectId, projectInfo}) => {
  const [gitlabRecord, setGitlabRecord] = useState(null);


  const getUserInfo = (type, activity) => {
    switch (type){
      case "issue":
        return activity.assignees[0]
      case "push":
        return {
          avatar_url: activity["user_avatar"],
          name: activity["user_name"],
          username: activity["user_username"]
        }
    }
  }

  const getDescription = (type, activity) => {
    switch (type) {
      case "issue":
        return (
          <div>
            {activity["assignees"][0].name} has created issue {<a
            href={activity?.["object_attributes"]?.url}>{activity?.["object_attributes"]?.title}</a>} at {<a
            href={`${activity?.project?.["git_http_url"]}`}>{activity?.project?.name}</a>}
          </div>
        )
      case "push":
        return (
          <div>
            {activity?.['user_name']} has {activity?.["event_name"]} {activity?.['total_commits_count']} commit(s) to
            '{activity?.ref}' at {<a href={activity?.project?.["git_http_url"]}>{activity?.project?.name}</a>}
          </div>
        )
      default:
        break;
    }
  }

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4>Activities</h4>
      </div>
      <List
        className="list-activities"
        itemLayout="vertical"
        dataSource={gitlabRecord ?? []}
        renderItem={(record, index) => {
          const type = record?.["gitlabRecord"].type
          const activity = record?.["gitlabRecord"].data;
          const userInfo = getUserInfo(type, activity);
          return (
            <List.Item key={index}>
              <List.Item.Meta
                avatar={<Avatar icon={<UserOutlined/>} src={userInfo?.avatar_url}/>}
                title={
                  <div className="d-flex justify-content-between">
                    <div className="mr-2">{userInfo?.name}</div>
                    <div className="mr-2 font-weight-light font-size-sm">{moment(record?.["gitlabRecord"].createdAt).fromNow()}</div>
                  </div>
                }
                description={`@${userInfo?.username}`}
              />
              <div>
                {getDescription(type, activity)}
              </div>
            </List.Item>
          )
        }}
      />
    </>
  )
}

export default ProjectActivities;
