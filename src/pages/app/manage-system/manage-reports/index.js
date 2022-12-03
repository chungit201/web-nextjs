import ManageSystem from "../index";
import React, {useEffect, useState} from "react";
import {Avatar, Button, Card, DatePicker, Modal, notification, Pagination, Spin, Table, Tag, Tooltip} from "antd";
import moment from 'moment'
import {DeleteOutlined, EyeOutlined, UserOutlined} from "@ant-design/icons";
import Link from "next/link";
import ApiService from "../../../../common/services/ApiService";
import {useReport} from "../../../../common/hooks/useRequest";

const ManageReports = (props) => {
  const [selectedDate, setSelectedDate] = useState(moment());
  const [reports, setReports] = useState(props.reports || []);
  const [page, setPage] = useState(1);
  const [pageInfo, setPageInfo] = useState(props.pageInfo || {});
  let start = moment(selectedDate).clone().startOf('weeks').format("x");
  let end = moment(selectedDate).clone().endOf('weeks').format("x");
  const {data, loading, error} = useReport({start: start, end: end, page: page, limit: 10, sortBy: "-createdAt"});

  useEffect(() => {
    if (data) {
      const {results, totalResults, page, totalPages} = data.data;
      setReports(results);
      setPageInfo({
        totalResults: totalResults,
        hasNextPage: page < totalPages
      })
    }
  }, [page, data])

  const showDeleteConfirm = (reportId) => {
    Modal.confirm({
      title: "Are you sure to delete this request?",
      content: "This action can not undo, so do you want to delete this request?",
      onOk: async () => {
        try {
          const res = await ApiService.deleteReport(reportId);
          if (res.status === 200) {
            const newReports = [...reports].filter(report => report._id !== reportId);
            setReports(newReports);
            notification.success({
              message: res.data.message
            })
          }
        } catch (err) {
          notification.error({
            message: err
          })
        }
      },
      onCancel() {
      }
    })
  }

  const columns = [
    {
      title: "Avatar",
      dataIndex: "creator",
      align: "center",
      width: 100,
      key: "avatar",
      render: (record) => (
        <Avatar src={record.avatar} icon={<UserOutlined/>}/>
      )
    }, {
      title: "Creator Name",
      align: "center",
      dataIndex: "creator",
      key: "name",
      render: (record) => {
        return (
          <Tag className="mr-2 mb-2">{record.fullName}</Tag>
        )
      }
    }, {
      title: "Title",
      align: "center",
      ellipsis: true,
      dataIndex: "title",
      key: "title",
      render: (record) => {
        return (
          <span>{record}</span>
        )
      }
    }, {
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
    }, {
      title: "Action",
      dataIndex: "action",
      align: "center",
      key: "action",
      render: (_, record) =>
        (
          <div className="text-right d-flex justify-content-center">
            <div>
              <Tooltip title="View">
                <Link href={`/app/manage-system/manage-reports/${record._id}`} passHref>
                  <Button type="primary" className="mr-2" icon={<EyeOutlined/>} size="small"/>
                </Link>
              </Tooltip>
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
        justifyContent: "flex-end",
        marginBottom: 20
      }}>
        <DatePicker
          picker="week"
          defaultValue={selectedDate}
          onChange={(value) => {
            setSelectedDate(value);
          }}
        />
      </div>
      <Card>
        <Spin spinning={loading} tip="Loading...">
          <Table
            columns={columns}
            scroll={{x: "100%"}}
            rowKey={record => record._id}
            dataSource={reports}
            pagination={false}
            footer={() => {
              return (
                <Pagination
                  showQuickJumper
                  current={page}
                  defaultCurrent={1}
                  total={pageInfo.totalResults}
                  onChange={(page, pagesize) => {
                    setPage(page)
                  }}
                />
              )
            }}/>
        </Spin>
      </Card>
    </ManageSystem>
  )
}

export const getServerSideProps = async (ctx) => {
  const moment = require("moment")
  const auth = require("server/utils/auth");
  const {res} = ctx;
  const {reportService} = require("server/services");

  let currentDate = moment();
  let start = currentDate.clone().startOf('week').format("x");
  let end = currentDate.clone().endOf('week').format("x");
  let reports = {};
  try {
    await auth(ctx, ["MANAGE_ALL_REPORT", "GET_ALL_REPORT"]);
    reports = await reportService.getReports({
      queryRange: {
        field: "searchDate",
        start: +start,
        end: +end,
      }
    }, {page: 1, limit: 10, sortBy: "-createdAt"});
    const {results, totalResults, totalPages, page} = reports
    return {
      props: {
        reports: JSON.parse(JSON.stringify(results)),
        pageInfo: {
          totalResults,
          hasNextPage: page < totalPages
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

export default ManageReports
