import { repertoireHtml } from "@/data/site";
import { getDatabase } from "@/lib/firebaseAdmin";
import type { SiteContent } from "@/types/site";

const PATH = "siteContent";

const fallbackContent: SiteContent = {
  about: {
    cs:
      "JazzLight je komorní hudební projekt zaměřený na příjemnou, elegantní a posluchačsky vstřícnou hudbu. Repertoár sahá od jazzu přes popové melodie až po známé filmové a muzikálové skladby.",
    en:
      "JazzLight is a chamber music project focused on pleasant, elegant, and listener-friendly music. The repertoire ranges from jazz and pop melodies to well-known film and musical songs.",
  },
  repertoire: {
    cs: repertoireHtml,
    en: `
      <p>The repertoire includes well-known melodies from jazz, pop, film music, and chamber arrangements for cultural and social events.</p>
      <ul>
        <li>jazz standards</li>
        <li>pop and film melodies</li>
        <li>live music for hotels, galleries, and private events</li>
      </ul>
    `,
  },
  contact: {
    name: "Josef Pavlíček / JazzLight",
    email: "info@jazzlight.cz",
    phone: "+420 123 456 789",
    description: {
      cs: "Hudební doprovod pro koncerty, hotely, galerie, soukromé i firemní akce.",
      en: "Live music for concerts, hotels, galleries, private and company events.",
    },
  },
  artists: [
    {
      id: "josef",
      name: "Josef Pavlíček",
      role: { cs: "kytara, aranž", en: "guitar, arrangements" },
      photos: [],
    },
    {
      id: "singer",
      name: "Zpěvačka",
      role: { cs: "zpěv", en: "vocals" },
      photos: [],
    },
  ],
  heroImage: null,
  seo: {
    keywords: {
      cs: "JazzLight, živá hudba, jazz, pop, koncert, hudební doprovod, Praha",
      en: "JazzLight, live music, jazz, pop, concert, music accompaniment, Prague",
    },
  },
};

function mergeContent(value: Partial<SiteContent> | null | undefined): SiteContent {
  return {
    about: {
      cs: value?.about?.cs || fallbackContent.about.cs,
      en: value?.about?.en || fallbackContent.about.en,
    },
    repertoire: {
      cs: value?.repertoire?.cs || fallbackContent.repertoire.cs,
      en: value?.repertoire?.en || fallbackContent.repertoire.en,
    },
    contact: {
      name: value?.contact?.name || fallbackContent.contact.name,
      email: value?.contact?.email || fallbackContent.contact.email,
      phone: value?.contact?.phone || fallbackContent.contact.phone,
      description: {
        cs: value?.contact?.description?.cs || fallbackContent.contact.description.cs,
        en: value?.contact?.description?.en || fallbackContent.contact.description.en,
      },
    },
    artists:
      Array.isArray(value?.artists) && value!.artists!.length > 0
        ? value!.artists!
        : fallbackContent.artists,
    heroImage: value?.heroImage || null,
    seo: {
      keywords: {
        cs: value?.seo?.keywords?.cs || fallbackContent.seo.keywords.cs,
        en: value?.seo?.keywords?.en || fallbackContent.seo.keywords.en,
      },
    },
  };
}

export async function getSiteContent(): Promise<SiteContent> {
  const db = getDatabase();
  if (!db) return fallbackContent;

  const snapshot = await db.ref(PATH).once("value");
  return mergeContent(snapshot.val());
}

export async function saveSiteContent(content: SiteContent) {
  const db = getDatabase();
  if (!db) throw new Error("Firebase není nakonfigurovaný.");

  await db.ref(PATH).set({
    ...content,
    updatedAt: new Date().toISOString(),
  });

  return content;
}

export async function getRepertoireContent() {
  const content = await getSiteContent();
  return content.repertoire;
}
