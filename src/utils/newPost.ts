/* eslint-disable no-console */
import prompts from "prompts";
import { pinyin } from "pinyin-pro";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const BLOG_DIR = path.join(__dirname, "../data/blog");

interface DateInfo {
  year: string;
  month: string;
  day: string;
  dateStr: string;
}

// Check if string contains Chinese characters
function containsChinese(str: string): boolean {
  return /[\u4e00-\u9fa5]/.test(str);
}

// Convert title to slug
function toSlug(title: string): string {
  let slug: string;

  if (containsChinese(title)) {
    // Convert Chinese to pinyin, keep English as is
    slug = pinyin(title, {
      toneType: "none",
      type: "array",
      nonZh: "consecutive",
    }).join("-");
  } else {
    // Process English directly
    slug = title;
  }

  // Normalize: lowercase, replace spaces and special chars with -, remove extra dashes
  return slug
    .toLowerCase()
    .replace(/[^a-z0-9]+/gi, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-+/g, "-");
}

// Get current date info
function getDateInfo(): DateInfo {
  const now = new Date();
  const year = now.getFullYear().toString();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return { year, month, day, dateStr: `${year}-${month}-${day}` };
}

// Generate frontmatter
function generateFrontmatter(title: string): string {
  const isoDate = new Date().toISOString();
  return `---
title: "${title}"
description: "${title}"
pubDatetime: ${isoDate}
tags: []
---

# ${title}

`;
}

async function main(): Promise<void> {
  // Get title from command line args or prompt
  const args = process.argv.slice(2);
  let title: string;

  if (args.length > 0) {
    // Use command line argument as title
    title = args.join(" ").trim();
  } else {
    // Ask for post title interactively
    const response = await prompts({
      type: "text",
      name: "title",
      message: "Enter post title:",
      validate: (value: string) =>
        value.trim() ? true : "Title cannot be empty",
    });

    if (!response.title) {
      console.log("Post creation cancelled");
      process.exit(0);
    }
    title = (response.title as string).trim();
  }

  const slug = toSlug(title);
  const { year, dateStr } = getDateInfo();

  // Create year folder
  const yearDir = path.join(BLOG_DIR, year);
  if (!fs.existsSync(yearDir)) {
    fs.mkdirSync(yearDir, { recursive: true });
    console.log(`📁 Created folder: ${year}/`);
  }

  // Generate filename and path
  const fileName = `${dateStr}-${slug}.md`;
  const filePath = path.join(yearDir, fileName);

  // Check if file already exists
  if (fs.existsSync(filePath)) {
    console.error(`❌ File already exists: ${filePath}`);
    process.exit(1);
  }

  // Create file
  const content = generateFrontmatter(title);
  fs.writeFileSync(filePath, content, "utf-8");

  console.log(`✅ Post created successfully!`);
  console.log(`📄 File path: src/data/blog/${year}/${fileName}`);
}

main().catch(console.error);
