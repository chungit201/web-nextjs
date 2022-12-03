import {Avatar, Badge, Select, Spin, Table} from "antd";
import React, {useState} from "react";
import {useRouter} from "next/router";
import {markdownToDraft} from "markdown-draft-js";
import {convertFromRaw} from "draft-js";
import {StarOutlined, UserOutlined} from "@ant-design/icons";
import Utils from "../../utils";
import moment from "moment";
import ApiServices from "../../services/ApiService";

const RequestList = (props) => {
  const [status, setStatus] = useState('')
  const router = useRouter();
  const {placeholder} = router.query;
  const [requests, setRequests] = useState(props.requests || {})
  const [currentPage, setCurrentPage] = useState(1)
  const [loadedPage, setLoadedPage] = useState([1]);
  const [total, setTotal] = useState(props.pageInfo.hasNextPage ? 9 : 8);
  const [loading, setLoading] = useState(false);

  const formatBody = value => {
    let rawObject = markdownToDraft(value);
    return convertFromRaw(rawObject).getPlainText();
  }

  const getRequests = async (status, page) => {
    setLoading(true)
    const res = await ApiServices.getRequestsByCategory(placeholder, {
      state: status,
      page: page,
      limit: 8,
      sortBy: "-createdAt",
    });
    const {results} = res.data;
    if (page === 1) {
      setRequests(results);
    } else {
      setRequests(state => [...state, ...results]);
    }

    setLoadedPage(state => [...state, page]);
    if (res.data.page < res.data.totalPages) setTotal(res.data.page * 8 + 8);
    setLoading(false)
  }

  const columns = [
    {
      title: "",
      colSpan: 0,
      dataIndex: '',
      width: "24vh",
      render: (_, record) => {
        return (
          <div className="d-flex align-items-center">
            <div
              onClick={(e) => {
                e.stopPropagation()
                // this.onStarTicked(elm)
              }}
              // className={`mail-list-star font-size-md ${elm.starred ? 'checked' : 'uncheck'}`}
              className={`mail-list-star font-size-md mr-3`}
            >
              {/*{elm.starred ? <StarFilled/> : <StarOutlined/>}*/}
              <StarOutlined/>
            </div>
            <div className="d-flex align-items-center">
              <div>
                <Avatar src={record.sender.avatar} size={30} icon={<UserOutlined/>}/>
              </div>
              <h5 className="mb-0 ml-2">{record.sender.fullName}</h5>
            </div>
          </div>
        )
      }
    },
    {
      title: "",
      colSpan: 0,
      ellipsis: true,
      className: 'list-request',
      render: (_, record) => (
        <div className="listy-request-msg d-flex align-items-center">
          <Badge color={Utils.getLabelColor(record.state)}/>
          <span className="font-weight-semibold text-dark ml-1">{record.subject}</span>
          <span className="mx-2"> - </span>
          <p className="p mb-0" style={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}>{formatBody(record.content)}</p>
        </div>
      )
    },
    {
      title: '',
      colSpan: 0,
      width: "18vh",
      className: 'mail-list-date',
      align: "right",
      render: (_, record) => {
        return (
          <div>{moment(record.createdAt).format("HH:mm DD-MM-YYYY")}</div>
        )
      }
    },
  ]
  return (
    <div>
      <div style={{
        textAlign: "end",
        marginBottom: "8px"
      }}>
        <Select
          value={status}
          onChange={(value) => {
            setStatus(value)
            setTotal(8);
            setCurrentPage(1)
            getRequests(value, 1).then(_ => {
            });
          }}>
          <Select.Option value="">All request</Select.Option>
          <Select.Option value="pending">Pending</Select.Option>
          <Select.Option value="in-progress">In-progress</Select.Option>
          <Select.Option value="resolved">Approved</Select.Option>
          <Select.Option value="rejected">Disapproved</Select.Option>
        </Select>
      </div>
      <div className='cursor-pointer'>
        <Spin spinning={loading} tip='Loading....'>
          <Table
            dataSource={requests}
            columns={columns}
            rowKey={"_id"}
            onRow={record => {
              return {
                onClick: e => {
                  e.preventDefault();
                  router.push(`/app/requests/${placeholder}/${record._id}`)
                }
              }
            }}
            pagination={
              {
                current: currentPage,
                showQuickJumper: false,
                total: total,
                pageSize: 8,
                onChange: (page) => {
                  setCurrentPage(page)
                  if (loadedPage.includes(page)) return;
                  getRequests(status, page).then(_ => {
                  });
                },
              }
            }
          />
        </Spin>
      </div>
    </div>
  )
}

export default RequestList