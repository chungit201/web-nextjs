import {AppLayout} from "../../../../common/layouts/app-layout";
import utils from "../../../../common/utils";
import {Button, Card, DatePicker, Divider, Grid, List, notification, Select, Spin} from "antd";
import {useState} from "react";
import moment from "moment"
import {EditOutlined} from "@ant-design/icons";
import {useRouter} from "next/router";
import ReactMarkdown from "react-markdown";
import ApiService from "../../../../common/services/ApiService";

const {useBreakpoint} = Grid;

const ViewNote = (props) => {
  const router = useRouter()
  const [note, setNote] = useState(props.note || {});
  const [notes, setNotes] = useState(props.notes || []);
  const [option, setOption] = useState("week");
  const [currentPage, setCurrentPage] = useState(1);
  const [loadedPage, setLoadedPage] = useState([1]);
  const [total, setTotal] = useState(props.pageInfo.hasNextPage ? 9 : 8);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(moment());
  const isMobile = !utils.getBreakPoint(useBreakpoint()).includes('lg');

  const getNotes = async (date, option, page) => {
    setLoading(true);
    try {
      let start = moment(date).clone().startOf(option).format("x");
      let end = moment(date).clone().endOf(option).format("x");
      const res = await ApiService.getNotes({
        limit: 4,
        page: page,
        start: start,
        end: end
      });
      const {results, totalPages} = res.data.results;
      if (page === 1) {
        setNotes(results);
      } else {
        setNotes(state => [...state, ...results]);
      }

      setLoadedPage(state => [...state, res.data.results.page]);
      if (res.data.results.page < totalPages) setTotal(res.data.results.page * 4 + 4);
      setLoading(false)
    } catch (err) {
      notification.error({
        message: err?.message ?? "Some errors occurred"
      })
    }
  }

  return (
    <AppLayout>
      <Spin spinning={loading} tip="Loading...">
        <div className="d-flex">
          {!isMobile ? (
            <div className="mr-3">
              <Card>
                <div className="mb-3 d-flex">
                  <Select
                    className="mr-3"
                    value={option}
                    onChange={(value) => {
                      setOption(value)
                      setTotal(4)
                      setCurrentPage(1);
                      setLoadedPage([]);
                      getNotes(selectedDate, value, 1).then(_ => {
                      })
                    }}
                  >
                    <Select.Option value="date">Date</Select.Option>
                    <Select.Option value="week">Week</Select.Option>
                    <Select.Option value="month">Month</Select.Option>
                  </Select>
                  <DatePicker
                    style={{flex: 1,}}
                    picker={option}
                    onChange={(value) => {
                      setSelectedDate(value);
                      setTotal(4)
                      setCurrentPage(1);
                      setLoadedPage([]);
                      getNotes(value, option, 1).then(_ => {
                      })
                    }}
                  />
                </div>
                <h2>List note</h2>
                <List
                  pagination={{
                    current: currentPage,
                    showQuickJumper: false,
                    total: total,
                    pageSize: 4,
                    onChange: (page) => {
                      setCurrentPage(page)
                      if (loadedPage.includes(page)) return;
                      getNotes(selectedDate, option, page).then(_ => {
                      });
                    }
                  }}
                  style={{
                    width: "18vw",
                    marginRight: 0
                  }}
                  itemLayout="horizontal"
                  dataSource={notes}
                  renderItem={item => (
                    <a href={`/app/notes/view-note/${item._id}`}>
                      <Card bodyStyle={{padding: 0}}>
                        <List.Item>
                          <List.Item.Meta
                            title={item.title}
                            description={item.content}
                          />
                        </List.Item>
                      </Card>
                    </a>
                  )}
                />
              </Card>
            </div>
          ) : <></>}
          <div style={{flex: 1}}>
            <Card>
              <div className="d-flex justify-content-between">
                <h1 className="m-0">{note.title}</h1>
                <div>
                  <Button size="small" type="primary" ghost icon={<EditOutlined/>} onClick={() => {
                    router.push(`/app/notes/edit-note/${note._id}`);
                  }}/>
                </div>
              </div>
              <div>Created at {moment(note.createdAt).format("DD/MM/YYYY")}</div>
              <Divider/>
              <div className="convert-markdown">
                <ReactMarkdown>{note.content}</ReactMarkdown>
              </div>
            </Card>
          </div>
        </div>
      </Spin>
    </AppLayout>
  )
}

export const getServerSideProps = async (context) => {
  const res = context;
  const moment = require("moment")
  const auth = require("server/utils/auth");
  const {noteService} = require("server/services");
  const {noteId} = context.query

  let currentDate = moment();
  let start = currentDate.clone().startOf('week').format("x");
  let end = currentDate.clone().endOf('week').format("x");

  let notes = {};
  let note = {};
  try {
    await auth(context, []);
    note = await noteService.getNote({_id: noteId});
    notes = await noteService.queryNotes({
      queryRange: {
        field: "searchDate",
        start: +start,
        end: +end,
      }
    }, {
      limit: 4,
      page: 1,
      sortBy: '-createdAt',
    });
  } catch (err) {
    res.statusCode = 302;
    res.setHeader('Location', '/auth/login');
    return {
      props: {}
    }
  }

  return {
    props: {
      note: JSON.parse(JSON.stringify(note)),
      notes: JSON.parse(JSON.stringify(notes.results)),
      pageInfo: {
        totalResults: notes.totalResults,
        hasNextPage: notes.page < notes.totalPages
      }
    }
  }
}

export default ViewNote
