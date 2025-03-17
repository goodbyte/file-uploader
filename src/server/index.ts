import { Hono } from 'hono';
import { serveStatic } from '@hono/node-server/serve-static';
import fs from 'node:fs';

import logger from './middlewares/logger.ts';
import cors from './middlewares/cors.ts';
import compress from './middlewares/compress.ts';
import router from './middlewares/router.ts';

const app = new Hono();

const middlewares = [
  logger,
  cors,
  compress,
  router,
];

middlewares.forEach((m) => m(app));

app.use('*', serveStatic({ root: './public' }));

fs.mkdirSync('./public/uploads', { recursive: true });

export default app;