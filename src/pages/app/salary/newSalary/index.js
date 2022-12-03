import {Avatar, Button, Form, Input, notification, Select, Spin} from 'antd';
import ApiService from "../../../../common/services/ApiService";
import React, {useEffect, useState} from "react";

const {Option} = Select;


const NewSalary = ({onAdd, id, mode}) => {
  const [options, setOptions] = useState([]);
  const [users, setUsers] = useState([]);
  const [salary, setSalary] = useState({});
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [form] = Form.useForm();

  useEffect(() => {
    handleSearchUser().then(() => {
    })
  }, [])


  const handleSearchUser = async () => {
    try {
      await ApiService.getUsers({page: 1, limit: 1000}).then(res => {
        setUsers(res.data.results);
      }).catch(err => {
        console.log(err)
      })
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    getSalary().then(() => {
    })
  }, [id])


  const getSalary = async () => {
    if (id) {
      setLoading(true)
      try {
        await ApiService.getSalaryId(id).then(res => {
          setSalary(res.data);
          form.setFieldsValue({
            user: res.data.user.fullName,
            slot: res.data.slot,
            bonus: res.data.bonus,
            fine: res.data.fine,
            salary: res.data.salary
          })
        })
        setLoading(false);
      } catch (err) {
        notification.error({message: err})
      }
    }
  }

  const handleSubmit = async (values) => {
    if (mode === "ADD") {
      onAdd(values)
    } else {
      try {
        setSubmitting(true)
        await ApiService.updateSalary(salary._id,{
          user:salary.user._id,
          slot:values.slot,
          bonus:values.bonus,
          fine:values.fine,
          salary:values.salary
        }).then(res=>{
          notification.success({message:res.data.message});
        })
        setSubmitting(false)
      } catch (err) {

      }
    }
  }

  return (
    <Spin spinning={loading}>
      <Form
        layout="vertical"
        form={form}
        onFinish={handleSubmit}>

        {mode === "EDIT" ? (
          <Form.Item label="Name" name="user">
            <Input readOnly/>
          </Form.Item>
        ) : (
          <Form.Item label="Name" name="user">
            <Select
              showSearch
              style={{width: "100%"}}
              placeholder="Search to Select"
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              filterSort={(optionA, optionB) =>
                optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())
              }
            >
              {
                users.map(item => {
                  return (
                    <Option key={item._id} value={item._id}>{item.fullName}</Option>
                  )
                })}
            </Select>
          </Form.Item>
        )}

        <Form.Item label="Working Slot" name="slot">
          <Input/>
        </Form.Item>

        <Form.Item label="Bonuses" name="bonus">
          <Input/>
        </Form.Item>

        <Form.Item label="Monetary fine" name="fine">
          <Input/>
        </Form.Item>

        <Form.Item label="Salary" name="salary">
          <Input/>
        </Form.Item>

        <Button loading={submitting} type="primary" htmlType="submit" style={{width: "100%"}}>Submit</Button>
      </Form>
    </Spin>
  )
}

export default NewSalary