/*
 * Created on Fri Oct 13 2023
 *
 * Copyright (c) 2023 Thomas Zhou
 */

import { redirect } from '@sveltejs/kit';

export async function GET({ cookies }) {
  cookies.delete('session_id', { path: '/' });
  redirect(307, '/');
};
