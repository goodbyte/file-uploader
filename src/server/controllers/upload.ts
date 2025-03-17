import type { Context } from 'hono';
import fs from 'node:fs/promises';
import path from 'node:path';
import limit from '#server/decorators/limit';

class UploadController {
  @limit('5MB')
  async post(c: Context) {
    const formData = await c.req.formData();
    const file = formData.get('file') as File;
    const fileExt = path.extname(file.name);

    if (
      !(file.type.match(/image\/.*/) && ['.jpg', '.jpeg', '.png'].includes(fileExt))
    ) {
      return c.text('Invalid file type', 400);
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const uniqueName = Date.now().toString(36);
    const fileName = `${ uniqueName }${ fileExt }`;
    const filePath = path.join('public/uploads', fileName);

    await fs.writeFile(filePath, buffer);

    return c.json({
      message: 'File uploaded successfully',
      url: `/uploads/${ fileName }`,
    });
  }
}

export default new UploadController();