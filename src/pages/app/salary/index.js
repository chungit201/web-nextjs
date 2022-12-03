import {AppLayout} from "../../../common/layouts/app-layout";
import {Button, DatePicker, Drawer, Empty, notification, Space, Table, Tooltip} from "antd";
import {EditOutlined} from "@ant-design/icons";
import React, {useEffect, useState} from "react";
import NewSalary from "./newSalary";
import ApiService from "../../../common/services/ApiService";

const Salary = (props) => {
  const [visible, setVisible] = useState(false);
  const [salary, setSalary] = useState(props.salary || []);
  const [id, setId] = useState();
  const [mode, setMode] = useState("");

  const onClose = () => {
    setVisible(false);
  };

  const sharedOnCell = (_, index) => {
    if (index === 4) {
      return {colSpan: 0};
    }
  };
  const columns = [
    {
      title: 'Name',
      onCell: (_, index) => ({
        colSpan: index < 4 ? 1 : 5,
      }),
      render: (record) => {
        return (
          <div>{record.user.fullName}</div>
        )
      }
    },
    {
      title: 'Department',
      render: (record) => {
        return (
          <div>{record?.user?.department?.name}</div>
        )
      },
      onCell: sharedOnCell,
    },
    {
      title: 'Working Slot (month)',
      dataIndex: 'slot',
    },
    {
      title: "Bonuses",
      render: (record) => {
        return (
          <div>{new Intl.NumberFormat().format(record.bonus)} vnđ</div>
        )
      },
      onCell: sharedOnCell,
    },
    {
      title: 'Monetary fine',
      render: (record) => {
        return (
          <div>{new Intl.NumberFormat().format(record.fine)} vnđ</div>
        )
      },
      onCell: sharedOnCell,
    },
    {
      title: 'Salary',
      render: (record) => {
        return (
          <div>{new Intl.NumberFormat().format(record.salary)} vnđ</div>
        )
      },
      onCell: sharedOnCell,
    },
    {
      title: 'Action',
      dataIndex: '',
      key: 'x',
      render: (record) => (
        <div className="d-flex justify-content-center">
          <Tooltip title="Update">
            <Button className="mr-2" icon={<EditOutlined/>} size="small" onClick={() => {
              setVisible(true)
              setMode("EDIT");
              setId(record._id)
            }}/>
          </Tooltip>
          {/*<Tooltip title="Delete">*/}
          {/*  <Button type="danger" icon={<DeleteOutlined/>} onClick={() => showDeleteConfirm(record._id)}*/}
          {/*          size="small"/>*/}
          {/*</Tooltip>*/}
        </div>
      ),
    }
  ];

  const handleAddSalary = async (values, mode) => {
    try {
      await ApiService.addSalary(values).then((res) => {
        if (res.status === 200) {
          setSalary(state => [...state, res.data.salary]);
          notification.success({message: res.data.message});
        }
      })
    } catch (err) {
      notification.error({message: err});
    }
  }
  function onChange(date, dateString) {
  }

  useEffect(()=>{
    if(props.error){
      notification.error({message:props.error})
    }
  },[])


  return (
    <AppLayout>
      {!props.error ? (
          <div>
            <Drawer
              title="Add new"
              placement={"right"}
              width={400}
              onClose={onClose}
              visible={visible}
              key={"right"}
            >
              <NewSalary id={id} mode={mode} onAdd={handleAddSalary}/>
            </Drawer>
            <div>
              <Button
                onClick={() => {
                  setMode("ADD")
                  setVisible(true)
                }}
              >+Add new</Button>
              <DatePicker className="float-right" onChange={onChange} picker="month"/>
            </div>
            <Table className="mt-2" columns={columns} dataSource={salary} bordered/>
          </div>
        ):(
          <Empty/>
        )}
    </AppLayout>
  )
}

export const getServerSideProps = async (ctx) => {
  const {salaryService} = require("server/services");
  const auth = require("server/utils/auth");
  const {res} = ctx;
  let salary = {}
  try {
    const {user} = await auth(ctx, ["MANAGE_ALL_SALARY", "GET_ALL_SALARY"]);
    salary = await salaryService.querySalary({}, {page: 1, limit: 10, sortBy: "-createdAt"});
    const {results, totalResults, totalPages, page} = salary
    return {
      props: {
        salary: JSON.parse(JSON.stringify(results)),
        pageInfo: {
          totalResults,
          totalPages,
          hasNextPage: page < totalPages
        },

      }
    }
  } catch (err) {
    return {
      props: {
        error: err.message
      }
    }
  }
}

export default Salary
