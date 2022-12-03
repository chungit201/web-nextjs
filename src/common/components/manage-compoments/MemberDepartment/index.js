import {Avatar, Card, Empty} from "antd";
import React, {useEffect, useState} from "react";
import ApiService from "../../../services/ApiService";


const MemberDepartment = (props) => {
  const [member, setMember] = useState([]);
  useEffect(() => {
    getDataUser();
  }, []);

  const getDataUser = async () => {
    props.onloading(true)
    await ApiService.getUserDepartment({department: props.id})
      .then(res => {
        setMember(res.data.results)
      })
    props.onloading(false)
  }

  return (
    <div>
      <div className="member" style={{maxHeight: 300, overflowY: member.length !== 0 ? 'scroll' : ''}}>
        {member.length !== 0 ?
          (
            <>
              {member.map(item => {
                return (
                  <Card key={item._id} className="mt-2" style={{marginBottom: "10px"}}>
                    <div className="d-flex">
                      <div className="mt-1"><Avatar size={30} src={item.user.avatar}/>
                      </div>
                      <div className="ml-2">
                        <div>{item.user.fullName}</div>
                        <span style={{color: "#5859d6"}}>{`@${item.user.username}`}</span>
                      </div>
                    </div>
                  </Card>
                )
              })}
            </>
          ) : (
            <div>
              <Empty style={{marginTop: "50px"}} image={Empty.PRESENTED_IMAGE_SIMPLE}/>
            </div>
          )
        }
      </div>
    </div>
  )
}

export default MemberDepartment