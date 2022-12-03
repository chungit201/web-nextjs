import GlobalLayout from "../common/layouts/global-layout";
import store from "../common/redux/store";
import '../common/styles/feed.css'
import {Provider} from "react-redux";
import {createWrapper} from 'next-redux-wrapper';
import LoadData from "../common/assets/load-data/LoadData";
import Head from "next/head";
import {useEffect} from "react";
import NextNProgress from 'nextjs-progressbar';
import firebase from "../common/firebase";

function MyApp({Component, pageProps}) {
  useEffect(() => {
    getDeviceTokens();
  }, []);

  const getDeviceTokens = async () => {
    try {
      const messaging = firebase.messaging();
      await messaging.requestPermission();
      const token = await messaging.getToken();
      console.log('tokens:', token);
      localStorage.setItem('deviceToken', token)
      return token;
    } catch (error) {
      console.error(error);
    }
  }


  const getLayout = Component.getLayout || ((page) => page)
  const MainComponent = () => getLayout(
      <Component {...pageProps} />
  );
  return (
    <>
      <Head>
        <link rel="stylesheet" href={"/css/index.css"}/>
        <title>NorthStudio :: Internal</title>
      </Head>
      <NextNProgress
        height={4}
      />
      <Provider store={store}>
        <GlobalLayout>
          <LoadData>
            <MainComponent/>
          </LoadData>
        </GlobalLayout>
      </Provider>
    </>
  );
}

const makeStore = () => store;
const wrapper = createWrapper(makeStore);

export default wrapper.withRedux(MyApp);
