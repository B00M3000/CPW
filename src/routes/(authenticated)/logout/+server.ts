import { json, redirect } from '@sveltejs/kit';

export async function GET({ cookies, setHeaders }) {
  cookies.delete('session_id')
  throw redirect(307, '/');
};
