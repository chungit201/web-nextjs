import {AppLayout} from "../../../../common/layouts/app-layout";
import {PageHeaderAlt} from "../../../../common/components/layout-components/PageHeaderAlt";
import Flex from "../../../../common/components/shared-components/Flex";
import {Avatar, Button, Card, Col, Dropdown, Menu, Row, Tabs, Tooltip} from "antd";
import {CheckCircleOutlined, EditOutlined, VerticalAlignBottomOutlined} from "@ant-design/icons";
import {useRouter} from "next/router";
import React, {useContext, useEffect, useState} from "react";
import EllipsisDropdown from "../../../../common/components/shared-components/EllipsisDropdown";
import moment from "moment";

import AssigneeAvatar from "../../../../common/components/project-components/assignee-avatar";
import ProjectActivities from "../../../../common/components/project-components/activities";
import ListTag from "../../../../common/components/project-components/list-tag";
import UploadStories from "../../../../common/components/project-components/upload-stories";
import IssueList from "../../../../common/components/project-components/issue-list";

import Scrumboard from "../../../../common/components/project-components/board-components";
import {ScrumboardContext} from "../../../../common/components/project-components/board-components/ScrumboardContext";
import CustomDrawer from "../../../../common/components/manage-compoments/CustomDrawer";
import AssignMemberTab from "../../../../common/components/manage-compoments/AssignMemberTab";


const {SubMenu} = Menu;

