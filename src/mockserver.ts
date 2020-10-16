import { Server, Response } from 'miragejs';

export function makeMockServer({ environment = 'development' } = {}) {
  let aliases = [
    {
      address: 'test1@test.com',
    },
    {
      address: 'test2@test.com',
    },
    {
      address: 'test3@test.com',
    },
    {
      address: 'test4@test.com',
    },
    {
      address: 'test5@test.com',
    },
    {
      address: 'test6@test.com',
    },
  ];
  return new Server({
    environment,
    routes() {
      this.get('/api/token', (schema, request) => {
        if (!('Authorization' in request.requestHeaders)) {
          return new Response(401, undefined, {
            message: 'No authentication data found.',
          });
        }
        const authHeader = new Buffer(
          request.requestHeaders['Authorization'].split(' ')[1],
          'base64',
        ).toString('ascii');

        const [username, password] = authHeader.split(':');

        if (username !== 'test' || password != 'test') {
          return new Response(401, undefined, {
            message: 'Invalid username or password',
          });
        } else {
          return new Response(200, undefined, 'TOKEN');
        }
      });

      this.get('/api/account/alias', (schema, request) => {
        if (request.requestHeaders['Authorization'] != 'Bearer TOKEN') {
          return new Response(401, undefined, {
            message: 'Invalid authentication data. Please try to login again.',
          });
        }
        return aliases.filter((value) => {
          if ('filter' in request.queryParams) {
            const filterRegexp = new RegExp(
              `^.+${request.queryParams.filter}.+$`,
            );
            return filterRegexp.test(value.address);
          }

          return true;
        });
      });

      this.post('/api/account/alias', (schema, request) => {
        if (request.requestHeaders['Authorization'] != 'Bearer TOKEN') {
          return new Response(401, undefined, {
            message: 'Invalid authentication data. Please try to login again.',
          });
        }
        aliases.push(JSON.parse(request.requestBody));
        return new Response(204);
      });

      this.put('/api/account/alias/:alias', (schema, request) => {
        if (request.requestHeaders['Authorization'] != 'Bearer TOKEN') {
          return new Response(401, undefined, {
            message: 'Invalid authentication data. Please try to login again.',
          });
        }
        if (
          aliases.some((alias) => alias.address === request.params['alias'])
        ) {
          aliases = aliases.map((alias) => {
            if (alias.address === request.params['alias']) {
              return { address: JSON.parse(request.requestBody).address };
            }
            return alias;
          });
          return new Response(204);
        } else {
          return new Response(404, undefined, {
            message: 'Alias not found',
          });
        }
      });
    },
  });
}
