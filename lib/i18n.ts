export type Lang = "cs" | "en";

export const dictionary = {
  cs: {
    navAbout: "O kapele",
    navMembers: "Členové",
    navRepertoire: "Co hrajeme",
    navConcerts: "Koncerty",
    navContact: "Kontakt",

    brandSubtitle: "komorní hudba pro vaše akce",
    heroEyebrow: "Jazz · Pop · Filmové melodie",
    heroTitle: "JazzLight",
    heroText: "Elegantní hudební doprovod pro koncerty, hotelové večery, slavnosti i komorní setkání.",
    heroConcerts: "Plánované koncerty",
    heroContact: "Kontakt",

    aboutTitle: "O kapele",
    aboutText: "JazzLight je komorní hudební projekt zaměřený na příjemnou, elegantní a posluchačsky vstřícnou hudbu. Repertoár sahá od jazzu přes popové melodie až po známé filmové a muzikálové skladby.",

    membersTitle: "Členové",
    membersText: "Základní obsazení lze později rozšířit o další spolupracující interprety.",
    josefRole: "kytara, aranž",
    singerName: "Zpěvačka",
    singerRole: "zpěv",

    repertoireTitle: "Co hrajeme",

    concertsTitle: "Koncerty",
    concertsText: "Plánované a odehrané koncerty se dělí automaticky podle data.",
    upcomingConcerts: "Plánované koncerty",
    pastConcerts: "Odehrané koncerty",
    noUpcomingConcerts: "Zatím nejsou vypsané žádné termíny.",
    noPastConcerts: "Archiv je zatím prázdný.",
    concertDetail: "Detail koncertu",

    contactTitle: "Kontakt",
    contactText: "Hudební doprovod pro koncerty, hotely, galerie, soukromé i firemní akce.",

    footerText: "Next.js + Firebase Realtime Database prototype.",
    langSwitchLabel: "EN"
  },

  en: {
    navAbout: "About",
    navMembers: "Members",
    navRepertoire: "What we play",
    navConcerts: "Concerts",
    navContact: "Contact",

    brandSubtitle: "chamber music for your events",
    heroEyebrow: "Jazz · Pop · Film music",
    heroTitle: "JazzLight",
    heroText: "Elegant live music for concerts, hotel evenings, celebrations, and intimate gatherings.",
    heroConcerts: "Upcoming concerts",
    heroContact: "Contact",

    aboutTitle: "About the band",
    aboutText: "JazzLight is a chamber music project focused on pleasant, elegant, and listener-friendly music. The repertoire ranges from jazz and pop melodies to well-known film and musical songs.",

    membersTitle: "Members",
    membersText: "The basic line-up can later be extended with additional guest musicians.",
    josefRole: "guitar, arrangements",
    singerName: "Singer",
    singerRole: "vocals",

    repertoireTitle: "What we play",

    concertsTitle: "Concerts",
    concertsText: "Upcoming and past concerts are separated automatically by date.",
    upcomingConcerts: "Upcoming concerts",
    pastConcerts: "Past concerts",
    noUpcomingConcerts: "No upcoming dates are currently listed.",
    noPastConcerts: "The archive is currently empty.",
    concertDetail: "Concert detail",

    contactTitle: "Contact",
    contactText: "Live music for concerts, hotels, galleries, private and company events.",

    footerText: "Next.js + Firebase Realtime Database prototype.",
    langSwitchLabel: "CZ"
  }
} as const;

export type Dictionary = typeof dictionary.cs;
