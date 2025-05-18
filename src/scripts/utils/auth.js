import { getActiveRoute } from '../routes/url-parser';
import { TOKEN_KEY } from '../config';

export function getAccessToken() {
  try {
    const accessToken = localStorage.getItem(TOKEN_KEY);

    if (accessToken === 'null' || accessToken === 'undefined') {
      return null;
    }

    return accessToken;
  } catch (error) {
    console.error('getAccessToken: error:', error);
    return null;
  }
}

export function putAccessToken(token) {
  try {
    localStorage.setItem(TOKEN_KEY, token);
    return true;
  } catch (error) {
    console.error('putAccessToken: error:', error);
    return false;
  }
}

export function removeAccessToken() {
  try {
    localStorage.removeItem(TOKEN_KEY);
    return true;
  } catch (error) {
    console.error('getLogout: error:', error);
    return false;
  }
}

const unauthenticatedRoutesOnly = ['/login', '/register'];

export function checkUnauthenticatedRouteOnly(pageInstance) {
    return () => {
      const url = getActiveRoute();
      const isLogin = !!getAccessToken();
  
      if (unauthenticatedRoutesOnly.includes(url) && isLogin) {
        location.hash = '/';
        return {
          render: () => '',
          afterRender: () => {},
        };
      }
  
      return pageInstance;
    };
  }
  
  export function checkAuthenticatedRoute(pageInstance) {
    return () => {
      const isLogin = !!getAccessToken();
  
      if (!isLogin) {
        location.hash = '/login';
        return {
          render: () => '',
          afterRender: () => {},
        };
      }
  
      return pageInstance;
    };
  }
  

export function getLogout() {
  removeAccessToken();
}
