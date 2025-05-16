import HomePage from "../pages/home/home-page";
import AboutPage from "../pages/about/about-page";

import LoginPage from "../pages/auth/login/login-page";
import RegisterPage from "../pages/auth/register/register-page";
import AddPage from "../pages/new/add-page";
import BookmarkPage from "../pages/bookmark/bookmark-page";
import NotFoundPage from "../pages/notfound/notfound-page.js";
import { checkAuthenticatedRoute, checkUnauthenticatedRouteOnly } from '../utils/auth';

const routes = {
  "/login": checkUnauthenticatedRouteOnly(new LoginPage()),
  "/register": checkUnauthenticatedRouteOnly(new RegisterPage()),
  
  "/": checkAuthenticatedRoute(new HomePage()),
  "/new": checkAuthenticatedRoute(new AddPage()),
  "/bookmark": checkAuthenticatedRoute(new BookmarkPage()),
  "/about": () => new AboutPage(),
};

export const fallbackRoute = () => new NotFoundPage();

export default routes;
