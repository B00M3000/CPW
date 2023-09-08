import { error, json } from '@sveltejs/kit';
import { UserSchema } from '@/server/mongo/schemas/user';
import type { RequestHandler } from './$types';
import { PUBLIC_GOOGLE_CLIENT_ID, PUBLIC_ORIGIN } from '$env/static/public';
import { GOOGLE_CLIENT_SECRET } from '$env/static/private';
import { v4 as uuidv4 } from 'uuid';

async function get_tokens(code: string) {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const data = new URLSearchParams({
    'client_id': PUBLIC_GOOGLE_CLIENT_ID!,
    'client_secret': GOOGLE_CLIENT_SECRET!,
    'grant_type': 'authorization_code',
    'redirect_uri': `${PUBLIC_ORIGIN}/login/redirect`,
    'code': code
  });

  const response = await fetch('https://accounts.google.com/o/oauth2/token', {
    method: 'POST',
    body: data as never,
  });
  
  return response.json();
}

async function get_user(token_type: unknown, access_token: unknown) {
  const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
    headers: {
      authorization: `${token_type} ${access_token}`,
    },
  });
  const data = await response.json();
  return data;
}

const absolute = new RegExp('^(?:[a-z+]+:)?//', 'i');

export const GET: RequestHandler = async (req) => {
  const code = req.url.searchParams.get('code');
  const redirect = req.url.searchParams.get('state');

  if (!code) throw error(400, 'missing code');

  const data = await get_tokens(code);

  if (!data.access_token) {
    throw error(400, {
        message: 'Invalid Authorization Code',
        data,
      }
    );
  }

  const { token_type, access_token } = data;

  const google_user = await get_user(token_type, access_token);

  const session_id = uuidv4()

  const user = await UserSchema.findOneAndUpdate(
    {
      googleId: google_user.id,
    },
    {
      googleId: google_user.id,
      email: google_user.email,
      firstName: google_user.given_name,
      lastName: google_user.family_name,
      name: google_user.name,
      picture: google_user.picture,
      sessionId: session_id
    },
    {
      upsert: true,
      new: true,
    },
  );

  return json(
    {
      message: 'Redirect to User Dashboard',
    },
    {
      status: 307,
      headers: {
        location: redirect && !absolute.test(redirect) ? redirect : '/',
        'set-cookie': req.cookies.serialize('session_id', session_id, {
          path: '/',
        }),
      },
    },
  );
};
