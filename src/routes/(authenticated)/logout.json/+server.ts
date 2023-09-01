import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
export const GET: RequestHandler = ({ cookies }) => {
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
