import { Response, Server } from 'miragejs';
import { sign, verify } from 'jwt-then';

async function checkAuth(): Promise<Response | null> {
  const errorResponse = new Response(401, undefined, {
    message: 'Invalid authentication data. Please try to login again.',
  });
  const tokenCookie = document.cookie
    .split('; ')
    .find((row) => row.startsWith('token'));
  if (!tokenCookie) {
    return errorResponse;
  }
  const token = tokenCookie.split('=')[1];
  try {
    const decoded = await verify(token, 'secret');
    if ((decoded as any)['username'] !== 'test') {
      return errorResponse;
    }
    return null;
  } catch (e) {
    return errorResponse;
  }
}

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
      this.get('/api/auth/login', async (schema, request) => {
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
          const token = await sign(
            {
              username: 'test',
            },
            'secret',
            {
              expiresIn: '30s',
            },
          );
          document.cookie = `token=${token}`;
          return new Response(204);
        }
      });
      this.get('/api/auth/logout', async () => {
        document.cookie = 'token= ; expires = Thu, 01 Jan 1970 00:00:00 GMT';
        return new Response(204);
      });

      this.get('/api/account/alias', async (schema, request) => {
        const authResponse = await checkAuth();
        if (authResponse) {
          return authResponse;
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

      this.post('/api/account/alias', async (schema, request) => {
        const authResponse = await checkAuth();
        if (authResponse) {
          return authResponse;
        }
        const body = JSON.parse(request.requestBody);
        if (aliases.some((alias) => alias.address === body.address)) {
          return new Response(409, undefined, {
            message: `Alias ${body.address} already exists`,
          });
        }
        aliases.push(body);
        return new Response(204);
      });

      this.put('/api/account/alias/:alias', async (schema, request) => {
        const authResponse = await checkAuth();
        if (authResponse) {
          return authResponse;
        }
        if (
          aliases.some((alias) => alias.address === request.params['alias'])
        ) {
          const body = JSON.parse(request.requestBody);
          if (aliases.some((alias) => alias.address === body.address)) {
            return new Response(409, undefined, {
              message: `Alias ${body.address} already exists`,
            });
          }
          aliases = aliases.map((alias) => {
            if (alias.address === request.params['alias']) {
              return { address: body.address };
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

      this.delete('/api/account/alias/:alias', async (schema, request) => {
        const authResponse = await checkAuth();
        if (authResponse) {
          return authResponse;
        }

        if (
          aliases.some((alias) => alias.address === request.params['alias'])
        ) {
          aliases = aliases.filter(
            (alias) => alias.address !== request.params['alias'],
          );
          return new Response(204);
        } else {
          return new Response(404, undefined, {
            message: 'Alias not found.',
          });
        }
      });
    },
  });
}
