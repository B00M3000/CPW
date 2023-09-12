import { error, redirect } from '@sveltejs/kit';
import { UserSchema } from '@/server/mongo/schemas/user';
import { v4 as uuidv4 } from 'uuid';
import { get_tokens, get_user } from '@/server/google';
import { GhostSchema } from '@/server/mongo/schemas/ghost';

const absolute = new RegExp('^(?:[a-z+]+:)?//', 'i');

export async function GET({ url, cookies, setHeaders }) {
  const code = url.searchParams.get('code');
  const redirectURL = url.searchParams.get('state');

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

  const session_id = uuidv4();

  const ghost = await GhostSchema.findOne({ email: google_user.email })

  let accessLevel;
  let accountType;
  if(ghost) {
    if(ghost.accessLevel) accessLevel = ghost.accessLevel
    if(ghost.accountType) accountType = ghost.accountType
    ghost.deleteOne({ email: google_user.email });
  }

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
      sessionId: session_id,
      accessLevel,
      accountType
    },
    {
      upsert: true,
      new: true,
    },
  );

  cookies.set('session_id', session_id, { path: '/' })
  throw redirect(307, redirectURL && !absolute.test(redirectURL) ? redirectURL : "/account",)
};
