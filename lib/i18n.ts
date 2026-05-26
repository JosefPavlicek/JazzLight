export type Lang = "cs" | "en";

export type Dictionary = {
  navAbout: string; navMembers: string; navRepertoire: string; navConcerts: string; navContact: string;
  brandSubtitle: string; heroEyebrow: string; heroTitle: string; heroText: string; heroConcerts: string; heroContact: string; heroImageDetail: string;
  aboutTitle: string; aboutText: string;
  membersTitle: string; membersText: string; josefRole: string; singerName: string; singerRole: string;
  repertoireTitle: string;
  concertsTitle: string; concertsText: string; upcomingConcerts: string; pastConcerts: string; noUpcomingConcerts: string; noPastConcerts: string; concertDetail: string;
  contactTitle: string; contactText: string;
  footerText: string; footerMusicLessons: string; footerMetronome: string; instagramLabel: string; langSwitchLabel: string; langSwitchTooltip: string; langSwitchFlag: string;
};

export const dictionary: Record<Lang, Dictionary> = {
  cs: {
    navAbout: "O kapele", navMembers: "Členové", navRepertoire: "Co hrajeme", navConcerts: "Koncerty", navContact: "Kontakt",
    brandSubtitle: "komorní hudba pro vaše akce", heroEyebrow: "Jazz · Pop · Filmové melodie", heroTitle: "JazzLight",
    heroText: "Elegantní hudební doprovod pro koncerty, hotelové večery, slavnosti i komorní setkání.",
    heroConcerts: "Plánované koncerty", heroContact: "Kontakt", heroImageDetail: "Zobrazit hero obrázek",
    aboutTitle: "O kapele",
    aboutText: "JazzLight je komorní hudební projekt zaměřený na příjemnou, elegantní a posluchačsky vstřícnou hudbu. Repertoár sahá od jazzu přes popové melodie až po známé filmové a muzikálové skladby.",
    membersTitle: "Členové", membersText: "",
    josefRole: "kytara, aranž", singerName: "Zpěvačka", singerRole: "zpěv",
    repertoireTitle: "Co hrajeme",
    concertsTitle: "Koncerty", concertsText: "Plánované a odehrané koncerty se dělí automaticky podle data.",
    upcomingConcerts: "Plánované koncerty", pastConcerts: "Odehrané koncerty",
    noUpcomingConcerts: "Zatím nejsou vypsané žádné termíny.", noPastConcerts: "Archiv je zatím prázdný.", concertDetail: "Detail koncertu",
    contactTitle: "Kontakt", contactText: "Hudební doprovod pro koncerty, hotely, galerie, soukromé i firemní akce.",
    footerText: "Copyright © Josef Pavlíček", footerMusicLessons: "Výuka hudby", footerMetronome: "Online Metronom Zdarma",
    instagramLabel: "Instagram JazzLight", langSwitchLabel: "EN", langSwitchTooltip: "Switch to English", langSwitchFlag: "🇬🇧"
  },
  en: {
    navAbout: "About", navMembers: "Members", navRepertoire: "What we play", navConcerts: "Concerts", navContact: "Contact",
    brandSubtitle: "chamber music for your events", heroEyebrow: "Jazz · Pop · Film music", heroTitle: "JazzLight",
    heroText: "Elegant live music for concerts, hotel evenings, celebrations, and intimate gatherings.",
    heroConcerts: "Upcoming concerts", heroContact: "Contact", heroImageDetail: "View hero image",
    aboutTitle: "About the band",
    aboutText: "JazzLight is a chamber music project focused on pleasant, elegant, and listener-friendly music. The repertoire ranges from jazz and pop melodies to well-known film and musical songs.",
    membersTitle: "Members", membersText: "",
    josefRole: "guitar, arrangements", singerName: "Singer", singerRole: "vocals",
    repertoireTitle: "What we play",
    concertsTitle: "Concerts", concertsText: "Upcoming and past concerts are separated automatically by date.",
    upcomingConcerts: "Upcoming concerts", pastConcerts: "Past concerts",
    noUpcomingConcerts: "No upcoming dates are currently listed.", noPastConcerts: "The archive is currently empty.", concertDetail: "Concert detail",
    contactTitle: "Contact", contactText: "Live music for concerts, hotels, galleries, private and company events.",
    footerText: "Copyright © Josef Pavlíček", footerMusicLessons: "Music lessons", footerMetronome: "Free Online Metronome",
    instagramLabel: "JazzLight Instagram", langSwitchLabel: "CZ", langSwitchTooltip: "Přepni do češtiny", langSwitchFlag: "🇨🇿"
  }
};
