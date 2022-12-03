import {Button, Tooltip, Modal, Card, Table, Row, Col, notification, Pagination, Spin} from "antd";
import {DeleteOutlined, EditOutlined, EyeOutlined, FileAddOutlined} from "@ant-design/icons";
import React, {useEffect, useState} from "react";
import {useRouter} from "next/router";
import ManageSystem from "../index";
import {useRole, useUser} from "../../../../common/hooks/useRequest";
import ApiService from "../../../../common/services/ApiService";

const {confirm} = Modal;

const RoleList = (props) => {
  const router = useRouter();
  const limit = 10;
  const [page, setPage] = useState(1);
  const [roles, setRoles] = useState(props.roles || [])
  const [pageInfo, setPageInfo] = useState(props.pageInfo || {});
  const [visible, setVisible] = useState(false);
  const [role, setRole] = useState('');
  const {data, loading, error} = useRole({page: page, limit: limit});

  useEffect(() => {
    if (data) {
      const {results, totalResults, page, totalPages} = data.data;
      setRoles(results);
      setPageInfo({
        totalResults: totalResults,
        hasNextPage: page < totalPages
      })
    }
  }, [page, data])

  const columns = [
    {
      title: "Name",
      align: "center",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Slug",
      align: "center",
      dataIndex: "slug",
      key: "slug",
    },
    {
      title: "Action",
      dataIndex: "action",
      align: "center",
      key: "action",
      render: (_, record) => (
        <div className="text-right d-flex justify-content-center">
          <Tooltip title="View">
            <Button type="primary" className="mr-2" icon={<EyeOutlined/>} size="small" onClick={() => {
              setVisible(true);
              setRole(record);
            }}/>
          </Tooltip>
          <Tooltip title="Update">
            <Button type="info" className="mr-2" icon={<EditOutlined/>} size="small" onClick={() => {
              router.push(`/app/manage-system/manage-roles/edit-role/${record._id}`)
            }}/>
          </Tooltip>
          <Tooltip title="Delete">
            <Button type="danger" icon={<DeleteOutlined/>} onClick={() => showDeleteConfirm(record._id)}
                    size="small"/>
          </Tooltip>
        </div>
      )
    }
  ];

  const showDeleteConfirm = (roleId) => {
    return (
      confirm({
        title: 'Are you sure delete this role?',
        content: 'This action can not undo, so do you want to delete?',
        okText: 'Yes',
        okType: 'danger',
        cancelText: 'No',
        onOk: async () => {
          try {
            const res = await ApiService.deleteRole(roleId);
            if (res.status === 200) {
              const newRoles = [...roles].filter(role => role._id !== res.data.role._id);
              setRoles(newRoles);
              notification.success({
                message: res.data.message
              })
            }
          } catch (err) {
            console.log('err', err)
          }
        },
        onCancel() {
        },
      })
    )
  }

  return (
    <ManageSystem>
      <div>
        <div className="mb-3" style={{
          display: "flex",
          direction: "row",
          justifyContent: "space-between"
        }}>
          <Button type="primary" icon={<FileAddOutlined/>} onClick={() => {
            router.push(`/app/manage-system/manage-roles/add-role`)
          }}>
            Add Role
          </Button>
        </div>
        <Card>
          <div className="table-responsive">
            <Spin spinning={loading} tip={"Loading..."}>
              <Table
                rowKey={(record) => record.slug}
                columns={columns}
                dataSource={roles}
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
                }}
              />
            </Spin>
          </div>
          <Modal title="Role information"
                 visible={visible}
                 onCancel={() => {
                   setVisible(false)
                 }}
                 footer={null}
          >
            {
              role !== ''
              ?
                <div>
                  <Row>
                    <Col>
                      <h4>Name</h4>
                      <p>{role.name}</p>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <h4>Permissions</h4>
                      <p>
                        {
                          (role.permissions && role.permissions.length > 0)
                            ?
                            (role.permissions ? role.permissions : []).join(", ")
                            :
                            'No permissions'
                        }
                      </p>
                    </Col>
                  </Row>
                </div>
              : null
            }
          </Modal>
        </Card>
      </div>
    </ManageSystem>
  )
}

export const getServerSideProps = async (context) => {
  const {res} = context;
  const auth = require("server/utils/auth");
  const {roleService} = require("server/services");
  let roles = {};
  try {
    await auth(context, ["MANAGE_ALL_ROLE", "GET_ALL_ROLE"]);
    roles = await roleService.queryRoles({}, {limit: 10, page: 1});

  } catch (err) {
    res.statusCode = 302;
    res.setHeader('Location', '/auth/login');
    return {
      props: {}
    }
  }

  return {
    props: {
      roles: JSON.parse(JSON.stringify(roles.results)),
      pageInfo: {
        totalResults: roles.totalResults,
        hasNextPage: roles.page < roles.totalPages
      }
    }
  }
}

export default RoleList