const ViewProject = ({project}) => {
  const {
    updateModalMode,
    updateModal,
  } = useContext(ScrumboardContext);
  const router = useRouter();
  const id = router.query.projectId;
  const [projectInfo, setProjectInfo] = useState({});
  const [drawerMode, setDrawerMode] = useState(false);
  const [members, setMembers] = useState([])


  const updateDrawerMode = (visible) => {
    setDrawerMode(visible)
  }

  const TitleBoard = ({boardInfo}) => {
    return (
      <div><h4>{boardInfo?.name}</h4></div>
    )
  }


  useEffect(() => {
    // const test = projects.filter(x => x.id === id);
    // setProjectInfo(test[0])
  }, [id]);

  const dataBuild = [1,2,4,5,6,7];

  return (
    <AppLayout>
      <PageHeaderAlt className="border-bottom" overlap>
        <div className="container">
          <div className="py-2 mb-4">
            <Flex mobileFlex={false} justifyContent="between" alignItems="center">
              <h2>{project.name}</h2>
              <div>
                <Tooltip title="Export JSON file">
                  <Button
                    className="mr-2"
                    type="default"
                    icon={<VerticalAlignBottomOutlined/>}
                  />
                </Tooltip>
                <Tooltip title="Edit project">
                  <Button
                    type="primary"
                    icon={<EditOutlined/>}
                    onClick={() => router.push(`/app/projects/${id}/edit`)}
                  />
                </Tooltip>
              </div>
            </Flex>
            <span>{project.code}</span>
          </div>
        </div>
      </PageHeaderAlt>
      <div className="container" style={{marginTop: 30}}>
        <Tabs>
          <Tabs.TabPane key={0} tab="Overview">
            <Row gutter={16}>
              <Col xs={24} sm={24} md={9} lg={8} xl={8} xxl={8}>
                <Card>
                  <div className="d-flex justify-content-between">
                    <h4 className="mb-3">{project.name}</h4>
                    <EllipsisDropdown menu={
                      <Menu>
                        <Menu.Item key="edit" onClick={() => {
                          router.push(`/app/projects/${id}/edit`)
                        }}>
                          <span>Edit Project</span>
                        </Menu.Item>
                        <Menu.Item key="Assign member" onClick={() => setDrawerMode(true)}>
                          <span>Assign Member</span>
                        </Menu.Item>
                      </Menu>
                    }/>
                  </div>
                  <div className="mb-3"><strong>Name</strong>: {project.name}</div>
                  <div className="mb-3"><strong>Code</strong>: {project.code}</div>
                  <div className="mb-3"><strong>Create
                    At: </strong>{moment(project.createdAt).format("HH:mm:ss a DD-MM-YYYY")}</div>
                  <div className="d-flex justify-items-center align-items-center"><strong
                    className="mr-2">Member: </strong>
                    <div className="d-flex">
                      {members.length > 0 ? (
                        <>
                          {members.map((member, i) => i < 4 ?
                            <AssigneeAvatar key={member.id} id={member.id}
                                            member={member.user} size={30} chain/> : null)}
                          {members.length > 4 && (
                            <Avatar className="ml-n2" size={30}>
                                                            <span
                                                              className="text-gray font-weight-semibold font-size-base">+{members.length - 4}</span>
                            </Avatar>
                          )}
                        </>
                      ) : (
                        <div>No member</div>
                      )}
                    </div>
                  </div>
                </Card>
              </Col>
              <Col xs={24} sm={24} md={9} lg={16} xl={16} xxl={16}>
                <Card>
                  <ProjectActivities projectId={id} projectInfo={projectInfo}/>
                </Card>
              </Col>
            </Row>
          </Tabs.TabPane>
          <Tabs.TabPane key={10} tab="Deployment">
            <Row gutter={16}>
              <Col span={24}>
                  <div style={{maxHeight:"600px",overflowY:"scroll"}}>
                    {dataBuild.map(item=>{
                      return (
                        <a key={item} href={`/app/projects/${project._id}/views-log`} >
                          <Card style={{marginBottom:"5px"}}>
                            <Row>
                              <Col span={5}>
                                <div>Northstudio-Web78787878</div>
                              </Col>
                              <Col span={3}>
                                <div className="ml-4"><CheckCircleOutlined/> Ready <span style={{color:"#193eee"}}>58s</span></div>
                              </Col>
                              <Col span={10}>
                                <div className="ml-4">Merge branch chungvuong into main update api product detail See merge
                                  request chungit201/apartment-market!23 main
                                </div>
                              </Col>
                              <Col span={6}>
                                <div className="d-flex float-right">
                                  <div className="mr-2 mt-1">{moment("20111031", "YYYYMMDD").fromNow()}</div>
                                  <Avatar size={25} src="" className="mt-1"/>
                                  <EllipsisDropdown menu={
                                    <Menu>
                                      <Menu.Item key="edit" onClick={() => {
                                        router.push(`/app/projects/${id}/edit`)
                                      }}>
                                        <span>1s </span>
                                      </Menu.Item>
                                      <Menu.Item key="Assign member" onClick={() => setDrawerMode(true)}>
                                        <span>2s r</span>
                                      </Menu.Item>
                                    </Menu>
                                  }/>
                                </div>
                              </Col>
                            </Row>
                          </Card>
                        </a>
                      )
                    })}
                  </div>
              </Col>
            </Row>
          </Tabs.TabPane>
          <Tabs.TabPane key={1} tab="Stories">
            <Row gutter={16}>
              <Col xs={24} sm={24} md={9} lg={8} xl={8} xxl={8}>
                <ListTag/>
              </Col>
              <Col xs={24} sm={24} md={15} lg={16} xl={16} xxl={16}>
                <UploadStories/>
              </Col>
            </Row>
          </Tabs.TabPane>
          <Tabs.TabPane key={2} tab="Issues">
            <Card bodyStyle={{paddingTop: 0, paddingBottom: 0}}>
              <IssueList projectId={id}/>
            </Card>
          </Tabs.TabPane>
          <Tabs.TabPane key={3} tab="Project Board">
            <Card>
              <Scrumboard setDrawerMode={setDrawerMode}/>
            </Card>
          </Tabs.TabPane>
        </Tabs>
        <CustomDrawer title="Assign Member" visible={drawerMode} width={700}
                      onClose={() => updateDrawerMode(false)}>
          <AssignMemberTab projectId={id}/>
        </CustomDrawer>
      </div>
    </AppLayout>
  )
}

export const getServerSideProps = async (ctx) => {
  const auth = require("server/utils/auth");
  const {projectService} = require("server/services");
  const {projectId} = ctx.query;
  let project = {};
  try {
    const {user} = await auth(ctx, []);
    project = await projectService.getProject({project: projectId});
  } catch (err) {
    const {status} = err;
    return {
      props: {
        err: true,
        message: err.message
      }
    }
  }

  return {
    props: {
      project: JSON.parse(JSON.stringify(project)),
    }
  }
}

export default ViewProject