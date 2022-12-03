import React, {useState, useRef} from 'react';
import {Avatar, Select} from 'antd';
import IntlMessage from '../../util-components/IntlMessage';
import {useSelector} from "react-redux";
import ApiService from "../../../services/ApiService";
import Link from 'next/link'

const SearchInput = (props) => {
  const [value, setValue] = useState(null);
  const [options, setOptions] = useState([]);

  const inputRef = useRef(null);
  const user = useSelector(state => state.user);

  const onSelect = () => {
    setValue(null)
    setOptions([])
  };

  const handleSearchUser = async (value) => {
    try {
      await ApiService.getUsers({username: value}, {
        page: 1,
        limit: 10,
        select: "username avatar fullname _id"
      }).then(res => {
        let options = [...res.data.results].map(user => {
          return ({
            value: user._id,
            username: user.username,
            data: user,
            label: (
              <div className="search-list-item" style={{
                display: "flex"
              }}>
                <div className="mr-3">
                  <Avatar src={user.avatar}/>
                </div>
                <div>
                  <div className="font-weight-semibold"><IntlMessage id={`@${user.username}`}/></div>
                  <div className="font-size-sm text-muted">{user?.fullName ?? user.username} </div>
                </div>
              </div>
            )
          })
        })
        setOptions(value ? options : []);
      }).catch(err => {
        console.log(err)
      })
    } catch (err) {
      console.log(err)
    }
  }

  const handleChangeValueSearchUser = async (value) => {
    if (inputRef.current) {
      clearTimeout(inputRef.current);
    }
    inputRef.current = setTimeout(() => {
      handleSearchUser(value);
    }, 400);
  }

  return (
    <Select
      allowClear
      showSearch
      labelInValue
      showArrow={false}
      value={value}
      dropdownClassName="nav-search-dropdown"
      placeholder="Search user..."
      filterOption={false}
      onSearch={handleChangeValueSearchUser}
      onSelect={onSelect}
      style={{width: '310px'}}
    >
      {options.map(option => (
        <Select.Option
          key={option.value}
          value={option.value}
          title={option.username}
        >
          <Link href={
            option.value === user._id
              ? `/app/profile`
              : `/app/profile/${option.value}`

          }>
            <a>
              {option.label}
            </a>
          </Link>
        </Select.Option>
      ))}
    </Select>
  )
}

export default SearchInput
