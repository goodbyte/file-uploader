import type { Hono } from 'hono';
import { logger } from 'hono/logger';

export default function(app: Hono) {
  const isDevelopment = process.env.NODE_END !== 'production';
  if (isDevelopment) app.use(logger());
};