import { Server, Model, Response } from 'miragejs';

export function makeMockServer({ environment = 'development' } = {}) {
  return new Server({
    environment,
    routes() {
      this.get('/api/token', (schema, request) => {
        if (!('Authentication' in request.requestHeaders)) {
          return new Response(401, undefined, {
            message: 'No authentication data found.',
          });
        }
        const authHeader = new Buffer(
          request.requestHeaders['Authentication'],
          'base64',
        ).toString('ascii');

        const [username, password] = authHeader.split(':');

        if (username !== 'test' && password != 'test') {
          return new Response(401, undefined, {
            message: 'Invalid username or password',
          });
        } else {
          return {
            token: 'testtoken',
          };
        }
      });
    },
  });
}
