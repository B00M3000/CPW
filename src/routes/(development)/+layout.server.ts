import { NODE_ENV } from "$env/static/private";
import { error } from "@sveltejs/kit";

export async function load() {
    if(NODE_ENV != "development") throw error(404, "Development route can only be accessed on development server.");
}