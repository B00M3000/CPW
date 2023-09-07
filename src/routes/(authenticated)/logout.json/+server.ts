import { json } from '@sveltejs/kit';

export async function GET({ cookies }) {
  return json(
    {
      message: 'Logout successful.',
    },
    {
      headers: {
        location: '/user',
        'set-cookie': cookies.serialize('session_id', '', {
          path: '/',
        }),
      },
    },
  );
};
