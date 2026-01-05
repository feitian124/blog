/// <reference types="astro/client" />

type D1Database = import("@cloudflare/workers-types").D1Database;
type ENV = {
  DB: D1Database;
  MEMO_API_KEY: string;
};

type Runtime = import("@astrojs/cloudflare").Runtime<ENV>;

declare namespace App {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface Locals extends Runtime {}
}
