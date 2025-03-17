import type { Context, MiddlewareHandler } from 'hono';
import { bodyLimit } from 'hono/body-limit';

type Unit = 'B' | 'KB' | 'MB' | 'GB';
type Size = `${ number }${ Unit }`

function limit(size: Size) {
  const maxSize = parseSize(size);

  return function(_target: any, _propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    if (originalMethod) {
      descriptor.value = async function (c: Context, next: MiddlewareHandler) {
        await c.req.parseBody();
        return bodyLimit({
          maxSize,
          onError: (c) => c.text('File too big', 413),
        })(c, originalMethod.bind(this, c, next));
      };
    }

    return descriptor;
  };
}

function parseSize(size: string): number {
  const units: Record<Unit, number> = { B: 1, KB: 1024, MB: 1024 ** 2, GB: 1024 ** 3 };
  const match = size.match(/^(\d+)(B|KB|MB|GB)$/);

  if (!match) throw new Error('Invalid size format');

  const [, value, unit] = match as [string, string, Unit];

  return parseInt(value, 10) * units[unit];
}

export default limit;