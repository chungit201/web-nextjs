import React, {useEffect, useRef, useState} from "react";
import {Avatar, Button, Form, List, Modal, notification, Select, Spin} from "antd";
import {DeleteOutlined, UserOutlined} from "@ant-design/icons";
import ApiService from "../../../services/ApiService";
import IntlMessage from "../../util-components/IntlMessage";

const AssignMemberTab = (props) => {
  const [options, setOptions] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [onRender, setOnRender] = useState(false);
  const searchTimeout = useRef(null);
  const [type, setType] = useState("member");

  const getMembersFromProject = async () => {
    setLoading(true)
    await ApiService.getMembersFromProject(props.id).then(res => {
      if (res) {
        setMembers(res.data);
        setLoading(false)
      }
      setLoading(false)
    }).catch(err => {
      console.log(err)
    })
  }

  useEffect(() => {
    if (props.id !== '') {
      getMembersFromProject()
    }
  }, [props.id,onRender])

  const handleSearchUser = async (value) => {
    try {
      await ApiService.getUsers({username: value}).then(res => {
        let options = [...res.data.results].map(user => {
          return ({
            value: user._id,
            username: user.username,
            data: user,
            label: (
              <div className="search-list-item" style={{
                display: "flex"
              }}>
                <div className="mr-3">
                  <Avatar src={user.data}/>
                </div>
                <div>
                  <div className="font-weight-semibold"><IntlMessage id={`@${user.username}`}/></div>
                  <div className="font-size-sm text-muted">{user?.fullName ?? user.username} </div>
                </div>
              </div>
            )
          })
        })
        setOptions(value ? options : []);
      }).catch(err => {
        console.log(err)
      })
    } catch (err) {
      console.log(err)
    }
  }

  const handleChangeValueSearchUser = async (value) => {
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }
    searchTimeout.current = setTimeout(() => {
      handleSearchUser(value);
    }, 400);
  }

  const handleSelectMember = (value, options) => {
    setSelectedMembers(value);
  }

  const assignMember = () => {
    setLoading(true)
    let isMaintainer = type === "maintainer"
    let users = [...selectedMembers].map(member => member.value)
    ApiService.assignMembersToProject(props.id, {
      users,
      isMaintainer: isMaintainer
    }).then(res => {
      notification.success({
        message: res.data.message
      })
      setOnRender(!onRender);
      setSelectedMembers([]);
      setOptions([]);
      setLoading(false);
    }).catch(err => {
      setLoading(false);
      notification.error({
        message: err?.message ?? "Some errors occurred"
      })
    })
  }

  const ActionDelete = ({userId}) => {
    return (
      <Button danger size="small" icon={<DeleteOutlined/>} onClick={(e) => {
        Modal.confirm({
          title: "Are you sure to remove this member?",
          content: "This actions can not undo, so can you want to remove this member?",
          onOk: async() => {
            try {
              const res = await ApiService.removeMembersFromProject(props.id, {users: [userId]});
              if (res.status === 200) {
                let newMembers = [...members].filter(member => member.user._id !== userId)
                setMembers(newMembers);
                notification.success({
                  message: res.data.message
                })
              }
            }
            catch (err) {
              notification.error({
                message: err?.message??"Some errors occurred"
              })
            }
          },
          onCancel() {

          }
        })
      }}/>
    )
  }

  const updatePermission = (value, userId) => {
    Modal.confirm({
      title: "Are you sure to change permission of member?",
      content: "This action can not undo, so do you want to change?",
      onOk: async () => {
        try {
          const res = await ApiService.updateMembersPermission(props.id, {
            user: userId,
            isMaintainer: value === "maintainer"
          })
          if (res.status === 200) {
            const newMembers = [...members]
            const index = newMembers.findIndex(member => member.user._id === userId);
            if(index !== -1) {
              newMembers[index].isMaintainer = value === "maintainer"
            }
            setMembers(newMembers)
            notification.success({
              message: res.data.message
            })
          }
        } catch (err) {
          notification.error({
            message: err?.message??"Some errors occurred"
          })
        }
      },
      onCancel() {
      }
    })
  }

  return (
    <div>
      <div className="mb-3">
        <Form layout="vertical">
          <Form.Item name="users" label="User">
            <Select
              allowClear
              mode="multiple"
              labelInValue
              // value={selectedMembers}
              placeholder="Select users"
              filterOption={false}
              onSearch={handleChangeValueSearchUser}
              onChange={(value, option) => handleSelectMember(value, option)}
              style={{width: '100%', minHeight: "inherit"}}
              optionLabelProp="title"
            >
              {options.map(option => (
                <Select.Option key={option.value} value={option.value}
                               title={option.username}>{option.label}</Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="maintainer" label="Maintainer">
            <Select value={type} defaultValue="member" onChange={(value) => setType(value)}>
              <Select.Option value="maintainer">Maintainer</Select.Option>
              <Select.Option value="member">Member</Select.Option>
            </Select>
          </Form.Item>
        </Form>

        <Button
          className="mt-3" type="primary"
          disabled={selectedMembers.length === 0}
          onClick={assignMember}
          block
        >
          Assign Member
        </Button>
      </div>
      <div>
        <span style={{fontWeight: "500"}}>Project's Member</span>
        <Spin spinning={loading} tip="Loading...">
          <List
            className="member-list"
            itemLayout="horizontal"
            dataSource={members}
            renderItem={member => {
              return (
                <List.Item
                  actions={[<ActionDelete userId={member.user._id}/>]}
                >
                  <List.Item.Meta
                    avatar={<Avatar src={member.user.avatar} icon={<UserOutlined/>}/>}
                    title={member.user?.fullName ?? member.user.username}
                    description={`@${member.user.username}`}
                  />
                  <Select value={member.isMaintainer ? "maintainer" : "member"}
                          onChange={(value) => updatePermission(value, member.user._id)}>
                    <Select.Option value="maintainer">Maintainer</Select.Option>
                    <Select.Option value="member">Member</Select.Option>
                  </Select>
                </List.Item>
              )
            }}
          />
        </Spin>
      </div>
    </div>
  )
}
export default AssignMemberTab

