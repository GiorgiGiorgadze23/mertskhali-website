# სკ მერცხალი 1925 — iOS & Android app

Expo (React Native) app, one codebase for iPhone and Android. It reads everything from the website
(`https://www.mertskhali1925.com/api/v1/...`), so news you publish in `/admin` appear in the app automatically.

**Tabs:** Home · News (with categories) · Matches & table · Squad · More (language, history, contact).
Georgian/English switch; opens offline with the last loaded data; pull down to refresh.
**Push notifications:** when a news item is published for the first time, every phone with the app gets a notification
(tap → opens the article). Untick "აპლიკაციაში შეტყობინება არ გაიგზავნოს" in the news form to skip it.

---

## 1. One-time setup (Supabase)
Run `../supabase/003_push.sql` in Supabase → SQL Editor (stores phones that want notifications).

## 2. Try it on your phone (free, ~10 min)
You need a free **expo.dev** account.
1. On a computer with Node.js: `cd mobile && npm install`
2. `npx eas-cli@latest login`
3. `npx eas-cli@latest init` → creates the project and writes its ID into `app.json` (commit that change).
4. **Android test app:** `npx eas-cli@latest build -p android --profile preview` → when it finishes you get a link/QR; open it on the phone and install the APK.
5. **iPhone:** testing on iPhone needs an Apple Developer account (see 3) — then `npx eas-cli@latest build -p ios --profile preview` and register your iPhone when asked.

## 3. Publish in the stores
| | Google Play | Apple App Store |
|---|---|---|
| Account | play.google.com/console — $25 once | developer.apple.com — $99 / year |
| As a club (recommended) | organization account, D-U-N-S number needed | organization account, D-U-N-S number needed |
| Review | usually 1–3 days (new personal accounts must first run a 14-day closed test with 12 testers) | usually 1–2 days |

Then:
```bash
npx eas-cli@latest build -p android --profile production
npx eas-cli@latest build -p ios --profile production
npx eas-cli@latest submit -p android
npx eas-cli@latest submit -p ios
```
Store listing needs: app name **Mertskhali** (or "FC Mertskhali 1925"), short description, 2+ phone screenshots,
privacy policy URL (can be a page on the website), and a contact email.

## App IDs
- iOS bundle ID / Android package: `ge.mertskhali.app` (change in `app.json` **before** the first store upload if you prefer another).
- Website address the app reads from: `app.json` → `expo.extra.apiUrl`. Change it when you move to your own domain.
