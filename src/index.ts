import app from './server/index.ts';
import { serve } from '@hono/node-server';
import logger from '#utils/logger';
import env from '#utils/env';

serve({
  fetch: app.fetch,
  hostname: env('HOSTNAME', '127.0.0.1'),
  port: env('PORT', 3000),
}, ({ address, port }) => {
  logger.log(`Server is listening on ${ address }:${ port }`);
});