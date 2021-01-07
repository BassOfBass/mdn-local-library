import fs from "fs/promises";

export async function getCloudTags() {
  const data = await fs.readFile("/json/tags.json");
  const tagList = JSON.parse(data);

  return tagList;
}