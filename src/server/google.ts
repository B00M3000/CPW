/*
 * Created on Fri Oct 13 2023
 *
 * Copyright (c) 2023 Thomas Zhou
 */

import { GOOGLE_CLIENT_SECRET } from "$env/static/private";
import { PUBLIC_GOOGLE_CLIENT_ID, PUBLIC_ORIGIN } from "$env/static/public";

export async function get_tokens(code: string) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const data = new URLSearchParams({
      'client_id': PUBLIC_GOOGLE_CLIENT_ID!,
      'client_secret': GOOGLE_CLIENT_SECRET!,
      'grant_type': 'authorization_code',
      'redirect_uri': new URL(`/login/redirect`, PUBLIC_ORIGIN).toString(),
      'code': code
    });
  
    const response = await fetch('https://accounts.google.com/o/oauth2/token', {
      method: 'POST',
      body: data as never,
    });
    
    return response.json();
  }
  
export async function get_user(token_type: unknown, access_token: unknown) {
    const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        authorization: `${token_type} ${access_token}`,
      },
    });
    const data = await response.json();
    return data;
}