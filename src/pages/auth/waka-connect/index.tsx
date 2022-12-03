import React from "react";
import {useRouter} from "next/router";
import axios from "axios";
import {IWakaAuthResponse} from "../../../waka";
import {connectWakaTime} from "../../../server/services/wakatime.service";
import AppLayout from "common/layouts/app-layout";
import { Result, Button } from 'antd';

const WakaConnect = ({authStatus}) => {
  return (
    <div>
      <Result
        status={authStatus}
        title={authStatus === "success" ? "Successfully connected with WakaTime": "Failed to connect with WakaTime"}
        subTitle={authStatus === "success"?
          "You're now able to get benefits from WakaTime." :
          "Please try again later."
        }
        extra={[
          <Button href={"/"} type="primary" key="console">
            Back to Home
          </Button>,
        ]}
      />
    </div>
  )
};

WakaConnect.getLayout = (page) => {
  return (
    <AppLayout>
      {page}
    </AppLayout>
  )
}

export const getServerSideProps = async (ctx) => {
  const auth = require("server/utils/auth");
  const {query} = ctx;
  const code = query.code;
  let authStatus = 'success';
  try {
    const {user} = await auth(ctx, []);
    await connectWakaTime(code, user._id);
  } catch (e) {
    authStatus = 'error';
    console.error(e);
  }

  return {
    props: {
      authStatus
    }
  }
};

export default WakaConnect;
