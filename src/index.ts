import { handler } from './interfaces/lambda';
const http = require('http');

const server = http.createServer(async (req: any, res: any) => {
  const url = new URL(req.url || '', `http://${req.headers.host}`);
  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(chunk as Buffer);
  }
  const event = {
    httpMethod: req.method,
    path: url.pathname,
    queryStringParameters: Object.fromEntries(url.searchParams),
    body: Buffer.concat(chunks).toString()
  };
  const result = await handler(event);
  res.statusCode = result.statusCode;
  res.end(result.body);
});

server.listen(3000, () => {
  console.log('Server listening on http://localhost:3000');
});
