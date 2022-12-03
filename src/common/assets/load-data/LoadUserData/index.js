import useSWR from 'swr';
import {authDataStorage, getData} from "../../../services/StorageService";
import ApiService from "../../../services/ApiService";
import {setUserData} from "../../../redux/actions/User";

const loadUserData = () => {
  return new Promise(async resolve => {
    try {
      const refreshToken = await getData('REFRESH_TOKEN', null);
      const currentTime = new Date().getTime();
      if(!refreshToken || refreshToken.expires > currentTime) resolve(null);
      const res = await ApiService.refreshToken(refreshToken.token);
      const { user, access, refresh } = res.data;
      await authDataStorage({access, refresh});
      setUserData(user);
      resolve(user);
    }
    catch(err) {
      resolve(null);
    }
  })
}

export const loadData = () => {
  return new Promise(async (resolve, reject) => {
    const user = await loadUserData();
    resolve({
      userData: user,
    })
  })
}

export default function useLoadUserData () {
  const { data, mutate, error } = useSWR("/", loadData);

  const loading = !data && !error;

  return {
    user: data?.userData,
    loading,
  }
}
