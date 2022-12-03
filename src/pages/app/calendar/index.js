import React, {useState, useEffect, useRef} from 'react';
import {
  Calendar,
  Badge,
  Card,
  Row,
  Col,
  Modal,
  Form,
  Input,
  Select,
  TimePicker,
  Button,
  Tooltip,
  notification, Avatar
} from 'antd';
import moment from 'moment';
import {CalendarOutlined, DeleteOutlined} from '@ant-design/icons';
import {AppLayout} from "../../../common/layouts/app-layout";
import ApiService from "../../../common/services/ApiService";
import IntlMessage from "../../../common/components/util-components/IntlMessage";
import Utils from "../../../common/utils";

const {Option} = Select;
const {TextArea} = Input;

// TODO: Load Calendar Data
const CalendarData = [];

const badgeColors = [
  'pink',
  'red',
  'yellow',
  'orange',
  'cyan',
  'green',
  'blue',
  'purple',
  'geekblue',
  'magenta',
  'volcano',
  'gold',
  'lime',
];

const groups = ['individual', 'company', 'development', 'human-resource', 'content-writer', 'tester'];

const initialFormValues = {
  title: '',
  start: moment('00:00:00', 'HH:mm:ss'),
  end: moment('00:00:00', 'HH:mm:ss'),
  bullet: badgeColors[0]
}

const dateFormat = 'DD MMMM'


const AgendaList = props => {
  const [calenderList, setCalenderList] = useState(props.list)


  useEffect(() => {
    setCalenderList(props.list)
  }, [props.list])


  return (
    <div key={moment().format("x")} className="calendar-list">
      {calenderList.map((list, index) => {
        return (
          <div key={index}>
            <h4>
              <CalendarOutlined/>
              <span className="ml-2">{moment(list.day).format("DD MMMM ")}</span>
            </h4>
            {list?.events?.map((eventItem, i) => {
              let color = Utils.getEventColor(eventItem.group);
              return (
                <div key={`${eventItem.slug}-${i}`} className="calendar-list-item">
                  <div className="d-flex">
                    <Badge color={color}/>
                    <div>
                      <h5 className="mb-1">{eventItem.name}</h5>
                      <span className="text-muted">{moment(parseInt(eventItem.startDate)).format("DD-MM-YYYY")}</span>
                    </div>
                  </div>
                  <div className="calendar-list-item-delete" onClick={() => props.onDelete(eventItem._id, list.day)}>
                    <Tooltip title="Delete event">
                      <DeleteOutlined/>
                    </Tooltip>
                  </div>
                </div>
              )
            })
            }
          </div>
        )
      })}
    </div>
  )
}


