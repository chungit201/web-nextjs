import React, {useCallback, useEffect, useState} from "react";
import {Button, Card, Checkbox, Col, Divider, Empty, Form, Input, notification, Row, Select, Spin, Tabs} from "antd";
import {MinusCircleOutlined, PlusOutlined} from "@ant-design/icons";
import {AUTO_DEPLOYMENT_SUPPORTS, PROJECT_TYPES} from "../../../configs/ProjectConfig";
import ApiService from "../../../../common/services/ApiService";
import {useRouter} from "next/router";
import * as PropTypes from "prop-types";

const TextArea = Input.TextArea

const defaultProjectOptions = {
  department: "development"
};

const {TabPane} = Tabs;

TabPane.propTypes = {
  tab: PropTypes.string,
  children: PropTypes.node
};
const ProjectEditForm = (props) => {
  const [form] = Form.useForm();
  const [autoDeployEnabled, setAutoDeployEnabled] = useState(false);
  const mode = props?.mode;
  const {project, setProject, projectId} = props;
  const [gitLabInfo, setGitLabInfo] = useState(null);
  const [checking, setChecking] = useState(false);
  const [checkRes, setCheckRes] = useState(false);
  const [loading, setLoading] = useState(false);
  const [projectInfo, setProjectInfo] = useState(null);
  const [option, setOption] = useState('development');
  const [checkGit, setCheckGit] = useState(true);
  const [viewLog, setViewLog] = useState(false);


  useEffect(() => {
    if (mode === 'ADD') {
      form.setFieldsValue({department: 'development'});
    } else {
      setCheckGit(!checkGit)
    }
  }, [mode])

  const getProjectInfo = useCallback(() => {
    setLoading(true)
    ApiService.getProjectInfo(projectId.projectId, {overview: true}).then(res => {
      if (res) {
        setProjectInfo(res.data);
        const gitLabInfoRaw = ApiService.getGitLabInfo(res?.data.gitlabId).then(res => {
          if (!res.code) {
            setGitLabInfo(res.data)
          }
        }).catch(err => {
          console.log("err", err)
        })
        form.setFieldsValue({...res.data, ...res.data.autoDeploy})
        setAutoDeployEnabled(res.data.autoDeploy.enabled);
        setLoading(false)
      }
    }).catch(err => {
      console.log(err);
    })
  }, [projectId])

  useEffect(() => {
    if (projectId && mode !== "ADD") {
      getProjectInfo()
    }
  }, [projectId])


  const onSubmit = (values) => {

    const {name = "unassigned", type = "unassigned", department = "unassigned", code = "unassigned"} = values;
    const {
      domain = "unassigned",
      gitUrl = "unassigned",
      gitlabId = "unassigned",
      nginxSupport = "unassigned",
      nginxConfig = "unassigned",
      branch = "unassigned",
      environmentVariables = []
    } = values;
    const data = {
      name,
      type,
      department,
      code,
      gitlabId,
      autoDeploy: autoDeployEnabled ? {
        enabled: autoDeployEnabled,
        domain,
        gitUrl,
        nginxConfig,
        nginxSupport,
        branch,
        environmentVariables
      } : {}
    }


    try {
      if (mode === "ADD") {
        ApiService.addProject(data).then(res => {
          if (res) {
            notification.success({
              message: res.data.message
            })
            if (res.data.project.autoDeploy.enabled === true) {
              setViewLog(true);
            }
          }
        }).catch(err => {
          console.log(err)
        })
      } else {
        ApiService.updateProject(projectId.projectId, {...data}).then(res => {
          if (res) {
            if (props.onFinish) props.onFinish();
            notification.success({
              message: res.data.message
            });
            if (res.data.project.autoDeploy.enabled === true) {
              setViewLog(true);
            }
          }
        }).catch(err => {
          console.log(err)
        })
      }
    } catch (err) {
      console.log(err)
    }
  }



  return (
    <div>
      <Spin spinning={loading}>
        <Form
          layout="vertical"
          onValuesChange={(value, allValues) => {
            if (value.type && value.type !== "") {
              setAutoDeployEnabled(false);
            }
            setProject({
              ...project,
              ...value,
            })
          }}
          onFinish={onSubmit}
          form={form}
          initialValues={defaultProjectOptions}
        >
          <div style={{
            position: "absolute",
            top: "-90px",
            right: 24
          }}>
            <Button type="primary" htmlType="submit">
              Finish
            </Button>
          </div>
          <div className="container mt-3">
            <Row gutter={16}>
              <Col sm={24} md={24} lg={12} xl={12} xxl={12}>
                <Card title="Require Information">
                  <Form.Item
                    label="Project Name"
                    name="name"
                    rules={[{required: true, message: "Project name is required!"}]}
                  >
                    <Input placeholder="Enter project name..."/>
                  </Form.Item>
                  <Form.Item
                    name="department"
                    label="Department"
                    rules={[{required: true, message: "Department is required!"}]}

                  >
                    <Select onChange={(value) => {
                      if(option !== 'development'){
                        form.setFieldsValue({
                          code: `${value.toUpperCase().replace(" ", "_")}_${new Date().getTime()}`,
                          // autoDeploy: false
                        })
                      }
                      setOption(value);

                    }} placeholder="Select Department">
                      <Select.Option value="development">Development</Select.Option>
                      <Select.Option value="human-resource">Human Resource</Select.Option>
                      <Select.Option value="content-writer">Content Writer</Select.Option>
                      <Select.Option value="tester">Tester</Select.Option>
                    </Select>
                  </Form.Item>

                  {
                    option === 'development' &&
                    <div>
                      <div className="d-flex align-items-center">
                        <Form.Item
                          className="mr-2"
                          style={{flex: 1}}
                          name="gitlabId"
                          label="GitLab ID"
                          rules={[{required: true, message: "GitLab ID is required!"}]}
                        >
                          <Input placeholder="Enter GitLab ID..." className="mr-2"/>
                        </Form.Item>
                        <Form.Item
                          label={" "}
                        >
                          <Button
                            // shape="circle" icon={<SearchOutlined/>}
                            onClick={() => {
                              setChecking(true)
                              setGitLabInfo(null);
                              ApiService.getGitLabInfo(form.getFieldValue("gitlabId")).then(res => {
                                if (!res.code) {
                                  setGitLabInfo(res.data)
                                  form.setFieldsValue({
                                    gitUrl: res.data.gitLabUrl
                                  })
                                  setCheckGit(false);
                                  setCheckRes(true);
                                  setChecking(false)
                                }
                              }).catch(err => {
                              
                                setChecking(false)
                              })
                            }}
                          >Check</Button>
                        </Form.Item>
                      </div>
                      <div>
                        {!checking ? (
                          <>
                            {gitLabInfo ? (
                              <div>
                                <Form.Item
                                  name="gitUrl"
                                  label="Git URL"
                                  rules={[{
                                    required: true,
                                    message: "GitURL is required!"
                                  }]}
                                >
                                  <Input
                                    disabled={gitLabInfo.hasOwnProperty("gitLabUrl")}/>
                                </Form.Item>
                                <Row gutter={16}>
                                  <Col span={24}>
                                    <Form.Item
                                      name="branch"
                                      label="Branch"
                                      rules={[{
                                        required: true,
                                        message: "Branch is required!"
                                      }]}
                                    >
                                      <Select placeholder="Choose branch...">
                                        {gitLabInfo?.branches.map((branch, index) => (
                                          <Select.Option key={index}
                                                         value={branch}>{branch}</Select.Option>
                                        ))}
                                      </Select>
                                    </Form.Item>
                                  </Col>
                                </Row>
                              </div>
                            ) : (
                              <Empty/>
                            )}
                          </>
                        ) : (
                          <div className="text-center">
                            <Spin spinning={checking} tip="Checking..."/>
                          </div>
                        )}

                      </div>
                    </div>
                  }

                  <Row className="mt-4" gutter={16}>
                    <Col span={AUTO_DEPLOYMENT_SUPPORTS.includes(form.getFieldValue("type")) ? 12 : 24}>
                      {project.department === "development" && (
                        <Form.Item
                          name="type"
                          label="Type / Framework"
                          rules={[{required: true, message: "Type is required!"}]}
                        >
                          <Select
                            placeholder="Please select category..."
                            onChange={value => {
                              setAutoDeployEnabled(false);
                              if (value === "reactjs") {
                                form.setFieldsValue({
                                  nginxSupport: true
                                })
                              } else {
                                form.setFieldsValue({
                                  nginxSupport: false
                                })
                              }
                              form.setFieldsValue({
                                code: `${value.toUpperCase().replace(" ", "_")}_${new Date().getTime()}`,
                                autoDeploy: false
                              })
                            }}
                          >
                            {PROJECT_TYPES.map((projectType, index) => (
                              <Select.Option value={projectType.name}
                                             key={index}>{projectType.label}</Select.Option>
                            ))}
                          </Select>
                        </Form.Item>
                      )}
                    </Col>
                    {AUTO_DEPLOYMENT_SUPPORTS.includes(form.getFieldValue("type")) && (
                      <Col span={12}>
                        <Form.Item
                          name="autoDeploy"
                          label="Auto Deployment"
                          valuePropName="checked"
                        >
                          <Checkbox checked={autoDeployEnabled}
                                    onChange={e => setAutoDeployEnabled(e.target.checked)}
                                    disabled={checkGit}>Enable
                            Auto Deploy</Checkbox>
                        </Form.Item>
                      </Col>
                    )}
                  </Row>
                  <Form.Item
                    name="code"
                    label="Code"
                    placeholder="Project code..."
                  >
                    <Input disabled={true}/>
                  </Form.Item>
                </Card>
                <Card title="Deployment Info">

                  {autoDeployEnabled ? (
                    <div>
                      <Form.Item
                        name="nginxSupport"
                        label="Nginx Support"
                        valuePropName="checked"
                      >
                        <Checkbox disabled={form.getFieldValue("type") === "reactjs"}>Nginx
                          Support</Checkbox>
                      </Form.Item>
                      {form.getFieldValue("nginxSupport") && (
                        <div>
                          <Form.Item
                            name="domain"
                            label="Domain"
                            rules={[{required: true, message: "Domain is required!"}]}
                          >
                            <Input placeholder="Enter domain..."/>
                          </Form.Item>
                          <Form.Item
                            name="nginxConfig"
                            label="Nginx Config"
                            rules={[{required: true, message: "Nginx Config is required!"}]}
                          >
                            <TextArea placeholder="Input Nginx Config..."/>
                          </Form.Item>
                        </div>

                      )}
                      {!(form.getFieldValue("type") === "reactjs") && (
                        <Form.List name="environmentVariables">
                          {(fields, {add, remove}) => {
                            return (
                              <div>
                                {fields.map((field, index) => (
                                  <Form.Item
                                    label={index === 0 ? 'Environment Variables' : ''}
                                    key={index}
                                  >
                                    <Row gutter={16}>
                                      <Col span={22}>
                                        <Row gutter={16}>
                                          <Col span={12}>
                                            <Form.Item
                                              name={[index, "key"]}
                                              label="Key"
                                              rules={[{required: true}]}
                                            >
                                              <Input
                                                placeholder="Enter key..."/>
                                            </Form.Item>
                                          </Col>
                                          <Col span={12}>
                                            <Form.Item
                                              name={[index, "value"]}
                                              label="Value"
                                              rules={[{required: true}]}
                                            >
                                              <Input
                                                placeholder="Enter value..."/>
                                            </Form.Item>
                                          </Col>
                                        </Row>
                                        <Divider dashed className={"m-0"}/>
                                      </Col>
                                      <Col span={2} style={{
                                        display: "flex",
                                        alignItems: "center"
                                      }}>
                                        {fields.length > 0 ? (
                                          <MinusCircleOutlined
                                            className="dynamic-delete-button"
                                            onClick={() => {
                                              remove(field.name);
                                            }}
                                          />
                                        ) : null}
                                      </Col>
                                    </Row>
                                  </Form.Item>
                                ))}
                                <Form.Item>
                                  <Button
                                    type="dashed"
                                    className={"mr-2"}
                                    onClick={() => {
                                      add();
                                    }}
                                  >
                                    <PlusOutlined/> Add Environment
                                  </Button>
                                  <Button
                                    type="dashed"
                                  >
                                    <PlusOutlined/> Batch Add Environment Variables
                                  </Button>
                                </Form.Item>
                              </div>
                            );
                          }}
                        </Form.List>
                      )}
                    </div>
                  ) : (
                    <>
                      Deployment information only available if auto deploy is enabled.
                    </>
                  )}
                </Card>
              </Col>
              <Col sm={24} md={24} lg={12} xl={12} xxl={12}>
                <Card title={"Overview"}>
                  <div>
                    <b>Project Name:</b> {form.getFieldValue("name")}
                  </div>
                  <div>
                    <b>Auto Deployment: </b> {autoDeployEnabled ? "Yes" : "No"}
                  </div>
                  <div>
                    <b>Department: </b> {form.getFieldValue("department")}
                  </div>
                </Card>
              </Col>
            </Row>
          </div>
        </Form>
      </Spin>
    </div>
  );
};

export default ProjectEditForm;
