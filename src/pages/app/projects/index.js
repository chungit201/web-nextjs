import {AppLayout} from "../../../common/layouts/app-layout";
import Link from "next/link";
import PageHeaderAlt from '../../../common/components/layout-components/PageHeaderAlt'
import Flex from '../../../common/components/shared-components/Flex';
import {Button, Input, Menu, Modal, Tooltip, Tag, Card, Row, Empty, Col, notification, Pagination} from "antd";
import {
  PlusOutlined,
  ExportOutlined,
  UserAddOutlined,
  EditOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined, EyeOutlined
} from "@ant-design/icons";
import EllipsisDropdown from "../../../common/components/shared-components/EllipsisDropdown";
import {COLORS} from "../../../common/constants/ChartConstant";
import {useRouter} from "next/router";
import React, {useEffect, useState} from "react";
import CustomDrawer from "../../../common/components/manage-compoments/CustomDrawer";
import AssignMemberTab from "../../../common/components/manage-compoments/AssignMemberTab";
import ApiService from "../../../common/services/ApiService";
import {useSelector} from "react-redux";
import Utils from "../../../common/utils";


const VIEW_LIST = 'LIST';
const VIEW_GRID = 'GRID';

const ItemAction = ({id, project, setId, removeId, setVisible}) => {
  const user = useSelector(state => state.user)
  const router = useRouter()
  return (

    <EllipsisDropdown
      menu={
        <Menu>
          <Menu.Item key="0" onClick={() => {
            Utils.downloadFile(project, 'json.txt', 'application/json');
          }}>
            <ExportOutlined className="mr-2"/>
            <span>Export JSON file</span>
          </Menu.Item>
          <Menu.Item key="0" onClick={() => {
            Utils.downloadFile(project, 'json.txt', 'application/json');
          }}>
            <EyeOutlined className="mr-2"/>
            <span>Views log</span>
          </Menu.Item>
          <Menu.Item key="1" onClick={() => {
            setVisible(true)
            setId(id)
          }}>
            <UserAddOutlined className="mr-2"/>
            <span>Assign Member</span>
          </Menu.Item>
          {user.role.permissions.includes('MANAGE_ALL_PROJECT') &&
            <>
              <Menu.Item key="2" onClick={() => router.push(`/app/projects/edit/${id}`)}>
                <EditOutlined className="mr-2"/>
                <span>Edit</span>
              </Menu.Item>
              <Menu.Divider/>
              <Menu.Item key="3" onClick={() => removeId(id)}>
                <DeleteOutlined className="mr-2"/>
                <span>Delete Project</span>
              </Menu.Item>
            </>
          }
        </Menu>
      }
    />
  )
}

const ItemHeader = ({name, category, id}) => (
  <div>
    <Link href={`projects/${id}`}>
      <a>
        <h4 className="mb-0">{name}</h4>
      </a>
    </Link>
    <span className="text-muted">{category}</span>
  </div>
)

const ItemInfo = ({attachmentCount, completedTask, totalTask, statusColor, dayleft}) => (
  <Flex alignItems="center">
    <div className="mr-3">
      <Tooltip title="Task Completed">
        <CheckCircleOutlined className="text-muted font-size-md"/>
        <span className="ml-1 text-muted">{completedTask}/{totalTask}</span>
      </Tooltip>
    </div>
    <div>
      <Tag className={statusColor === "none" ? 'bg-gray-lightest' : ''}
           color={statusColor !== "none" ? statusColor : ''}>
        <ClockCircleOutlined/>
        <span className="ml-2 font-weight-semibold">{dayleft} days left</span>
      </Tag>
    </div>
  </Flex>
)

const GridItem = ({project, removeId, setVisible, setId}) => {
  return (
    <Card>
      <Flex alignItems="center" justifyContent="between">
        <ItemHeader
          name={project.name}
          category={project.type}
          id={project._id}
        />
        <ItemAction project={project} id={project._id} setId={setId} removeId={removeId} setVisible={setVisible}/>
      </Flex>
      <div className="mt-2">
        <ItemInfo
          completedTask={project.completedTask || 0}
          totalTask={project.totalTask || 0}
          statusColor={project.statusColor || "green"}
          dayleft={project.dayleft || 0}
        />
      </div>
    </Card>
  )
}