const EventModal = ({visible, addEvent, cancel}) => {
  const [form] = Form.useForm();
  const [options, setOptions] = useState([]);
  const [isIndividual, setIsIndividual] = useState(null);
  const [validationMessage, setValidationMessage] = useState({})

  const [selectedMembers, setSelectedMembers] = useState([]);
  const searchTimeout = useRef(null);

  const onSubmit = () => {
    form.validateFields().then(res => {
      if (validationMessage.validationStatus !== "error") {
        const values = form.getFieldsValue()
        addEvent(values)
      } else {
        return null;
      }
    }).catch(err => {
      console.log(err)
    })
  }

  const handleSearchUser = async (value) => {
    try {
      await ApiService.getUsers({username: value}, {
        page: 1,
        limit: 10,
        select: "username avatar fullname _id"
      }).then(res => {
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
                  <Avatar src={user.avatar}/>
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

  const handleSelectMember = (value) => {
    setSelectedMembers([...value.map(member => member.value)]);
  }

  const getDisabledHours = () => {
    let hours = [];
    if (form.getFieldValue('startDate')) {
      for (let i = 0; i < form.getFieldValue("startDate").hour(); i++) {
        hours.push(i)
      }
    }
    return hours
  }
  const getDisableMins = () => {
    let mins = [];
    if (form.getFieldValue("start")) {
      for (let i = 0; i <= form.getFieldValue("startDate").minute(); i++) {
        mins.push(i)
      }
    }
    return mins
  }

  const validationEndDate = (value) => {
    if (form.getFieldValue("startDate")) {
      if (form.getFieldValue("startDate").isBefore(value)) {
        return ({
          validationStatus: "success",
          errMsg: null
        })
      } else {
        return ({
          validationStatus: "error",
          errMsg: "End time must be later than start time!"
        })
      }
    }
  }

  const onChangeEndDate = value => {
    setValidationMessage({...validationEndDate(value)})
  }

  return (
    <Modal
      title="New Event"
      visible={visible}
      footer={
        <div style={{textAlign: "right"}}>
          <Button onClick={cancel}>Cancel</Button>
          <Button type="primary" onClick={onSubmit}>Add</Button>
        </div>}
      width={500}
      onCancel={cancel}
      destroyOnClose={true}
      bodyStyle={{
        paddingTop: "8px"
      }}
    >
      <Form
        form={form}

        layout="vertical"
        name="new-event"
        preserve={false}
        onFinish={onSubmit}
      >
        <Form.Item
          name="name" label="Title"
          rules={[{
            required: true,
            message: "Title is required"
          }]}
        >
          <Input placeholder="Enter title..."/>
        </Form.Item>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="startDate" label="Start"
              rules={[{
                required: true,
                message: "Start date is required"
              }]}
            >
              <TimePicker className="w-100" onChange={() => {
                if (form.getFieldValue("endDate")) {
                  setValidationMessage({...validationEndDate(form.getFieldValue("endDate"))})
                }
              }}/>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="endDate" label="End"
              validateStatus={validationMessage?.validationStatus}
              help={validationMessage?.errMsg}
            >
              <TimePicker className="w-100" disabledHours={getDisabledHours} disabledMinutes={getDisableMins}
                          onChange={(value) => onChangeEndDate(value)}/>
            </Form.Item>
          </Col>
        </Row>
        <Form.Item
          name="group" label="Group"
          rules={[{
            required: true,
            message: "Group is required"
          }]}
        >
          <Select placeholder="Select group.." onChange={(value) => {
            if (value === "individual") setIsIndividual(true)
            else setIsIndividual(false)
          }}>
            {
              groups.map(elm => (
                <Select.Option value={elm} key={elm}>
                  <span className="text-capitalize font-weight-semibold">{elm}</span>
                </Select.Option>
              ))
            }
          </Select>
        </Form.Item>
        <Form.Item
          name="description" label="Description"
          rules={[{
            required: true,
            message: "Group is required"
          }]}
        >

          <TextArea placeholder="Enter description..."/>
        </Form.Item>
        {isIndividual && (
          <Form.Item
            name="members" label="Members"
            rules={[{
              required: true,
              message: "Member is required"
            }]}
          >
            <Select
              allowClear
              mode="multiple"
              value={selectedMembers}
              labelInValue
              placeholder="Select users..."
              filterOption={false}
              onSearch={handleChangeValueSearchUser}
              onChange={(value) => handleSelectMember(value, options)}
              style={{width: '100%', minHeight: "inherit"}}
              optionLabelProp="title"
            >
              {options.map(option => (
                <Select.Option key={option.value} value={option.value}
                               title={option.username}>{option.label}</Select.Option>
              ))}
            </Select>
          </Form.Item>
        )}
      </Form>
    </Modal>
  )
}

const CalendarApp = (props) => {
  const [calendarList, setCalendarList] = useState(props.events);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(moment());
  const [option, setOption] = useState("month");

  const cellRender = value => {
    const listData = getListData(value.format((dateFormat)));
    return (
      <ul className="calendar-event">
        {listData.map((item, i) => (
          <li key={`${item.title}-${i}`}>
            <Badge color={item.bullet} text={item.title}/>
          </li>
        ))}
      </ul>
    );
  }

  const getListData = (value) => {
    let listData = [];
    calendarList.forEach(event => {
      const currentDate = event.day;
      const momentValue = moment(value).format("YYYY-MM-DD");
      if (momentValue === currentDate) {
        listData = event.events
      }
    })
    return listData;
  }

  const onSelect = value => {
    setModalVisible(true);
    setSelectedDate(value)
  }

  const onDeleteEvent = (eventId, eventDay) => {
    Modal.confirm({
      title: "Are you sure to delete this event?",
      content: "This action can not undo, do you want to delete?",
      onOk: async () => {
        try {
          const res = await ApiService.deleteEvent(eventId)
          if (res.status === 200) {
            let newCalendar = [...calendarList]
            const index = newCalendar.findIndex(event => event.day === eventDay)
            if (index !== -1) {
              let newEvents = newCalendar[index].events.filter(event => event._id !== eventId);
              if (newEvents.length > 0) {
                newCalendar[index].events = newEvents
              } else {
                newCalendar.splice(index, 1)
              }
            }
            setCalendarList(newCalendar);
            notification.success({
              message: res.data.message
            })
          }
        } catch (err) {
          notification.error({
            message: err?.message ?? "Some errors occurred"
          })
        }
      }
    })
  }

  const onAddEvent = async (values) => {
    const start = moment(`${selectedDate.format("DD-MM-YYYY")} ${values?.startDate.format("HH:mm:ss")}`, "DD-MM-YYYY HH:mm:ss").format("x")
    const end = values.endDate ? moment(`${selectedDate.format("DD-MM-YYYY")} ${values?.endDate.format("HH:mm:ss")}`, "DD-MM-YYYY HH:mm:ss").format("x") : undefined;
    const data = {
      ...values,
      startDate: start,
      endDate: end,
      members: values?.members?.map((member) => member.value) ?? []
    }
    try {
      const res = await ApiService.addEvent(data);
      if (!res.code) {
        const newCalender = [...calendarList];
        const index = newCalender.findIndex(event => event.day === selectedDate.format("YYYY-MM-DD"));
        if (index !== -1) {
          newCalender[index].events.push(res.data.event)
        } else {
          newCalender.push({
            day: selectedDate.format("YYYY-MM-DD"),
            events: [res.data.event]
          })
        }
        setCalendarList(newCalender)
        setOption(null);
        notification.success({
          message: res.data.message
        })
      }
    } catch (err) {
      notification.error({
        message: err
      })
    }

  }

  const onAddEventCancel = () => {
    setModalVisible(false)
  }

  return (
    <Card className="calendar mb-0">
      <Row>
        <Col xs={24} sm={24} md={9} lg={6}>
          <h2 className="mb-4">Agenda</h2>
          <AgendaList
            list={calendarList}
            onDelete={onDeleteEvent}
          />
        </Col>
        <Col xs={24} sm={24} md={15} lg={18}>
          <Calendar
            onSelect={val => onSelect(val)}
            dateCellRender={cellRender}
          />
        </Col>
      </Row>
      <EventModal
        visible={modalVisible}
        addEvent={onAddEvent}
        cancel={onAddEventCancel}
      />
    </Card>
  )
}

export const getServerSideProps = async (context) => {
  const res = context;
  const moment = require("moment")
  const auth = require("server/utils/auth");
  const {eventService} = require("server/services");
  let currentDate = moment();
  let start = currentDate.clone().startOf('date').format("x");
  let end = currentDate.clone().endOf('date').format("x");

  let events = {};
  try {
    const {user} = await auth(context, ["MANAGE_ALL_EVENT"]);
    events = await eventService.queryEvents({
        queryRange: {
          field: "startDate",
          start: +start,
          end: +end,
        }
      }, {
        limit: 8,
        page: 1,
        sortBy: '-createdAt',
      },
      user.role.permissions.includes('MANAGE_ALL_EVENT'),
      user._id);
  } catch (err) {
    res.statusCode = 302;
    res.setHeader('Location', '/auth/login');
    return {
      props: {}
    }
  }

  return {
    props: {
      events: JSON.parse(JSON.stringify(events.results)),
      pageInfo: {
        totalResults: events.totalResults,
        hasNextPage: events.page < events.totalPages
      }
    }
  }
}

CalendarApp.getLayout = (page) => {
  return (
    <AppLayout>
      {page}
    </AppLayout>
  );
};


export default CalendarApp

