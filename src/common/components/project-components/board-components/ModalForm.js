import React, {useContext, useEffect, useState} from 'react'
import {Badge, Button, Checkbox, Col, DatePicker, Divider, Form, Input, Modal, Row, Select, Tag,} from 'antd';
import {FileTextOutlined, MinusCircleOutlined, PlusOutlined,} from '@ant-design/icons';
import {getLabelsColor, modalModeTypes} from './utils';
import AssigneeAvatar from "../assignee-avatar";
import Editor from "../../shared-components/Editor";
// import {state} from './ScrumboardData';
import moment from 'moment';
import {ScrumboardContext} from "./ScrumboardContext";
import {convertToRaw} from "draft-js";
import {draftToMarkdown} from "markdown-draft-js";


const {Option} = Select;

const memberTagRender = (props) => {
	return (
		<AssigneeAvatar id={props.value} member={props.label.props.member} size={25}/>
	)
}

function labelTagRender(props) {
	const {value} = props;
	return (
		<Tag className="my-1">
			<div className="d-flex align-items-center">
				<Badge color={getLabelsColor(value)}/>
				<span>{value}</span>
			</div>
		</Tag>
	);
}

const getModalTitle = type => {
	switch (type) {
		case modalModeTypes(0):
			return 'New Task';
		case modalModeTypes(2):
			return 'New Board';
		default:
			return;
	}
}

const AddCardForm = ({onSubmit}, listId) => {
	return (
		<Form layout="vertical" name="add-card-ref" onFinish={onSubmit}>
			<Form.Item name="name" label="Task Title" rules={[{required: true, message: "Title is required!"}]}>
				<Input autoComplete="off" placeholder="Enter title..."/>
			</Form.Item>
			<Row gutter={16}>
				<Col xs={24} md={12} lg={12} xxl={12} xl={12}>
					<Form.Item name="startDate" label="Start Date" rules={[{required: true, message: "Start is required!"}]}>
						<DatePicker style={{width: "100%"}}/>
					</Form.Item>
				</Col>
				<Col xs={24} md={12} lg={12} xxl={12} xl={12}>
					<Form.Item name="dueDate" label="Due Date">
						<DatePicker style={{width: "100%"}}/>
					</Form.Item>
				</Col>
			</Row>
			<div style={{textAlign: "end"}}>
				<Button type="primary" htmlType="submit">Add</Button>
			</div>
		</Form>
	)
}

const AddBoard = ({onSubmit}) => {
	return (
		<Form layout="vertical" onFinish={onSubmit}>
			<Form.Item
				name="name"
				label="Name"
			>
				<Input placeholder="Enter task name..."/>
			</Form.Item>
			<div style={{textAlign: "end"}}>
				<Button type="primary" htmlType="submit">Add Board</Button>
			</div>
		</Form>
	)
}

