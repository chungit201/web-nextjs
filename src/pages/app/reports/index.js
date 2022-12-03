import React, {useEffect, useState} from "react";
import {
  Button,
  Card,
  Col,
  DatePicker,
  Empty,
  Input,
  Menu,
  Modal,
  notification,
  Pagination,
  Row, Spin,
  Tag,
  Tooltip
} from "antd";
import Flex from "../../../common/components/shared-components/Flex";
import {CheckCircleOutlined, ClockCircleOutlined, EyeOutlined, DeleteOutlined} from "@ant-design/icons";
import EllipsisDropdown from "../../../common/components/shared-components/EllipsisDropdown";
import PageHeaderAlt from "../../../common/components/layout-components/PageHeaderAlt";
import moment from "moment"
import {useRouter} from "next/router";
import {AppLayout} from "../../../common/layouts/app-layout";
import {useSelector} from "react-redux";
import auth from "../../../server/utils/auth";
import {useReport} from "../../../common/hooks/useRequest";

const MyReport = (props) => {
  const [reports, setReports] = useState(props.reports || {});
  const router = useRouter();
  const user = useSelector(state => state.user);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [report, setReport] = useState('');
  const [page, setPage] = useState(1);
  const [pageInfo, setPageInfo] = useState(props.pageInfo || {});
  const {data, loading, error} = useReport({
    creator: user._id,
    page: page,
    limit: 8,
    sortBy: "-createdAt"
  });


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


  const showModal = (value) => {
    setReport(value);
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const showDeleteConfirm = (reportId) => {
    Modal.confirm({
      title: "Are you sure to delete this request?",
      content: "This action can not undo, so do you want to delete this request?",
      onOk() {
        console.log('OK')
      },
      onCancel() {
        console.log("Cancel")
      }
    })
  }

  // const checkStatus = (createAt) => {
  //   let weekEnd = selectedDate.clone().endOf('week').add(1, "day").format("x");
  //   return createAt > weekEnd
  // }

  return (
    <AppLayout>
      <div>
        <Modal title={`${report.title} create at: ${moment(report?.createAt).format("HH:mm DD-MM-YYYY")}`} visible={isModalVisible}
               onOk={handleOk} cancelButtonProps={{className: "d-none"}}>
          <div style={{whiteSpace: "pre-line"}}>
            <div>
              <strong>Content</strong>
              <p>
                {report?.content}
              </p>
            </div>
          </div>
        </Modal>
        <PageHeaderAlt className="border-bottom">
          <div className="container-fluid">
            <Flex justifyContent="between" alignItems="center" className="py-4">
              <h2>Reports</h2>
              <div style={{flex: 1, display: 'flex', justifyContent: 'flex-end'}}>
                <Input.Search placeholder="Input search text" size="medium" style={{width: "40%"}} allowClear
                />
              </div>
            </Flex>
          </div>
        </PageHeaderAlt>
        <Card className="mt-3">
          <div>
            <div className="mb-3" style={{display: "flex", justifyContent: "flex-end"}}>
              <Button type="primary" onClick={() => {
                router.push("/app/reports/submit")
              }}>Add Report</Button>
            </div>
            {reports.length !== 0 ? (
              <Spin spinning={loading}>
                <Row gutter={16}>
                  {reports.map((report, index) => {
                    return (
                      <Col xs={12} sm={12} md={12} lg={6} xl={6} xxl={6} key={index}>
                        <Card key={index} size="small">
                          <Flex alignItems="center" justifyContent="between">
                            <div onClick={() => showModal(report)}>
                              <a>
                                <h4 className="mb-0">{report.title}</h4>
                                <span className="text-muted">{report.creator.fullName}</span>
                              </a>
                            </div>
                            <EllipsisDropdown
                              menu={
                                <Menu>
                                  <Menu.Item onClick={() => showModal(report)} key="0">
                                    <EyeOutlined/>
                                    <span style={{cursor: "pointer"}}>View</span>
                                  </Menu.Item>
                                  <Menu.Item key="3" onClick={() => showDeleteConfirm()}>
                                    <DeleteOutlined/>
                                    <span>Delete Report</span>
                                  </Menu.Item>
                                </Menu>
                              }
                            />
                          </Flex>
                          <div className="mt-2">
                            <Flex alignItems="center">
                              <div className="mr-3">
                                <Tooltip title="Created At">
                                  <CheckCircleOutlined className="text-muted font-size-md"/>
                                  <span
                                    className="ml-1 text-muted">{moment(parseInt(report.createdAt)).format("DD-MM-YYYY")}</span>
                                </Tooltip>
                              </div>
                              <div>
                                <Tag
                                  color="cyan"
                                  // color={checkStatus(report.createdAt) ? "red" : "cyan"}
                                >
                                  <ClockCircleOutlined/>
                                  <span className="ml-2 font-weight-semibold">On time</span>
                                  {/*// {checkStatus(report.createdAt) ? "Late" : "On Time"}*/}
                                </Tag>
                              </div>
                            </Flex>
                          </div>
                        </Card>
                      </Col>
                    )
                  })}
                </Row>
              </Spin>
            ) : (
              <div>
                <Empty/>
              </div>
            )}
          </div>
          <div className="paginatoin-report" style={{float: "right"}}>
            <Pagination
              current={page}
              defaultCurrent={1}
              total={pageInfo.totalResults}
              onChange={(page) => {
                setPage(page)
              }}
            />
          </div>
        </Card>
      </div>
    </AppLayout>
  )
}

export const getServerSideProps = async (ctx) => {
  const {reportService} = require("server/services");
  const {res} = ctx;
  let reports = {};
  try {
    const {user} = await auth(ctx, []);
    reports = await reportService.getReports({
      creator: user._id
    }, {page: 1, limit: 8, sortBy: "-createdAt"});
    const {results, totalResults, totalPages, page} = reports
    return {
      props: {
        reports: JSON.parse(JSON.stringify(results)),
        pageInfo: {
          totalResults,
          totalPages,
          hasNextPage: page < totalPages
        },

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

export default MyReport;
