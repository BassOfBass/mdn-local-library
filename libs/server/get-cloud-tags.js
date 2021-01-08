import { promises as fs } from "fs";

export async function getCloudTags() {
  const url = new URL("/json/tags.json", import.meta.url)
  const data = await fs.readFile(url);
  const tagList = JSON.parse(data);

  return tagList;
}