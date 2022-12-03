import ManageSystem from "../index";
import React, {useEffect, useState} from "react";
import {Avatar, Button, Card, Form, Modal, notification, Pagination, Select, Spin, Table, Tag, Tooltip} from "antd";
import {DeleteOutlined, EditOutlined, EyeOutlined, UserOutlined} from "@ant-design/icons";
import moment from "moment";
import Utils from "../../../../common/utils";
import Link from "next/link";
import {useRequest} from "../../../../common/hooks/useRequest";
import ApiService from "../../../../common/services/ApiService";
import {useSelector} from "react-redux";

const ManageRequests = (props) => {
  const [visible, setVisible] = useState(false);
  const limit = 10;
  const [page, setPage] = useState(1);
  const [requests, setRequests] = useState(props.requests || []);
  const [pageInfo, setPageInfo] = useState(props.pageInfo || {});
  const [status, setStatus] = useState('');
  const [selectedRequest, setSelectedRequest] = useState({});
  const [state, setState] = useState('');
  const [form] = Form.useForm();
  const {data, loading, error} = useRequest({state: status, page: page, limit: limit, sortBy: "-createdAt"});
  const user = useSelector(state => state.user);

  useEffect(() => {
    if (data) {
      const {results, totalResults, page, totalPages} = data.data;
      setRequests(results);
      setPageInfo({
        totalResults: totalResults,
        hasNextPage: page < totalPages
      })
    }
  }, [page, data])

  const showDeleteConfirm = (requestId) => {
    Modal.confirm({
      title: "Are you sure to delete this request?",
      content: "This action can not undo, so do you want to delete this request?",
      onOk: async () => {
        ApiService.deleteRequest(requestId).then(res => {
          if (res) {
            const newRequests = [...requests].filter(request => request._id !== requestId);
            setRequests(newRequests);
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
        console.log("Cancel")
      }
    })
  }

  const showEditModal = (record) => {
    setVisible(true);
    setSelectedRequest(record)
  }

  const updateModal = () => {
    ApiService.updateRequest(selectedRequest._id, {state: state}).then(res => {
      if (res) {
        let newRequests = [...requests];
        const index = newRequests.findIndex(request => request._id === res.data.request._id);
        if (index !== -1) {
          newRequests[index] = res.data.request;
        }
        setRequests(newRequests);
        form.resetFields();
        setVisible(false);
        notification.success({
          message: res.data.message
        })
      }
    }).catch(err => {
      notification.error({
        message: err?.message ?? "Some errors occurred"
      })
    })

  }

  const columns = [
    {
      title: "Avatar",
      dataIndex: "sender",
      align: "center",
      width: 100,
      key: "avatar",
      render: (record) => (
        <Avatar src={record.avatar} icon={<UserOutlined/>}/>
      )
    },
    {
      title: "Name",
      align: "center",
      dataIndex: "sender",
      key: "sender",
      render: (record) => {
        return (
          <span>{record.fullName}</span>
        )
      }
    },
    {
      title: "Title",
      align: "center",
      ellipsis: true,
      dataIndex: "subject",
      key: "subject",
      render: (record) => {
        return (
          <span>{record}</span>
        )
      }
    },
    {
      title: "Receiver(s)",
      align: "center",
      dataIndex: "sentTo",
      key: "state",
      render: (record) => {
        return (
          <div>
            {record?.map((receiver, index) => (
              <Link key={index} href={user._id === receiver._id
                ? '/app/profile'
                : `/app/profile/${receiver._id}`}>
                <a>
                  <Tag className="mr-2 mb-2" key={index}>{receiver.fullName}</Tag>
                </a>
              </Link>
            ))}
          </div>
        )
      }
    },
    {
      title: "Date",
      align: "center",
      dataIndex: "createdAt",
      key: "date",
      width: 150,
      render: (record) => {
        return (
          <span>{moment(record).format("DD-MM-YYYY")}</span>
        )
      }
    },
    {
      title: "Status",
      align: "center",
      dataIndex: "state",
      width: 150,
      key: "state",
      render: (record) => {
        let color = Utils.getLabelColor(record);
        return (
          <Tag color={color}><span style={{textTransform: "capitalize"}}>{record}</span></Tag>
        )
      }
    },
    {
      title: "Action",
      dataIndex: "action",
      align: "center",
      key: "action",
      render: (_, record) =>
        (
          <div className="text-right d-flex justify-content-center">
            <div>
              <Tooltip title="View">
                <Link href={`/app/manage-system/manage-requests/${record._id}`} passHref>
                  <Button type="primary" className="mr-2" icon={<EyeOutlined/>} size="small"/>
                </Link>
              </Tooltip>
            </div>
            <div>
              <div>
                <Tooltip title="Update">
                  <Button type="info" className="mr-2" icon={<EditOutlined/>} size="small" onClick={() => {
                    showEditModal(record)
                  }}/>
                </Tooltip>
              </div>
            </div>
            <div>
              <Tooltip title="Delete">
                <Button type="danger" icon={<DeleteOutlined/>}
                        onClick={() => showDeleteConfirm(record._id)}
                        size="small"/>
              </Tooltip>
            </div>
          </div>
        )
    }
  ]

  return (
    <ManageSystem>
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        marginBottom: 8
      }}>
        <div>
          <Tag color="default">{`Total ${requests.length} request(s)`}</Tag>
          <Tag color="processing"
               className="mb-2">{`Total ${requests.filter(request => request.state === "pending").length} pending request(s)`}</Tag>
          <Tag color="success"
               className="mb-2">{`Total ${requests.filter(request => request.state === "resolved").length} approved request(s)`}</Tag>
          <Tag color="error"
               className="mb-2">{`Total ${requests.filter(request => request.state === "rejected").length} disapproved request(s)`}</Tag>
        </div>
        <div>
          <Select value={status} onChange={(value) => {
            setStatus(value)
          }}>
            <Select.Option value="">All request</Select.Option>
            <Select.Option value="pending">Pending</Select.Option>
            <Select.Option value="in-progress">In-progress</Select.Option>
            <Select.Option value="resolved">Approved</Select.Option>
            <Select.Option value="rejected">Disapproved</Select.Option>
          </Select>
        </div>
      </div>
      <Card>
        <Spin spinning={loading} tip="Loading...">
          <Table
            columns={columns}
            scroll={{x: "100%"}}
            rowKey={requests._id}
            dataSource={requests}
            pagination={false}
            footer={() => {
              return (
                <Pagination
                  showQuickJumper
                  current={page}
                  defaultCurrent={1}
                  total={pageInfo.totalResults}
                  onChange={(page) => {
                    setPage(page)
                  }}
                />
              )
            }}/>
        </Spin>
      </Card>
      <Modal
        visible={visible}
        onCancel={() => setVisible(false)}
        title="Edit state of request"
        form={form}
        onOk={updateModal}
      >
        <span className="d-block mb-2 font-weight-semibold">Select state</span>
        <Select
          onChange={(value) => {
            setState(value)
          }}
          className="w-100"
        >
          <Select.Option value="pending">Pending</Select.Option>
          <Select.Option value="in-progress">In-progress</Select.Option>
          <Select.Option value="resolved">Approved</Select.Option>
          <Select.Option value="rejected">Disapproved</Select.Option>
        </Select>
      </Modal>
    </ManageSystem>
  )
}

export const getServerSideProps = async (context) => {
  const auth = require("server/utils/auth");
  const {res} = context;
  const {requestService} = require("server/services");
  let requests = {};
  try {
    await auth(context, ["MANAGE_ALL_REQUEST", "GET_ALL_REQUEST"]);
    requests = await requestService.getIncomingRequests({}, {limit: 10, page: 1, sortBy: '-createdAt'});
    return {
      props: {
        requests: JSON.parse(JSON.stringify(requests.results)),
        pageInfo: {
          totalResults: requests.totalResults,
          hasNextPage: requests.page < requests.totalPages
        }
      }
    }
  } catch (err) {
    res.statusCode = 302;
    res.setHeader('Location', '/auth/login');
    return {
      props: {}
    }
  }
}

export default ManageRequests
