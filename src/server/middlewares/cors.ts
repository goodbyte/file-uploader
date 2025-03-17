import type { Hono } from 'hono';
import { cors } from 'hono/cors';

export default function(app: Hono) {
   app.use(cors());
};