const getProgressStatusColor = progress => {
  if (progress >= 80) {
    return COLORS[1]
  }
  if (progress < 60 && progress > 30) {
    return COLORS[3]
  }
  if (progress < 30) {
    return COLORS[2]
  }
  return COLORS[0]
}

const Projects = (props) => {
  const [view, setView] = useState(VIEW_GRID);
  const [projects, setProjects] = useState(props.projects || {});
  const [visible, setVisible] = useState(false);
  const [id, setId] = useState('');
  const user = useSelector(state => state.user);


  const deleteItem = (id) => {
    Modal.confirm({
      title: "Are you sure to delete this task?",
      content: "This action can not undo, so do you want to delete?",
      onOk() {
        try {
          ApiService.deleteProject(id).then(res => {
            const newListProject = projects.filter(project => project._id !== id)
            setProjects(newListProject)
            notification.success({
              message: res.data.message
            })
          })
        } catch (err) {
          notification.error({
            message: err?.message ?? "Some errors occurred"
          })
        }
      },
      onCancel() {
        console.log("cancel")
      }
    })
  }

  const handleChange = async (value) => {
    try {
      await ApiService.getProjects({page: value, limit: 9, sortBy: "-createdAt"})
        .then(res => {
          setProjects(res.data.results)
        })
    } catch (err) {
      notification.error({message: err});
    }
  }

  return (
    <AppLayout>
      {!props.err ? (
        <>
          <PageHeaderAlt className="border-bottom">
            <div className="container-fluid">
              <Flex justifyContent="between" alignItems="center" className="py-4">
                <h2>Projects</h2>
                <div style={{flex: 1, display: 'flex', justifyContent: 'flex-end'}}>
                  <Input.Search
                    placeholder="Input search text" size="medium" style={{width: "40%"}} allowClear
                  />
                  {user.role.permissions.includes('MANAGE_ALL_PROJECT') &&
                    <Link href={"/app/projects/add"}>
                      <a>
                        <Button type="primary" className="ml-2" icon={<PlusOutlined/>}>
                          Add
                        </Button>
                      </a>
                    </Link>
                  }
                </div>
              </Flex>
            </div>
          </PageHeaderAlt>
          <div className={`my-4 ${view === VIEW_LIST ? 'container' : 'container-fluid'}`}>
            <Row gutter={16}>
              {projects.length === 0 ?
                <Empty style={{flex: 1, display: 'block'}}/> : projects.map(project => (
                  <Col xs={24} sm={24} lg={8} xl={8} xxl={6} key={project._id}>
                    <GridItem project={project} setId={setId} removeId={id => deleteItem(project._id)}
                              setVisible={setVisible}/>

                  </Col>

                ))
              }

            </Row>
            <div>
              <Pagination style={{float: "right"}} onChange={handleChange} defaultCurrent={1}
                          total={Number(`${props.pageInfo.totalPages}0`)}/>
            </div>
          </div>
          <CustomDrawer title="Assign Member" visible={visible} width={700} onClose={() => {
            setVisible(false)
            setId('');
          }}>
            <AssignMemberTab id={id}/>
          </CustomDrawer>
        </>
      ) : (
        <div>
          <Empty/>
        </div>
      )}
    </AppLayout>
  )
}

export const getServerSideProps = async (ctx) => {
  const res = ctx;
  const auth = require("server/utils/auth");
  const {UserProject} = require("server/models")
  const {projectService} = require("server/services");
  let projects = {};
  try {
    const {user} = await auth(ctx, []);
    const hasPermission = user.role.permissions.includes("MANAGE_ALL_PROJECT") || user.role.permissions.includes("GET_ALL_PROJECT");
    const projectList = (await UserProject.find({user})).map(data => data.project).map(data => data._id);
    projects = await projectService.queryProjects((hasPermission) ? {} : {_id: {$in: projectList}}, {
      page: 1,
      limit: 9,
      sortBy: "-createdAt"
    });
  } catch (err) {
    res.statusCode = 302;
    res.setHeader('Location', '/auth/login');
    return {
      props: {}
    }
  }
  const {results, totalResults, totalPages, page} = projects
  return {
    props: {
      projects: JSON.parse(JSON.stringify(results)),
      pageInfo: {
        totalResults,
        totalPages,
        hasNextPage: page < totalPages
      }
    }
  }
}


export default Projects