const UpdateCardForm = ({onSubmit, cardData, listId}) => {
	const {members} = useContext(ScrumboardContext)

	const [editorState, setEditorState] = useState(undefined)

	const initialValues = {
		name: cardData?.name,
		users: cardData?.members.map(member => member._id),
		dueDate: cardData?.dueDate ? moment(cardData.dueDate) : "",
		state: cardData?.state,
		description: cardData?.description,
	}

	const submitUpdate = values => {
		onSubmit(values, cardData._id)
	}

	const onEditorStateChange = (value) => {
		setEditorState(value)
	}

	const formatToMarkDown = (value) => {
		const content = value.getCurrentContent();
		const rawObject = convertToRaw(content);
		return draftToMarkdown(rawObject);
	}

	return (
		<Form name="edit-card-ref" layout="vertical" onFinish={submitUpdate} initialValues={initialValues}>
			<Form.Item name="name" className="mb-0">
				<Input className="board-card-modal input"/>
			</Form.Item>
			<Form.Item className="mb-3">
				<p>Board: <span className="font-weight-semibold">{listId}</span></p>
			</Form.Item>
			<Form.Item label="Assigned to" name="users" className="blockform-col col-3">
				<Select
					filterOption={false}
					tagRender={memberTagRender}
					mode="multiple"
					removeIcon={null}
					placeholder="Select member..."
					className="board-card-modal select"
				>
					{
						members.filter(members => members.user._id !== listId).map(member => (
							<Option key={member.id} value={member.user._id}>
								<AssigneeAvatar id={member.user._id} member={member.user} name/>
							</Option>
						))
					}
				</Select>
			</Form.Item>
			<Form.Item label="Due Date" name="dueDate" className="blockform-col col-3">
				<DatePicker placeholder="Due date unset" className="board-card-modal date-picker w-100"
					// format={DATE_FORMAT_DD_MM_YYYY}
				/>
			</Form.Item>
			<Form.Item label="State" name="state" className="blockform-col col-3">
				<Select
					filterOption={false}
					tagRender={labelTagRender}
					removeIcon={null}
					placeholder="None"
					className="board-card-modal select"
				>
					{
						state.map(elm => (
							<Option key={elm.label} value={elm.label.toLowerCase()}>
								<div className="d-flex align-items-center">
									<Badge color={getLabelsColor(elm.label.toLowerCase())}/>
									<span>{elm.label}</span>
								</div>
							</Option>
						))
					}
				</Select>
			</Form.Item>
			<Divider className="mt-0"/>
			<div>
				<div>
					<h4>SubTask</h4>
					<Form.List name="subtasks">
						{(fields, {add, remove}) => (
							<>
								{fields.map(({key, name, fieldKey, ...restField}) => (
									<div
										key={key}
										style={{
										display: "flex",
										alignItem: "center",
										alignBase: "center"
									}}>
										<Form.Item
											{...restField}
											name={[name, 'isDone']}
											fieldKey={[fieldKey, 'isDone']}
										>
											<Checkbox/>
										</Form.Item>
										<Form.Item
											{...restField}
											name={[name, 'subTask']}
											fieldKey={[fieldKey, 'subTask']}
											rules={[{required: true, message: 'Missing subtask'}]}
											style={{flex: 1, margin: "0 8px 24px 8px"}}
										>
											<Input placeholder="Input task name..."/>
										</Form.Item>
										<Form.Item>
											<MinusCircleOutlined onClick={() => remove(name)}/>
										</Form.Item>
									</div>
								))}
								<Form.Item>
									<Button type="dashed" onClick={() => add()} block icon={<PlusOutlined/>}>
										Add Task
									</Button>
								</Form.Item>
							</>
						)}
					</Form.List>
				</div>
			</div>
			<Divider className="mt-0"/>
			<div className="mb-2">
				<div className="d-flex">
					<div className="mr-2 font-size-md">
						<FileTextOutlined/>
					</div>
					<h4>Description</h4>
				</div>
				<Editor
					editorState={editorState}
					toolbarClassName="toolbarClassName"
					wrapperClassName="wrapperClassName"
					editorClassName="editorClassName"
					onEditorStateChange={onEditorStateChange}
					editorStyle={{
						minHeight: "10vh",
						maxHeight: "30vh",
						overflow: "hidden auto"
					}}
				/>
			</div>
			<Form.Item className="text-right mb-0">
				<Button type="primary" htmlType="submit">Change</Button>
			</Form.Item>
		</Form>
	)
}

const ModalForm = ({visible, modalMode, cardData, listId, onClose, onModalSubmit}) => {

	const showClosable = modalMode === modalModeTypes(1) ? false : true
	const modalWidth = modalMode === modalModeTypes(1) ? 800 : 425;
	const {curentList} = useState(ScrumboardContext)

	const submit = (values, mode, taskId) => {
		onModalSubmit(values, mode, taskId)
		onClose()
	};

	return (
		<Modal
			title={getModalTitle(modalMode)}
			visible={visible}
			closable={showClosable}
			footer={null}
			width={modalWidth}
			style={modalMode === modalModeTypes(1) ? {top: 20} : null}
			destroyOnClose
			onCancel={() => onClose()}
		>
			<div style={modalMode === modalModeTypes(1) ? {
				maxHeight: '85vh',
				overflowY: 'auto',
				overflowX: 'hidden'
			} : null}>
				<div className={modalMode === modalModeTypes(1) ? 'mr-2 ml-2' : null}>
					{
						(() => {
							switch (modalMode) {
								case modalModeTypes(0):
									return <AddCardForm listId={listId} onSubmit={values => submit(values, modalModeTypes(0))}/>;
								case modalModeTypes(1):
									return (
										<UpdateCardForm
											cardData={cardData}
											listId={listId}
											onSubmit={(values, taskId) => submit(values, modalModeTypes(1), taskId)}
										/>
									);
								case modalModeTypes(2):
									return <AddBoard onSubmit={values => submit(values, modalModeTypes(2))}/>
								default:
									return null;
							}
						})()
					}
				</div>
			</div>
		</Modal>
	)
}

export default ModalForm
