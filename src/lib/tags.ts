export const tags = new Map<string, string>();

tags.set("10456", "Writing and Literature")
tags.set("19242", "Communications")
tags.set("48624", "Science")
tags.set("2da95", "Law, Government, and Politics")
tags.set("d4bfb", "Arts (studio)")
tags.set("3e182", "Exchanges and Trips")
tags.set("f95ce", "Food")
tags.set("09573", "Computers and Programming")
tags.set("b8e72", "Building and Design")
tags.set("4e92b", "Education, Learning, and Behavior")
tags.set("096ab", "Arts (performing)")
tags.set("d7574", "Law, Government, or Politics")
tags.set("67d2a", "Health")
tags.set("a4b61", "History and Culture")
tags.set("3566e", "Medicine")
tags.set("4ae3f", "Education, learning, and behavior")
tags.set("fe75a", "Retail")
tags.set("0ed82", "Service")
tags.set("498b6", "Veterinary Medicine")
tags.set("fd893", "Mathematics")
tags.set("ea0a1", "Farming")
tags.set("68eef", "Business and Finance")
tags.set("dbc24", "Exchanges and trips")
tags.set("a12c6", "Computers and Design")
tags.set("a3857", "Writing and Culture")
tags.set("e5462", "Athletics")

export function getTagString(id: string): string {
    return tags.get(id) || "Tag not found.";
}


