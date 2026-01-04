import type { CollectionEntry } from "astro:content";
import { slugifyStr } from "./slugify";
import postFilter from "./postFilter";

const getUniqueTags = (posts: CollectionEntry<"blog">[]) => {
  const filteredPosts = posts.filter(postFilter);

  // 使用 Map 一次遍历完成去重和计数
  const tagMap = new Map<string, { tagName: string; count: number }>();

  for (const post of filteredPosts) {
    for (const tagName of post.data.tags) {
      const tag = slugifyStr(tagName);
      const existing = tagMap.get(tag);
      if (existing) {
        existing.count++;
      } else {
        tagMap.set(tag, { tagName, count: 1 });
      }
    }
  }

  // 转换为数组并排序
  return Array.from(tagMap, ([tag, { tagName, count }]) => ({
    tag,
    tagName,
    count,
  })).sort((a, b) => a.tag.localeCompare(b.tag));
};

export default getUniqueTags;
