import {AppLayout} from "common/layouts/app-layout";
import Link from "next/link";
import {DatePicker, Menu, Pagination, Spin} from "antd";
import {useRouter} from "next/router";
import InnerAppLayout from "common/layouts/inner-app-layout";
import moment from 'moment'
import React, {useEffect, useState} from "react";
import {LeftCircleOutlined, UserOutlined} from "@ant-design/icons";
import AvatarStatus from "common/components/shared-components/AvatarStatus";
import {useReport} from "../../../../common/hooks/useRequest";

const ListReport = ({props}) => {
  const {query} = useRouter();
  const id = query.reportId;
  const [selectedDate, setSelectedDate] = useState(moment());
  const [reports, setReports] = useState(props.reports || [])
  const [pageInfo, setPageInfo] = useState(props.pageInfo || {});
  const [page, setPage] = useState(1);
  let start = moment(selectedDate).clone().startOf('weeks').format("x");
  let end = moment(selectedDate).clone().endOf('weeks').format("x");

  const {data, loading, error} = useReport({
    start: start,
    end: end,
    page: page,
    limit: 10,
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

  const onChange = (value) => {
    if (value) {
      setSelectedDate(value)
    }
  }

  return (
    <div className="w-100 side-content" style={{
      maxWidth: "300px"
    }}>
      <div className="p-3">
        <DatePicker defaultValue={selectedDate} picker="week" style={{width: "100%"}} onChange={onChange}/>
      </div>
      <Spin spinning={loading} tip="Loading...">
        <Menu
          selectedKeys={`/app/manage-system/manage-reports/${id}`}
          mode="inline"
        >
          {reports.map((report, index) => {
            return (
              <Menu.Item key={`/app/manage-system/manage-reports/${report._id}`}>
                <Link key={index} href={`/app/manage-system/manage-reports/${report._id}`}>
                  <a><span>{report.creator.fullName}</span></a>
                </Link>
              </Menu.Item>
            )
          })}
        </Menu>
      </Spin>
      <Pagination
        simple
        current={page}
        defaultCurrent={1}
        total={pageInfo.totalResults}
        onChange={(page) => {
          setPage(page)
        }}
      />
    </div>
  )
}

const ContentReport = ({props}) => {
  const router = useRouter();
  const {reportId} = router.query;
  const {report} = props;

  return (
    <div>
      <div className="repost-detail">
        <div className="d-lg-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center mb-3">
            <div className="font-size-md mr-3" onClick={() => {
              router.replace("/app/manage-system/manage-reports");
            }}>
              <LeftCircleOutlined className="mail-detail-action-icon font-size-md ml-0"/>
            </div>
            <AvatarStatus icon={<UserOutlined/>} src={report?.creator?.avatar} name={report?.creator?.fullName}
                          subTitle={`At: ${moment(report?.createAt).format("HH:mm DD-MM-YYYY")}`} isText={true}/>
          </div>
        </div>
        <div className="request-detail-content">
          <h3 className="mb-2 font-size-md">{report?.title}</h3>
          <div style={{whiteSpace: "pre-line"}}>
            {report?.content}
          </div>
        </div>
      </div>
    </div>
  )
}

const ViewRequest = (props) => {
  return (
    <div>
      <AppLayout>
        <InnerAppLayout
          sideContent={<ListReport props={{...props}}/>}
          mainContent={<ContentReport props={{...props}}/>}
          border
        />
      </AppLayout>
    </div>
  )
}

export const getServerSideProps = async (ctx) => {
  const moment = require("moment");
  const auth = require("server/utils/auth");
  const {reportService} = require("server/services");
  const {reportId} = ctx.query;
  const {res} = ctx;

  let currentDate = moment();
  let start = currentDate.clone().startOf('week').format("x");
  let end = currentDate.clone().endOf('week').format("x");

  let reports = {};
  let report = {};
  try {
    await auth(ctx, [])
    report = await reportService.getReport({_id: reportId});
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
        report: JSON.parse(JSON.stringify(report)),
        reports: JSON.parse(JSON.stringify(results)),
        pageInfo: {
          totalPages: totalPages,
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

export default ViewRequest