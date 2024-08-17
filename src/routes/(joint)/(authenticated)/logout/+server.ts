/*
 * Created on Fri Oct 13 2023
 *
 * Copyright (c) 2023 Thomas Zhou
 */

import { json, redirect } from '@sveltejs/kit';

export async function GET({ cookies, setHeaders }) {
  /* @migration task: add path argument */ cookies.delete('session_id')
  redirect(307, '/');
};
