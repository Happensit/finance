import { HomePage } from './';

export default {
  path: '/finance',
  childRoutes: [{ path: 'index', component: HomePage, isIndex: true }],
};
