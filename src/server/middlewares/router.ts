import { join } from 'node:path/posix';
import { Hono } from 'hono';
import routes from '../routes.ts';
import logger from '#utils/logger';

function getClassInstanceMethodNames(obj: object): string[] {
  const methods = new Set<string>();
  let proto = obj;

  const hasMethod = (obj: object, name: string) => {
    const desc = Object.getOwnPropertyDescriptor(obj, name);
    return typeof desc?.value === 'function';
  };

  while (proto) {
    Object.getOwnPropertyNames(proto)
      .forEach((name) => {
        if (name !== 'constructor' && hasMethod(proto, name)) methods.add(name);
      });
    proto = Object.getPrototypeOf(proto);
  }

  return Array.from(methods);
}

export default function(app: Hono) {
  type Methods = typeof methods[number];

  const methods = ['get', 'post', 'put', 'delete', 'all'] as const;
  const prefix = process.env.PREFIX || '/api';

  const router = new Hono();

  routes
    .forEach((route) => {
      const { path, handler } = route;

      getClassInstanceMethodNames(handler)
        .filter((method) => methods.includes(method as Methods))
        .forEach((method) => {
          router[method as Methods](path, handler[method]);
          logger.log(`${ method.toUpperCase() }\t${ join(prefix, path) }`);
        });
    });

  app.route(prefix, router);
};