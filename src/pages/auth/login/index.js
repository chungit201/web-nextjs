import React, {useEffect} from "react";
import {Card, Row, Col, Image} from "antd";
import AuthLayout from "../../../common/layouts/auth-layout";
import {LoginForm} from "../../../common/components/auth-components/LoginForm";
import {unregisterServiceWorker} from "../../../common/services/configServiceWorker";

const backgroundStyle = {
  backgroundImage: 'url(/img/others/img-17.jpg)',
  backgroundRepeat: 'no-repeat',
  backgroundSize: 'cover'
}

const LoginPage = (props) => {
  // const theme = useSelector(state => state.theme.currentTheme)
  useEffect(()=>{
    unregisterServiceWorker();
  },[])
  return (
    <div className="h-100" style={backgroundStyle}>
      <div className="container d-flex flex-column justify-content-center h-100">
        <Row justify="center">
          <Col xs={20} sm={20} md={20} lg={10} xl={8}>
            <Card>
              <div className="my-4" >
                <div className="text-center">
                  <Image preview={false} className="img-fluid" style={{height:"40px"}} src="/img/logo-internal.png" alt=""/>
                </div>
                <Row justify="center">
                  <Col xs={24} sm={24} md={20} lg={20}>
                    <LoginForm {...props} />
                  </Col>
                </Row>
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  )
};

LoginPage.getLayout = function (page) {
  return (
      <AuthLayout>
        {page}
      </AuthLayout>
  );
}

export default LoginPage;
