import React from 'react'
import { Avatar, Tooltip } from 'antd';
import { labels, membersDetail } from './ScrumboardData';

const createUID = len => {
	const buf = [],
		chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
		charlen = chars.length,
		length = len || 32;

	for (let i = 0; i < length; i++) {
		buf[i] = chars.charAt(Math.floor(Math.random() * charlen));
	}
	return buf.join('');
}

export const modalModeTypes = number => {
	switch (number) {
		case 0:
			return 'ADD_CARD';
		case 1:
			return 'EDIT_CARD';
		case 2:
			return 'ADD_BOARD';
		case 3:
			return 'ADD_COMMON_TASK';
		default:
			return '';
	}
}

export const getLabelsColor = label => {
	if(label) {
		const color = labels.filter(elm => label === elm.label)[0].color
		return color
	}
	return
}

export const getMember = id => {
	if(id) {
		const member = membersDetail.filter(elm => id === elm.id)[0]
		if(member) {
			return <Avatar src={member.img}></Avatar>
		}
	}
	return
}

export const getCover = (id, attachments) => {
	if(id) {
		const cover = attachments.filter(elm => id === elm.id)[0].src
		return cover
	}
	return
}

export const AssigneeAvatar = ({member,chain,size}) => {

		if(member) {
			return (
				<div className={`d-flex ${chain? 'ml-n2': ''}`}> 
					<Tooltip title={name? '' : member.fullName}>
						<Avatar 
							className="cursor-pointer" 
							size={size} 
							src={member.avatar}
							style={chain?{border: '2px solid #fff'}: {}}
						>
						</Avatar>
					</Tooltip>
					{name? <span className="mb-0 ml-2 font-weight-semibold">{member.fullName}</span> : null}
				</div>
			)
		}
	return null
}

export const createCardObject = () => {
	return {
		id: createUID(10),
		name: '',
		description: '',
		cover: '',
		members: [],
		labels: [],
		attachments: [],
		checklists: [],
		comments: [],
		'dueDate': null
	}
}

export const createCommentObject = () => {
	return {
		id: createUID(10),
		name: 'Eileen Horton',
		src: "/img/avatars/thumb-1.jpg",
		message: '',
		date: new Date()
	}
}