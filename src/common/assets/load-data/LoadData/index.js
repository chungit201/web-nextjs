import React, {useEffect, useState} from 'react';
import useLoadUserData from "../LoadUserData";
import {LoadingOutlined} from "@ant-design/icons";
import {useRouter} from "next/router";
import ApiService from "../../../services/ApiService";


const LoadData = ({children}) => {
  const router = useRouter();
  const {user, loading} = useLoadUserData();
  const [deviceToken, setDeviceToken] = useState()
  useEffect(() => {
    setDeviceToken(localStorage.getItem('deviceToken'))
    if (!loading && user === null) {
      router.push('/auth/login');
    }
    if (user) {
      checkDeviceToken(user)
    }
  }, [user, loading]);
  const checkDeviceToken = async (user) => {
    if (deviceToken) {
      if (user.deviceToken !== deviceToken) {
        // await ApiService.updateSelfProfile({
        //   user: user._id,
        //   deviceToken: deviceToken
        // });
      }
    }
  }

  return (<>
    {loading ? <div style={{height: '100vh', display: 'flex'}}>
      <LoadingOutlined style={{fontSize: 30, margin: 'auto'}}/>
    </div> : children}
  </>);
}

export default LoadData;
