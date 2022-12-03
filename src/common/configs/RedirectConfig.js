const RedirectConfig = (code) => {
  switch (code) {
    case 401 : {
      return {
        destination: '/auth/login',
        permanent: false,
      }
    }
    case 403: {
      return {
        destination: '/error/403',
        permanent: false,
      }
    }
  }
}

export default RedirectConfig;