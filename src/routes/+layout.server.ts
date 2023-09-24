import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = ({ locals, depends }) => {
  const user: App.PageData['user'] = locals.user;

  return { user };
};
