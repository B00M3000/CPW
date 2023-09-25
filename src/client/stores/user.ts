import { invalidate } from '$app/navigation';
import { page } from '$app/stores';
import { derived } from 'svelte/store';

const { subscribe } = derived(
  page,
  ({ data: { user } }): any => user,
);

export const user = {
  subscribe,
  async logout(): Promise<void> {
    await fetch('/logout.json');
    await invalidate('app:logout');
  }
};
