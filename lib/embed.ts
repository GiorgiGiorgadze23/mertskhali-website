// Turns a Facebook / YouTube link that sits alone on its own line in an article into an embedded video player.

export type Embed = { src: string; vertical: boolean; provider: "facebook" | "youtube" };

const URL_ONLY = /^\s*(https?:\/\/\S+)\s*$/;

function clean(u: URL) {
  for (const k of ["mibextid", "rdid", "share_url", "fbclid", "si"]) u.searchParams.delete(k);
  return u;
}

/** Facebook "share" links (facebook.com/share/v/…, fb.watch/…) point to the real video through a redirect — follow it once. */
async function resolveFacebook(raw: string): Promise<string> {
  if (!/facebook\.com\/share\/|fb\.watch\//.test(raw)) return raw;
  try {
    const r = await fetch(raw, {
      redirect: "manual",
      headers: { "user-agent": "Mozilla/5.0 (compatible; MertskhaliBot/1.0)" },
      next: { revalidate: 60 * 60 * 24 * 7 },
    });
    const loc = r.headers.get("location");
    if (loc && /facebook\.com\/.*(videos\/|watch|reel\/)/.test(loc) && !/login/.test(loc)) return clean(new URL(loc, raw)).toString();
  } catch {}
  return raw;
}

export async function embedFor(line: string): Promise<Embed | null> {
  const m = line.match(URL_ONLY);
  if (!m) return null;
  let url: URL;
  try {
    url = clean(new URL(m[1]));
  } catch {
    return null;
  }
  const host = url.hostname.replace(/^(www|m|web|mobile)\./, "");

  if (host === "youtube.com" || host === "youtu.be") {
    const id = host === "youtu.be" ? url.pathname.slice(1) : url.searchParams.get("v") || url.pathname.match(/\/(shorts|embed|live)\/([\w-]+)/)?.[2];
    if (!id) return null;
    return { provider: "youtube", vertical: url.pathname.startsWith("/shorts/"), src: `https://www.youtube-nocookie.com/embed/${id}` };
  }

  if (host === "facebook.com" || host === "fb.watch") {
    if (!/\/(videos|watch|reel|share\/v|share\/r)\b|^\/?$/.test(url.pathname) && host !== "fb.watch") return null;
    const href = await resolveFacebook(url.toString());
    const vertical = /\/reel\/|\/share\/r\//.test(href);
    return {
      provider: "facebook",
      vertical,
      src: `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(href)}&show_text=false&width=${vertical ? 400 : 734}`,
    };
  }
  return null;
}
