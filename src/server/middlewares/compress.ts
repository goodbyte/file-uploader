import type { Hono } from 'hono';
import { compress } from 'hono/compress';

export default function(app: Hono) {
  app.use(compress());
};