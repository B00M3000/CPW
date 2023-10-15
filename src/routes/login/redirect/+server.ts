import { error, redirect } from '@sveltejs/kit';
import { UserSchema } from '@/server/mongo/schemas/user';
import { v4 as uuidv4 } from 'uuid';
import { get_tokens, get_user } from '@/server/google';

const absolute = new RegExp('^(?:[a-z+]+:)?//', 'i');

export async function GET({ url, cookies, setHeaders }) {
  const code = url.searchParams.get('code');
  const redirectURL = url.searchParams.get('state');

  if (!code) throw error(400, 'missing code');

  const data = await get_tokens(code);

  if (!data.access_token) throw error(400, { message: 'Invalid Authorization Code\n' + JSON.stringify(data) });

  const { token_type, access_token } = data;

  const google_user = await get_user(token_type, access_token);

  const session_id = uuidv4();

  const userByGoogleId = await UserSchema.findOneAndUpdate(
    {
      $and: [
        { googleId: google_user.id },
        { 
          $or: [
            { schoolId: /T\d+/ },
            { graduationYear: { $exists: true, $gte: new Date().getFullYear() - 1} }
          ]
        }
      ]
    },
    {
      email: google_user.email,
      firstName: google_user.given_name,
      lastName: google_user.family_name,
      name: google_user.name,
      picture: google_user.picture,
      sessionId: session_id
    },
    { new: true }
  );

  if(userByGoogleId) cookies.set('session_id', session_id, { path: '/' })
  else {
    const userByEmail = await UserSchema.findOneAndUpdate(
      {
        $or: [ 
          { 
            email: google_user.email,
            graduationYear: { $exists: false },
            googleId: { $exists: false } 
          }, 
          { 
            email: google_user.email,
            googleId: { $exists: false },
            $and: [ 
              { graduationYear: { $exists: true, $gte: new Date().getFullYear() - 1 } }
            ]
          }
        ]
      }, {
        googleId: google_user.id,
        firstName: google_user.given_name,
        lastName: google_user.family_name,
        name: google_user.name,
        picture: google_user.picture,
        sessionId: session_id
      }
    );

    if(userByEmail) cookies.set('session_id', session_id, { path: '/' })
    else throw error(403, { message: `No user with email ${google_user.email} was found.` })
  }

  throw redirect(307, redirectURL && !absolute.test(redirectURL) ? redirectURL : "/account",)
};
