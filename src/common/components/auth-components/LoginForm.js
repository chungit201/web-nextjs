import React, {useEffect, useState} from 'react';
import {connect} from "react-redux";
import {Button, Form, Input, Divider, Spin, notification} from "antd";
import {MailOutlined, LockOutlined} from '@ant-design/icons';
import PropTypes from 'prop-types';
import {GoogleSVG, FacebookSVG} from 'common/assets/svg/icon';
import CustomIcon from '../util-components/CustomIcon'
import {
  signIn,
  showLoading,
  showAuthMessage,
  hideAuthMessage,
  signInWithGoogle,
  signInWithFacebook
} from 'common/redux/actions/Auth';
import {motion} from "framer-motion"
import ApiService from "../../services/ApiService";
import {authDataStorage} from "../../services/StorageService";
import {useRouter} from "next/router";
import {setUserData} from "../../redux/actions/User";

export const LoginForm = props => {
  const [loading, setLoading] = useState(false);
  const {
    otherSignIn,
    showForgetPassword,
    hideAuthMessage,
    onForgetPasswordClick,
    showLoading,
    signInWithGoogle,
    signInWithFacebook,
    extra,
    signIn,
    token,
    redirect,
    showMessage,
    message,
    allowRedirect
  } = props

  const onLogin = async (values) => {
    setLoading(true)
    ApiService.login(values).then(async (res) => {
      if (res.status === 200) {
        const {access, refresh} = res.data.tokens;
        setUserData(res.data.user)
        await authDataStorage({access, refresh});
        if (typeof window !== "undefined") {
          window.location.replace('/');
        }
      }
    }).catch(err => {
      setLoading(false)
      notification.error({
        message: err.response.data.message
      })

    });

  };

  const onGoogleLogin = () => {
    showLoading()
    signInWithGoogle()
  }

  const onFacebookLogin = () => {
    showLoading()
    signInWithFacebook()
  }

  useEffect(() => {
    if (token !== null && allowRedirect) {
      history.push(redirect)
    }
    if (showMessage) {
      setTimeout(() => {
        hideAuthMessage();
      }, 3000);
    }
  });

  const renderOtherSignIn = (
    <div>
      <Divider>
        <span className="text-muted font-size-base font-weight-normal">or connect with</span>
      </Divider>
      <div className="d-flex justify-content-center">
        <Button
          onClick={() => onGoogleLogin()}
          className="mr-2"
          icon={<CustomIcon svg={GoogleSVG}/>}
        >
          Google
        </Button>
        <Button
          onClick={() => onFacebookLogin()}
          icon={<CustomIcon svg={FacebookSVG}/>}
        >
          Facebook
        </Button>
      </div>
      <div className="text-center">
        <p>Do not have an account yet? <a href="/auth/register-1">Sign Up</a></p>
      </div>
    </div>
  )

  return (
    <>
      <motion.div
        initial={{opacity: 0, marginBottom: 0}}
        animate={{
          opacity: showMessage ? 1 : 0,
          marginBottom: showMessage ? 20 : 0
        }}>
        {/*<Alert type="error" showIcon message={message}></Alert>*/}
      </motion.div>
      <Form
        className="mt-4"
        layout="vertical"
        name="login-form"
        onFinish={onLogin}
      >
        <Form.Item
          name="username"
          label="Username"
          rules={[
            {
              required: true,
              message: 'Please input your username',
            },
          ]}>
          <Input prefix={<MailOutlined className="text-primary"/>}/>
        </Form.Item>
        <Form.Item
          name="password"
          label={
            <div className={`${showForgetPassword ? 'd-flex justify-content-between w-100 align-items-center' : ''}`}>
              <span>Password</span>
              {
                showForgetPassword &&
                <span
                  onClick={() => onForgetPasswordClick}
                  className="cursor-pointer font-size-sm font-weight-normal text-muted"
                >
									Forget Password?
								</span>
              }
            </div>
          }
          rules={[
            {
              required: true,
              message: 'Please input your password',
            }
          ]}
        >
          <Input.Password prefix={<LockOutlined className="text-primary"/>}/>
        </Form.Item>
        <Form.Item>
          <Button loading={loading} className="d-flex justify-content-center" type="primary" htmlType="submit" block>
            <div className="ml-2">Sign In</div>
          </Button>
        </Form.Item>
        {
          otherSignIn ? renderOtherSignIn : null
        }
        {extra}
      </Form>
    </>
  )
}

LoginForm.propTypes = {
  otherSignIn: PropTypes.bool,
  showForgetPassword: PropTypes.bool,
  extra: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element
  ]),
};

LoginForm.defaultProps = {
  otherSignIn: true,
  showForgetPassword: false
};

const mapStateToProps = ({auth}) => {
  const {loading, message, showMessage, token, redirect} = auth;
  return {loading, message, showMessage, token, redirect}
}

const mapDispatchToProps = {
  signIn,
  showAuthMessage,
  showLoading,
  hideAuthMessage,
  signInWithGoogle,
  signInWithFacebook
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginForm)
