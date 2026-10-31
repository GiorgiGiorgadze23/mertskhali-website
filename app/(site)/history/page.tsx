export const metadata = { title: "ისტორია" };

const EVENTS = [
  ["1925", "კლუბის დაარსება", "ოზურგეთში იქმნება საფეხბურთო გუნდი — მერცხალი. 2025 წელს კლუბმა 100 წლის იუბილე აღნიშნა."],
  ["1938", "მთავარ ლიგაში", "მეორე დივიზიონში მეორე ადგილი და გადასვლა საბჭოთა საქართველოს ჩემპიონატის მთავარ ლიგაში."],
  ["1958", "პირველი ბრინჯაო", "კლუბი პირველად იღებს ჩემპიონატის ბრინჯაოს მედლებს."],
  ["1982–87", "ოქროს ხანა", "ხანგრძლივი მწვრთნელის, ბახვა გიორგაძის ხელმძღვანელობით გუნდი ხუთ მედალს აგროვებს — კლუბის ისტორიის ყველაზე გამორჩეული პერიოდი."],
  ["1990-იანი", "უმაღლეს ლიგაში", "დამოუკიდებლობის აღდგენის შემდეგ მერცხალი უმაღლეს ლიგაში თამაშობს; ჯამში ოთხი სეზონი ელიტაში."],
  ["2016", "რთული წლები", "2015–16 წლების სეზონის შემდეგ გუნდი ქვედა დივიზიონში ეშვება, კლუბი ფინანსურ სირთულეებს აწყდება."],
  ["2026", "ახალი თავი", "გუნდი ლიგა 4-ში ასპარეზობს, სტადიონს კი კოტე გოგატაძის სახელი ეწოდა."],
];

export default function HistoryPage() {
  return (
    <>
      <section className="hero">
        <div className="inner" style={{ maxWidth: 900, padding: "64px 24px 72px" }}>
          <div className="hero-copy">
            <span className="eyebrow">კლუბის ისტორია</span>
            <h1>საუკუნე გურულ ფეხბურთში</h1>
            <p style={{ maxWidth: "none" }}>
              მერცხალი 1925 წელს დაარსდა ოზურგეთში და მას შემდეგ გურიის ფეხბურთის ერთ-ერთი მთავარი სახეა — საბჭოთა საქართველოს ჩემპიონატიდან უმაღლეს ლიგამდე და გურულ დერბიმდე ლანჩხუთის გურიასთან.
            </p>
          </div>
        </div>
      </section>
      <section className="container section" style={{ maxWidth: 900 }}>
        <ol className="timeline">
          {EVENTS.map(([y, t, d]) => (
            <li key={y}>
              <span className="year">{y}</span>
              <h2 style={{ fontSize: 21 }}>{t}</h2>
              <p style={{ color: "var(--text-2)" }}>{d}</p>
            </li>
          ))}
        </ol>
      </section>
      <section className="container" style={{ paddingBottom: 80 }}>
        <div className="card" style={{ overflow: "hidden", display: "flex", flexWrap: "wrap" }}>
          <div className="ph" style={{ flex: "1 1 420px", minHeight: 300, borderRadius: 0 }}>კოტე გოგატაძის სტადიონი</div>
          <div style={{ flex: "1 1 380px", padding: 36, display: "flex", flexDirection: "column", gap: 14 }}>
            <span className="muted" style={{ fontSize: 13, fontWeight: 700, letterSpacing: ".1em" }}>სტადიონი</span>
            <h2 className="display" style={{ fontSize: 30 }}>კოტე გოგატაძის სახელობის სტადიონი</h2>
            <p style={{ color: "var(--text-2)" }}>
              ყოფილი „მეგობრობა“, 3 500 მაყურებელზე. 2026 წლის მაისში სტადიონს კოტე გოგატაძის სახელი ეწოდა — კაცის, რომელმაც ცხოვრების უდიდესი ნაწილი კლუბს მოთამაშედ, მწვრთნელად და ხელმძღვანელად შესწირა.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
