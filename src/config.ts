export const SITE = {
  website: "https://p2y.top/", // replace this with your deployed domain
  author: "Feitian124",
  profile: "https://github.com/feitian124/blog",
  desc: "Tomorrow will be better.",
  title: "Feitian124's Blog",
  ogImage: "astropaper-og.jpg",
  lightAndDarkMode: true,
  postPerIndex: 4,
  postPerPage: 10,
  scheduledPostMargin: 15 * 60 * 1000, // 15 minutes
  showArchives: true,
  showBackButton: true, // show back button in post detail
  editPost: {
    enabled: true,
    text: "Edit page",
    url: "https://github.com/feitian124/blog/edit/master/",
  },
  dynamicOgImage: false,
  dir: "ltr", // "rtl" | "auto"
  lang: "en", // html lang code. Set this empty and default will be "en"
  timezone: "Asia/Shanghai", // Default global timezone (IANA format) https://en.wikipedia.org/wiki/List_of_tz_database_time_zones
} as const;

// Giscus comment system configuration
// Get these values from https://giscus.app
export const GISCUS = {
  enabled: true,
  repo: "feitian124/blog", // Replace with your GitHub username/repo
  repoId: "MDEwOlJlcG9zaXRvcnk0ODg0NjQ0", // Get from https://giscus.app
  category: "Announcements", // Recommended: "Announcements"
  categoryId: "DIC_kwDOAEqIpM4C0jh4", // Get from https://giscus.app
  mapping: "pathname", // "pathname" | "url" | "title" | "og:title"
  strict: "0", // "0" | "1"
  reactionsEnabled: "1", // "0" | "1"
  emitMetadata: "0", // "0" | "1"
  inputPosition: "top", // "top" | "bottom"
  lightTheme: "light", // Giscus light theme
  darkTheme: "dark", // Giscus dark theme
  lang: "zh-CN", // Language
} as const;
