export type Lang = "ka" | "en";

/** Prefix a site path for the language: ("en", "/news") → "/en/news". */
export const L = (lang: Lang, path: string) => (lang === "en" ? (path === "/" ? "/en" : `/en${path}`) : path);

export const dict = {
  ka: {
    clubFull: "სკ მერცხალი 1925",
    clubShort: "მერცხალი",
    clubSub: "ოზურგეთი · გურია",
    metaTitle: "სკ მერცხალი 1925 — ოზურგეთი",
    metaDesc: "ოზურგეთის მერცხლის ოფიციალური საიტი: სიახლეები, შემადგენლობა, მატჩები და ტურნირის ცხრილი.",
    nav: { home: "მთავარი", news: "სიახლეები", squad: "შემადგენლობა", matches: "მატჩები", history: "ისტორია", gallery: "გალერეა", contact: "კონტაქტი" },
    mainMenu: "მთავარი მენიუ",
    switchTo: "English",
    switchLabel: "Switch to English",
    footerMenu: "ქვედა მენიუ",
    admin: "ადმინისტრატორი",
    address: "კოტე გოგატაძის სტადიონი, ოზურგეთი",
    league: "ლიგა 4",
    season: "სეზონი 2026",
    heroTitle: "ოზურგეთის მერცხალი",
    heroText: "ქართული საფეხბურთო კლუბი გურიიდან, 1925 წლიდან. სახლი - კოტე გოგატაძის სახელობის სტადიონი, ოზურგეთი.",
    fixtures: "მატჩების კალენდარი",
    allNews: "ყველა სიახლე",
    nextMatch: "შემდეგი მატჩი",
    latestNews: "ბოლო სიახლეები",
    newsSoon: "სიახლეები მალე დაემატება.",
    lastResult: "ბოლო შედეგი",
    allResults: "ყველა შედეგი →",
    table: "ცხრილი",
    fullTable: "სრული ცხრილი →",
    home: "შინ",
    away: "გასვლით",
    outcome: { win: "მოგება", loss: "წაგება", draw: "ფრე" },
    facts: [["1925", "დაარსების წელი"], ["3 500", "ადგილი სტადიონზე"], ["4", "სეზონი უმაღლეს ლიგაში"], ["1982–87", "ხუთი მედალი ბახვა გიორგაძესთან"]],
    newsTitle: "სიახლეები",
    all: "ყველა",
    categories: "კატეგორიები",
    pages: "გვერდები",
    noNewsInCat: "ამ კატეგორიაში სიახლე ჯერ არ არის.",
    shareFb: "გაზიარება Facebook-ზე",
    backToNews: "← ყველა სიახლე",
    squadTitle: "შემადგენლობა",
    headCoach: "მთავარი მწვრთნელი",
    coachName: "დავით სურგულაძე",
    groups: { GK: ["მეკარეები", "მეკარე"], DF: ["მცველები", "მცველი"], MF: ["ნახევარმცველები", "ნახევარმცველი"], FW: ["თავდამსხმელები", "თავდამსხმელი"] },
    matchesTitle: "მატჩები",
    matchesFilter: "მატჩების ფილტრი",
    upcoming: "მომავალი",
    results: "შედეგები",
    noMatches: "მატჩები არ არის.",
    leagueTable: "ტურნირის ცხრილი",
    tableHead: { pos: "#", team: "გუნდი", p: "თ", w: "მ", d: "ფ", l: "წ", g: "გ", pts: "ქ" },
    zoneUp: "ლიგა 3-ის საგზური",
    zoneDown: "დაქვეითება რეგიონულ ლიგაში",
    tableLegend: "თ — თამაში · მ — მოგება · ფ — ფრე · წ — წაგება · გ — გოლები · ქ — ქულა",
    source: "წყარო",
    autoUpdated: "ახლდება ავტომატურად",
    historyTitle: "ისტორია",
    historyEyebrow: "კლუბის ისტორია",
    historyHeading: "საუკუნე გურულ ფეხბურთში",
    historyIntro: "მერცხალი 1925 წელს დაარსდა ოზურგეთში და მას შემდეგ გურიის ფეხბურთის ერთ-ერთი მთავარი სახეა — საბჭოთა საქართველოს ჩემპიონატიდან უმაღლეს ლიგამდე და გურულ დერბიმდე ლანჩხუთის გურიასთან.",
    events: [
      ["1925", "კლუბის დაარსება", "ოზურგეთში იქმნება საფეხბურთო გუნდი — მერცხალი. 2025 წელს კლუბმა 100 წლის იუბილე აღნიშნა."],
      ["1938", "მთავარ ლიგაში", "მეორე დივიზიონში მეორე ადგილი და გადასვლა საბჭოთა საქართველოს ჩემპიონატის მთავარ ლიგაში."],
      ["1956", "„კოლმეურნის“ თასი", "2 სექტემბერს, თბილისში, საქართველოს „კოლმეურნის“ თასის ფინალში მახარაძის „კოლმეურნემ“ ქობულეთის „შუქურა“ 1:0 დაამარცხა და საქართველოს „კოლმეურნის“ ჩემპიონი გახდა."],
      ["1958", "პირველი ბრინჯაო", "კლუბი პირველად იღებს ჩემპიონატის ბრინჯაოს მედლებს."],
      ["1982", "თასი და ყველა ტიტული", "4 სექტემბერს, თბილისის „დინამოს“ ცენტრალურ სტადიონზე, საქართველოს თასის ფინალში მახარაძის „მერცხალმა“ თბილისის „ზოვეტი“ 4:1 დაამარცხა. ამ წელს გუნდმა მოიგო ყველაფერი, რაც მოსაგები იყო."],
      ["1982–87", "ოქროს ხანა", "გუნდის უფროსის, ბახვა გიორგაძის ხელმძღვანელობით გუნდი ხუთ მედალს აგროვებს — კლუბის ისტორიის ყველაზე გამორჩეული პერიოდი."],
      ["1987", "საქართველოს ჩემპიონი", "მახარაძის (დღევანდელი ოზურგეთის) „მერცხალი“ საქართველოს ჩემპიონი ხდება."],
      ["1990", "პირველი ეროვნული ჩემპიონატი", "31 მარტს, ოზურგეთის ცენტრალურ სტადიონზე, 5 000 გულშემატკივრის თვალწინ, „მერცხალმა“ ოჩამჩირის „ამირანი“ 1:0 დაამარცხა (ბარამიძე, 84')."],
      ["1990-იანი", "უმაღლეს ლიგაში", "დამოუკიდებლობის აღდგენის შემდეგ მერცხალი უმაღლეს ლიგაში თამაშობს; ჯამში ოთხი სეზონი ელიტაში."],
      ["2016", "რთული წლები", "2015–16 წლების სეზონის შემდეგ გუნდი ქვედა დივიზიონში ეშვება, კლუბი ფინანსურ სირთულეებს აწყდება."],
      ["2026", "ახალი თავი", "გუნდი ლიგა 4-ში ასპარეზობს, სტადიონს კი კოტე გოგატაძის სახელი ეწოდა."],
    ],
    stadiumEyebrow: "სტადიონი",
    stadiumName: "კოტე გოგატაძის სახელობის სტადიონი",
    stadiumText: "ყოფილი „მეგობრობა“, 3 500 მაყურებელზე. 2026 წლის მაისში სტადიონს კოტე გოგატაძის სახელი ეწოდა — კაცის, რომელმაც ცხოვრების უდიდესი ნაწილი კლუბს მოთამაშედ, მწვრთნელად და ხელმძღვანელად შესწირა.",
    galleryTitle: "გალერეა",
    photosSoon: "ფოტოები მალე დაემატება.",
    archiveTitle: "ისტორია ფოტოებში",
    archiveSub: "ოზურგეთის ფეხბურთის ისტორია არქივის ფოტოებში — 1950-იანი წლებიდან 1993 წლამდე.",
    recentPhotos: "ახალი ფოტოები",
    sourceLabel: "წყარო",
    sourceBookTitle: "„მერცხალი“ ისევ მოიყვანს გაზაფხულს",
    sourceBookAuthors: "ალექსანდრე ქურდობაძე, ხარიტონ ჩხატარაშვილი, ნუგზარ ასათიანი",
    sourceBookSeries: "სერია „ოზურგეთის ფეხბურთი — 100“",
    contactTitle: "კონტაქტი",
    addressLabel: "მისამართი",
    phoneLabel: "ტელეფონი",
    emailLabel: "ელფოსტა",
    socialLabel: "სოციალური ქსელი",
    mapTitle: "რუკა — ოზურგეთი",
    writeUs: "მოგვწერეთ",
    form: { name: "სახელი", email: "ელფოსტა", message: "შეტყობინება", send: "გაგზავნა", sending: "იგზავნება…", thanks: "გმადლობთ! შეტყობინება გაიგზავნა.", fill: "შეავსეთ ყველა ველი.", notReady: "ფორმა ჯერ არ არის დაკავშირებული.", failed: "ვერ გაიგზავნა, სცადეთ მოგვიანებით." },
    newsFallback: "სიახლე",
  },
  en: {
    clubFull: "FC Mertskhali 1925",
    clubShort: "Mertskhali",
    clubSub: "Ozurgeti · Guria",
    metaTitle: "FC Mertskhali 1925 — Ozurgeti",
    metaDesc: "Official website of FC Mertskhali Ozurgeti: news, squad, fixtures, results and league table.",
    nav: { home: "Home", news: "News", squad: "Squad", matches: "Matches", history: "History", gallery: "Gallery", contact: "Contact" },
    mainMenu: "Main menu",
    switchTo: "ქართული",
    switchLabel: "ქართულ ვერსიაზე გადასვლა",
    footerMenu: "Footer menu",
    admin: "Admin",
    address: "Kote Gogatadze Stadium, Ozurgeti, Georgia",
    league: "Liga 4",
    season: "Season 2026",
    heroTitle: "Mertskhali Ozurgeti",
    heroText: "Georgian football club from Guria, since 1925. Home ground: Kote Gogatadze Stadium, Ozurgeti.",
    fixtures: "Fixtures",
    allNews: "All news",
    nextMatch: "Next match",
    latestNews: "Latest news",
    newsSoon: "News coming soon.",
    lastResult: "Last result",
    allResults: "All results →",
    table: "table",
    fullTable: "Full table →",
    home: "Home",
    away: "Away",
    outcome: { win: "Win", loss: "Loss", draw: "Draw" },
    facts: [["1925", "Founded"], ["3,500", "Stadium capacity"], ["4", "Seasons in the top flight"], ["1982–87", "Five medals under Bakhva Giorgadze"]],
    newsTitle: "News",
    all: "All",
    categories: "Categories",
    pages: "Pages",
    noNewsInCat: "No news in this category yet.",
    shareFb: "Share on Facebook",
    backToNews: "← All news",
    squadTitle: "Squad",
    headCoach: "Head coach",
    coachName: "Davit Surguladze",
    groups: { GK: ["Goalkeepers", "Goalkeeper"], DF: ["Defenders", "Defender"], MF: ["Midfielders", "Midfielder"], FW: ["Forwards", "Forward"] },
    matchesTitle: "Matches",
    matchesFilter: "Match filter",
    upcoming: "Upcoming",
    results: "Results",
    noMatches: "No matches.",
    leagueTable: "league table",
    tableHead: { pos: "#", team: "Team", p: "P", w: "W", d: "D", l: "L", g: "GF-GA", pts: "Pts" },
    zoneUp: "Promotion to Liga 3",
    zoneDown: "Relegation to the Regional League",
    tableLegend: "P — played · W — won · D — drawn · L — lost · GF-GA — goals · Pts — points",
    source: "Source",
    autoUpdated: "updated automatically",
    historyTitle: "History",
    historyEyebrow: "Club history",
    historyHeading: "A century of football in Guria",
    historyIntro: "Mertskhali was founded in Ozurgeti in 1925 and has been one of the faces of football in Guria ever since — from the Soviet Georgian championship to the top flight and the Gurian derby against Guria Lanchkhuti.",
    events: [
      ["1925", "The club is founded", "A football team is formed in Ozurgeti — Mertskhali (“Swallow”). In 2025 the club celebrated its centenary."],
      ["1938", "Into the top league", "Runners-up in the second division and promotion to the top league of the Soviet Georgian championship."],
      ["1956", "The Kolmeurne Cup", "On 2 September in Tbilisi, Kolmeurne Makharadze beat Shukura Kobuleti 1–0 in the Georgian Kolmeurne Cup final and became Georgian Kolmeurne champions."],
      ["1958", "First bronze", "The club wins championship bronze medals for the first time."],
      ["1982", "The cup and every title", "On 4 September, at Dinamo Central Stadium in Tbilisi, Mertskhali Makharadze beat Zovet Tbilisi 4–1 in the Georgian Cup final. That year the team won everything there was to win."],
      ["1982–87", "The golden era", "Under team chief Bakhva Giorgadze the team collects five medals — the most remarkable period in the club’s history."],
      ["1987", "Georgian champions", "Mertskhali of Makharadze (today’s Ozurgeti) become champions of Georgia."],
      ["1990", "First national championship", "On 31 March, in front of 5,000 fans at Ozurgeti Central Stadium, Mertskhali beat Amirani Ochamchire 1–0 (Baramidze, 84')."],
      ["1990s", "In the top flight", "After Georgia regained independence, Mertskhali played in the Umaglesi Liga — four seasons in the top division in total."],
      ["2016", "Hard years", "After the 2015–16 season the team is relegated and the club faces financial difficulties."],
      ["2026", "A new chapter", "The team competes in Liga 4, and the stadium is named after Kote Gogatadze."],
    ],
    stadiumEyebrow: "Stadium",
    stadiumName: "Kote Gogatadze Stadium",
    stadiumText: "Formerly “Megobroba” (Friendship), 3,500 seats. In May 2026 the stadium was named after Kote Gogatadze, who devoted most of his life to the club as a player, coach and official.",
    galleryTitle: "Gallery",
    photosSoon: "Photos coming soon.",
    archiveTitle: "History in photos",
    archiveSub: "Ozurgeti football history in archive photos — from the 1950s to 1993.",
    recentPhotos: "Recent photos",
    sourceLabel: "Source",
    sourceBookTitle: "“Mertskhali Will Bring Spring Again” (in Georgian)",
    sourceBookAuthors: "Aleksandre Kurdobadze, Khariton Chkhatarashvili, Nugzar Asatiani",
    sourceBookSeries: "Ozurgeti Football — 100",
    contactTitle: "Contact",
    addressLabel: "Address",
    phoneLabel: "Phone",
    emailLabel: "Email",
    socialLabel: "Social media",
    mapTitle: "Map — Ozurgeti",
    writeUs: "Write to us",
    form: { name: "Name", email: "Email", message: "Message", send: "Send", sending: "Sending…", thanks: "Thank you! Your message has been sent.", fill: "Please fill in all fields.", notReady: "The form is not connected yet.", failed: "Could not send, please try again later." },
    newsFallback: "News",
  },
} as const;

