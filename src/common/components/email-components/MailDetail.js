import React, { Component } from 'react'
import { labels, getFileType } from 'common/components/email-components/MailLabels';
import { Tooltip } from 'antd';
import {
	LeftCircleOutlined,
	StarOutlined,
	DeleteOutlined,
	StarFilled,
	DownloadOutlined
} from '@ant-design/icons';
import AvatarStatus from "common/components/shared-components/AvatarStatus";
import {ReplySVG} from "common/assets/svg/icon";
import CustomIcon from "common/components/util-components/CustomIcon";

const MailDetail = ({email}) => {
	return (
		<div className="mail-detail">
			<div className="d-lg-flex align-items-center justify-content-between">
				<div className="d-flex align-items-center mb-3">
					<div className="font-size-md mr-3" onClick={()=> {

					}}>
						<LeftCircleOutlined className="mail-detail-action-icon font-size-md ml-0" />
					</div>
					<AvatarStatus src={{

					}} name={email.from} subTitle={"To: " + email.recipient}/>
				</div>
				<div className="mail-detail-action mb-3">
					<span className="mr-2 font-size-md">Today</span>
					<Tooltip title="Reply">
						<CustomIcon className="mail-detail-action-icon" svg={ReplySVG} />
					</Tooltip>
					<Tooltip title="Star" onClick={()=>{

					}}>
						<StarFilled className="mail-detail-action-icon star checked" />
						{/*<StarOutlined className="mail-detail-action-icon star" />*/}
					</Tooltip>
					<Tooltip title="Download Attachment"><DownloadOutlined className="mail-detail-action-icon"/></Tooltip>
					<Tooltip title="Delete">
						<DeleteOutlined className="mail-detail-action-icon"/>
					</Tooltip>
				</div>
			</div>
			<div className="mail-detail-content">
				<h3 className="mb-4">{email.subject}</h3>
				<div dangerouslySetInnerHTML={{ __html: email.bodyHTML }} />
				<div className="mail-detail-attactment">
					<div className="mail-detail-attactment-item" key={`attachment-file-0`}>
						<span>sth</span>
						<div className="ml-2">
							<div>filee</div>
							<div className="text-muted font-size-sm">3.5MB</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default MailDetail
