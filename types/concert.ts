export type ConcertImage = {
  id: string;
  name: string;
  mimeType: string;
  sizeBytes: number;
  base64: string;
};

export type Concert = {
  id: string;
  date: string;
  title: string;
  venue: string;
  description: string;
  link: string;
  published: boolean;
  images: ConcertImage[];
  createdAt: string;
  updatedAt: string;
};