export type Dict = (typeof dict)["ka"] | (typeof dict)["en"];
export const t = (lang: Lang): Dict => dict[lang];

// ---------- names & dates for the English version ----------
const TR: Record<string, string> = {
  ა: "a", ბ: "b", გ: "g", დ: "d", ე: "e", ვ: "v", ზ: "z", თ: "t", ი: "i", კ: "k", ლ: "l", მ: "m", ნ: "n", ო: "o", პ: "p", ჟ: "zh",
  რ: "r", ს: "s", ტ: "t", უ: "u", ფ: "p", ქ: "k", ღ: "gh", ყ: "q", შ: "sh", ჩ: "ch", ც: "ts", ძ: "dz", წ: "ts", ჭ: "ch", ხ: "kh", ჯ: "j", ჰ: "h",
};

/** Georgian script → readable Latin, each word capitalised. */
export function translit(s: string) {
  return [...s].map((c) => TR[c] ?? c).join("").replace(/(^|[\s(\-–])([a-z])/g, (_, a, b) => a + b.toUpperCase());
}

const TEAMS: Record<string, string> = {
  "მერცხალი": "Mertskhali", "ვესტ ჯორჯია": "West Georgia", "სამცხე": "Samtskhe", "არაგველები": "Aragvelebi", "სამგურალი 2": "Samgurali 2",
  "ბორჯომი": "Borjomi", "ვიტ ჯორჯია 2": "WIT Georgia 2", "სქური": "Skuri", "ტორპედო 2": "Torpedo Kutaisi 2", "გაგრა 2": "Gagra 2",
  "არაგვი 2": "Aragvi 2", "ალგეთი": "Algeti", "კოლხეთი 1913-2": "Kolkheti 1913-2", "ლოკომოტივი 2": "Lokomotivi Tbilisi 2",
  "მერანი 2": "Merani Martvili 2", "მერანი 2 მრ": "Merani Martvili 2", "ბახმარო": "Bakhmaro",
};

export const teamName = (lang: Lang, name: string) => (lang === "ka" ? name : TEAMS[name] ?? translit(name));
export const placeName = (lang: Lang, s: string | null) => (s == null ? s : lang === "ka" ? s : translit(s));
export const roundName = (lang: Lang, r: string) => (lang === "ka" ? r : r.replace("ტური", "Round"));

const KA_MONTHS = ["იანვარი", "თებერვალი", "მარტი", "აპრილი", "მაისი", "ივნისი", "ივლისი", "აგვისტო", "სექტემბერი", "ოქტომბერი", "ნოემბერი", "დეკემბერი"];
const EN_MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const KA_DAYS: Record<string, string> = { ორშაბათი: "Monday", სამშაბათი: "Tuesday", ოთხშაბათი: "Wednesday", ხუთშაბათი: "Thursday", პარასკევი: "Friday", შაბათი: "Saturday", კვირა: "Sunday", ხუთ: "Thu" };

/** "29 ოქტომბერი" → "29 October" (labels come from GFF in Georgian). */
export function dateLabel(lang: Lang, s: string) {
  if (lang === "ka") return s;
  let out = s;
  KA_MONTHS.forEach((m, i) => (out = out.replace(m, EN_MONTHS[i])));
  for (const [k, v] of Object.entries(KA_DAYS)) out = out.replace(k, v);
  return out;
}

export function formatDate(lang: Lang, iso: string | null) {
  if (!iso) return "";
  const d = new Date(iso);
  return lang === "ka" ? `${d.getUTCDate()} ${KA_MONTHS[d.getUTCMonth()]}, ${d.getUTCFullYear()}` : `${d.getUTCDate()} ${EN_MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

/** News categories are stored in Georgian. */
export const CATEGORY_EN: Record<string, string> = { მატჩი: "Match", კლუბი: "Club", ტრანსფერი: "Transfers", აკადემია: "Academy" };
export const categoryName = (lang: Lang, c: string) => (lang === "ka" ? c : CATEGORY_EN[c] ?? c);
