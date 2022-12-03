import {PageHeaderAlt} from "../../../common/components/layout-components/PageHeaderAlt";
import Flex from "../../../common/components/shared-components/Flex";
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
  Row,
  Select, Spin,
  Tooltip
} from "antd";
import {AppLayout} from "../../../common/layouts/app-layout";
import {useEffect, useState} from "react";
import moment from "moment"
import {CalendarOutlined, DeleteOutlined, EditOutlined, EyeOutlined} from "@ant-design/icons";
import Link from 'next/link'
import EllipsisDropdown from "../../../common/components/shared-components/EllipsisDropdown";
import {useRouter} from "next/router";
import ApiService from "../../../common/services/ApiService";

const {confirm} = Modal;

// TODO: Load Notes
const notes = [];

const ManageNotes = (props) => {
  const router = useRouter();
  const [option, setOption] = useState("week");
  const [notes, setNotes] = useState(props.notes || []);
  const [currentPage, setCurrentPage] = useState(1);
  const [loadedPage, setLoadedPage] = useState([1]);
  const [total, setTotal] = useState(props.pageInfo.hasNextPage ? 9 : 8);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(moment());

  const getNotes = async (date, option, page) => {
    setLoading(true);
    try {
      let start = moment(date).clone().startOf(option).format("x");
      let end = moment(date).clone().endOf(option).format("x");
      const res = await ApiService.getNotes({
        limit: 8,
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
      if (res.data.results.page < totalPages) setTotal(res.data.results.page * 8 + 8);
      setLoading(false)
    } catch (err) {
      notification.error({
        message: err?.message ?? "Some errors occurred"
      })
    }
  }


  const showDeleteConfirm = (noteId) => {
    return (
      confirm({
        title: 'Are you sure delete this note?',
        content: 'This action can not undo, so do you want to delete?',
        okText: 'Yes',
        okType: 'danger',
        cancelText: 'No',
        onOk: async () => {
          try {
            const res = await ApiService.deleteNote(noteId);
            if (res.status === 200) {
              const newUsers = [...notes].filter(note => note._id !== noteId)
              setNotes(newUsers)
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
          console.log('Cancel');
        },
      })
    )
  }

  return (
    <AppLayout>
      <PageHeaderAlt className="border-bottom">
        <div className="container-fluid">
          <Flex justifyContent="between" alignItems="center" className="py-4">
            <h2>Notes</h2>
            <div style={{flex: 1, display: 'flex', justifyContent: 'flex-end'}}>
              <Input.Search placeholder="Input search text" size="medium" style={{width: "40%"}} allowClear
              />
            </div>
          </Flex>
        </div>
      </PageHeaderAlt>
      <Card className="mt-3">
        <div>
          <div className="mb-3 d-flex justify-content-between">
            <Button type="primary" onClick={() => {
              router.push('/app/notes/add-note')
            }}>Add Note</Button>
            <div>
              <Select
                className="mr-3"
                value={option}
                onChange={(value) => {
                  setOption(value)
                  setTotal(8)
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
                picker={option}
                onChange={(value) => {
                  setSelectedDate(value);
                  setTotal(8)
                  setCurrentPage(1);
                  setLoadedPage([]);
                  getNotes(value,option, 1).then(_ => {
                  })
                }}
              />
            </div>
          </div>
          <Spin spinning={loading} tip='Loading...'>
            {notes.length > 0 ? (
              <Row gutter={16}>
                {notes.slice((currentPage - 1) * 8, currentPage * 8).map((note, index) => {
                  return (
                    <Col xs={12} sm={12} md={12} lg={8} xl={6} xxl={6} key={index}>
                      <Card key={index}>
                        <Flex alignItems="center" justifyContent="between">
                          <Link href={`/app/notes/view-note/${note._id}`}>
                            <a>
                              <div className="mb-2">
                                <h4 className="mb-0 note-title">{note.title}</h4>
                              </div>
                              <Tooltip title="Create At">
                                <CalendarOutlined className="text-muted font-size-md"/>
                                <span className="ml-1 text-muted">{moment(note.createdAt).format("DD-MM-YYYY")}</span>
                              </Tooltip>
                            </a>
                          </Link>
                          <EllipsisDropdown
                            menu={
                              <Menu>
                                <Menu.Item key="0" onClick={() => {
                                  router.push(`/app/notes/view-note/${note._id}`)
                                }}>
                                  <EyeOutlined/>
                                  <span>View</span>
                                </Menu.Item>
                                <Menu.Item key="01" onClick={() => {
                                  router.push(`/app/notes/edit-note/${note._id}`)
                                }
                                }>
                                  <EditOutlined/>
                                  Edit
                                </Menu.Item>
                                <Menu.Item key="3" onClick={() => showDeleteConfirm(note._id)}>
                                  <DeleteOutlined/>
                                  <span>Delete note</span>
                                </Menu.Item>
                              </Menu>
                            }
                          />
                        </Flex>
                        <div className="mt-2">
                          <div>
                            <div className="mr-3">
                              <p className="short-note m-0 ">{note.content}</p>
                            </div>
                          </div>
                        </div>
                      </Card>
                    </Col>
                  )
                })}
              </Row>
            ) : (
              <div>
                <Empty/>
              </div>
            )}
          </Spin>
        </div>
        <div style={{float: "right"}}>
          <Pagination
            pageSize={8}
            current={currentPage}
            total={total}
            onChange={(page) => {
              setCurrentPage(page)
              if (loadedPage.includes(page)) return;
              getNotes(selectedDate, option, page).then(_ => {});
            }}
          />
        </div>
      </Card>
    </AppLayout>
  )
}

export const getServerSideProps = async (context) => {
  const res = context
  const moment = require("moment")
  const auth = require("server/utils/auth");
  const {noteService} = require("server/services");
  let currentDate = moment();
  let start = currentDate.clone().startOf('week').format("x");
  let end = currentDate.clone().endOf('week').format("x");

  let notes = {};
  try {
    await auth(context, []);
    notes = await noteService.queryNotes({
      queryRange: {
        field: "searchDate",
        start: +start,
        end: +end,
      }
    }, {
      limit: 8,
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
      notes: JSON.parse(JSON.stringify(notes.results)),
      pageInfo: {
        totalResults: notes.totalResults,
        hasNextPage: notes.page < notes.totalPages
      }
    }
  }
}

export default ManageNotes
