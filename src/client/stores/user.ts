/*
 * Created on Fri Oct 13 2023
 *
 * Copyright (c) 2023 Thomas Zhou
 */

import { invalidateAll } from "$app/navigation";
import { page } from "$app/stores";
import { derived } from "svelte/store";

const { subscribe } = derived(page, ({ data: { user } }): any => user);

export const user = {
    subscribe,
    async logout(): Promise<void> {
        await fetch("/logout");
        await invalidateAll();
        console.log("logout"); // TODO: not working?
    },
};
