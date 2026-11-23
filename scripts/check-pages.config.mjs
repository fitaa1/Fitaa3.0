// fitaacreative.com's settings for the shared page check (scripts/check-pages.mjs, the reference copy).
export default {
  dist: "dist",
  // A visitor in Ghana gets the GHS copy of each priced page (middleware.ts picks it on the host).
  copy: "ghs-gh",
  // Every page a visitor or a lead can be sent to.
  pages: ({ dist, fs, path }) => {
    const list = ["/", "/fully-booked", "/privacy", "/terms"];
    for (const d of fs.readdirSync(path.join(dist, "demo"))) list.push(`/demo/${d}`);
    for (const p of fs.readdirSync(path.join(dist, "preview"))) if (p.endsWith(".html")) list.push(`/preview/${p}`);
    return list;
  },
};
