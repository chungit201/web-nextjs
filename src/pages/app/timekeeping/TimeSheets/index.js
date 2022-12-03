import {Button, Col, Row, Table, Tooltip} from "antd";
import {EditOutlined} from "@ant-design/icons";
import React from "react";

const TimeSheets = () => {
  const sharedOnCell = (_, index) => {
    if (index === 4) {
      return {colSpan: 0};
    }
  };

  const columns = [
    {
      title: "STT",
      dataIndex: 'index'
    },
    {
      title: 'Name',
      dataIndex: 'name',
      onCell: (_, index) => ({
        colSpan: index < 4 ? 1 : 5,
      }),
    },
    {
      title: 'Position',
      dataIndex: 'position',
    },
    {
      title: 'T2',
      dataIndex: 't2',
      onCell: sharedOnCell,
      render: (record) => (
        <div style={{backgroundColor: "#ffe000", height: "50px"}}>
          <Row className="text-center">
            <Col span={24}>
              <div>{record}</div>
            </Col>
          </Row>
        </div>
      ),
    },
    {
      title: 'T3',
      dataIndex: 't3',
      render: (record) => (
        <div className="text-center" style={{backgroundColor: "#66e86c", height: "50px"}}>
          <div>{record}</div>
        </div>
      ),
    },
    {
      title: 'T4',
      dataIndex: 't4',
      onCell: sharedOnCell,
      render: (record) => (
        <div className="text-center" style={{backgroundColor: "#ffe000", height: "50px"}}>
          <div>{record}</div>
        </div>
      ),
    },
    {
      title: 'T5',
      dataIndex: 't5',
      render: (record) => (
        <div className="text-center" style={{backgroundColor: "#66e86c", height: "50px"}}>
          <div>{record}</div>
        </div>
      ),
    },
    {
      title: 'T6',
      dataIndex: 't6',
      render: (record) => (
        <div className="text-center" style={{backgroundColor: "#66e86c", height: "50px",}}>
          <div>{record}</div>
        </div>
      ),
    },
    {
      title: 'T7',
      dataIndex: 't7',
      render: (record) => (
        <div className="text-center" style={{backgroundColor: "#66e86c", height: "50px"}}>
          <div>
            <span>{record}</span>
          </div>
        </div>
      ),
    },
    {
      title: 'CN',
      dataIndex: 'cn',
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
              router.push(`/app/manage-system/manage-users/edit-user/${record._id}`)
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

  const data = [
    {
      key: '1',
      index: '1',
      name: 'Chung Đẹp trai',
      position: "developer",
      t2: '8:50 18:33',
      t3: '8:30 18:33',
      t4: '8:40 18:33',
      t5: '8:30 18:33',
      t6: '8:30 18:33',
      t7: '8:30 18:33',
    },

  ];
  return (
    <>
      <div className="note d-flex " style={{float: "right"}}>
        <div className="d-flex" style={{paddingRight: "20px"}}>
          <div
            style={{width: "15px", height: "15px", backgroundColor: "#ffe000", borderRadius: "50%", marginTop: "2px"}}/>
          <span className="ml-1">Be late,come back soon</span>
        </div>
        <div className="d-flex">
          <div
            style={{width: "15px", height: "15px", backgroundColor: "#66e86c", borderRadius: "50%", marginTop: "2px"}}/>
          <span className="ml-1">Timekeeping on time</span>
        </div>
      </div>
      <Table columns={columns} dataSource={data} bordered/>

    </>
  )
}

export default TimeSheets