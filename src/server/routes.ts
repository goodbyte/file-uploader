import uploadController from './controllers/upload.ts';

export interface Route {
  path: string;
  handler: Record<string, any>;
}

const routes: Route[] = [
  {
    path: '/upload',
    handler: uploadController
  },
];

export default routes;