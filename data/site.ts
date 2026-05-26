import type { Concert } from "@/types/concert";


export const aboutText =
  "JazzLight je komorní hudební projekt zaměřený na příjemnou, elegantní a posluchačsky vstřícnou hudbu. Repertoár sahá od jazzu přes popové melodie až po známé filmové a muzikálové skladby.";


  export const repertoireHtml = `
  <p>V repertoáru najdete známé melodie z oblasti jazzu, popu, filmové hudby i komorních aranží pro kulturní a společenské události.</p>
  <ul>
    <li>jazzové standardy</li>
    <li>popové a filmové melodie</li>
    <li>hudební doprovod pro hotely, galerie a soukromé akce</li>
  </ul>
`;


export const members = [
  { id: "josef", name: "Josef Pavlíček", role: "kytara, aranž", image: "/img/josef.svg" },
  { id: "singer", name: "Zpěvačka", role: "zpěv", image: "/img/singer.svg" }
];


export const mockConcerts: Concert[] = [
  {
    id: "demo-1",
    date: "2026-04-10T19:00:00",
    title: "JazzLight Night",
    venue: "Hotel Chotol, Horoměřice",
    description: "Večerní koncert s výběrem známých melodií.",
    link: "#",
    published: true,
    images: [],
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z"
  },
  {
    id: "demo-2",
    date: "2024-04-10T19:00:00",
    title: "JazzLight Night",
    venue: "Hotel Chotol, Horoměřice",
    description: "Odehrané vystoupení.",
    link: "#",
    published: true,
    images: [],
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z"
  }
];
