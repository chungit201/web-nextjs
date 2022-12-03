
export const getData = (key, defaultValue={}) => {
  return new Promise((resolve, reject) => {
    if(typeof window !== "undefined") {
      const data = localStorage.getItem(key);
      if (!data) {
        return resolve(defaultValue)
      } else {
        return resolve(JSON.parse(data))
      }
    }
  })
}

export const setData = (key, data) => {
  return new Promise(resolve => {
    localStorage.setItem(key, data);
    resolve();
  })
}


export const removeData = (key) => {
  return new Promise(resolve => {
    localStorage.removeItem(key);
    resolve();
  })
}

export const authDataStorage = (tokens) => {
  return new Promise(async (resolve) => {
    try {
      const { refresh, access } = tokens;
      if(!refresh) resolve(false);
      await setData('ACCESS_TOKEN', JSON.stringify(access));
      await setData('REFRESH_TOKEN', JSON.stringify(refresh));
      resolve(true);
    } catch(err) {
      resolve(false);
    }
  })
}