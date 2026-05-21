export type LocalizedHtml = { cs: string; en: string };

export type ArtistPhoto = {
  id: string;
  name: string;
  mimeType: string;
  sizeBytes: number;
  base64: string;
};

export type Artist = {
  id: string;
  name: string;
  role: LocalizedHtml;
  photos: ArtistPhoto[];
};

export type ContactContent = {
  name: string;
  email: string;
  phone: string;
  description: LocalizedHtml;
};

export type SiteContent = {
  about: LocalizedHtml;
  repertoire: LocalizedHtml;
  contact: ContactContent;
  artists: Artist[];
};

