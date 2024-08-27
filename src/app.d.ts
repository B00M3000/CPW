/*
 * Created on Fri Oct 13 2023
 *
 * Copyright (c) 2023 Thomas Zhou
 */

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
    namespace App {
        // interface Error {}
        interface Locals {
            user?: User;
        }
        interface PageData {
            user?: User;
        }
        // interface Platform {}
    }
}

interface User {
    _id: string;
    name: string;
    email: string;
    picture: string;
    sessionId: string;
    firstName: string;
    lastName: string;
    accountType: number;
    accessLevel: number;
    adviseeIds: string[];
}

export {};
