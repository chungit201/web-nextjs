import React from 'react'
import {Table, Avatar, Badge, Tooltip, Dropdown, Menu, Input} from 'antd';
import {StarOutlined, StarFilled, DeleteOutlined, TagOutlined} from '@ant-design/icons';
import {labels, getLabelColor} from "common/components/email-components/MailLabels";
import md5 from "md5";
import {useRouter} from "next/router";

const MailItem = (props) => {
	const router = useRouter();
  const selectedRowKeys = [];
  const rowSelection = {
    selectedRowKeys,
    // onChange: this.onSelectChange,
  };

  const locale = {
    emptyText: (
      <div className="text-center my-5">
        <img src="/img/others/img-10.png" alt="Add credit card"/>
        <h3 className="mt-3 font-weight-light">There is no mail!</h3>
      </div>
    )
  };

  const tableColumns = [
    {
      title: () => (
        <div className="mail-list-action">
          <div>
            {hasSelected ?
              <div>
                <Dropdown overlay={
                  <Menu>
                    {
                      labels.map(elm => (
                        <Menu.Item
                          key={`key-${elm}`}
                          // onClick={() => {this.massCategorize(elm, this.state.selectedRowKeys)}}
                        >
                          <Badge color={getLabelColor(elm)}/>
                          <span className="text-capitalize">{elm}</span>
                        </Menu.Item>
                      ))
                    }
                  </Menu>}
                >
										<span className="mail-list-action-icon ml-0" onClick={e => e.preventDefault()}>
											<TagOutlined/>
										</span>
                </Dropdown>
                <span className="mail-list-action-icon">
										<Tooltip title="Delete">
											<DeleteOutlined/>
										</Tooltip>
									</span>
                <span className="mail-list-action-icon">
									<Tooltip title="Star">
										<StarOutlined/>
									</Tooltip>
								</span>
              </div>
              :
              null
            }
          </div>
          <div>
            <Input size="small" placeholder="Search"/>
          </div>
        </div>
      ),
      colSpan: 4,
      dataIndex: 'name',
      className: 'mail-list-sender',
      render: (_, elm) => (
        <div className="d-flex align-items-center">
          <div
            onClick={(e) => {
              e.stopPropagation()
            }}
            className={`mail-list-star font-size-md uncheck`}
          >
            <StarFilled/>
          </div>
          <div className="d-flex align-items-center">
            <Avatar src={'https://www.gravatar.com/avatar/' + md5(elm.sender) + '?s=30'} size={30}/>
            <h5 className="mb-0 ml-2">{elm.from.split('<')[0].trim()}</h5>
          </div>
        </div>
      ),
    },
    {
      title: '',
      colSpan: 0,
      className: 'mail-list-content',
      render: (_, elm) => (
        <div className=" mail-list-content-msg">
          <Badge color={getLabelColor(elm.label)}/>
          <span className="font-weight-semibold text-dark ml-1">{elm.subject}</span>
          <span className="mx-2"> - </span>
          <span className="p mb-0">sth</span>
        </div>
      )
    },
    {
      title: '',
      colSpan: 0,
      className: 'mail-list-date',
      render: (_, elm) => (
        <div>{elm.date}</div>
      )
    },
  ];

  const hasSelected = selectedRowKeys.length > 0;

  return (
    <div className="mail-list">
      <Table
        rowSelection={rowSelection}
        columns={tableColumns}
        dataSource={props.emails}
        locale={locale}
        onRow={(elm) => {
        	return {
        		onClick: e => {
        			e.preventDefault()
							router.push('/app/emails/' + elm._id, undefined, {shallow: true});
        		}
        	};
        }}
        rowKey='id'
      />
    </div>
  );
}

export default MailItem
