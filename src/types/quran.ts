export interface Verse {
  id: number;
  verse_number: number;
  verse_key: string;
  juz_number: number;
  hizb_number: number;
  rub_el_hizb_number: number;
  ruku_number: number;
  manzil_number: number;
  sajdah_number: number | null;
  chapter_id: number;
  text_imlaei: string;
  text_uthmani: string;
  page_number: number;
}

export interface Chapter {
  id: number;
  revelation_place: RevelationPlace;
  revelation_order: number;
  bismillah_pre: boolean;
  name_simple: string;
  name_complex: string;
  name_arabic: string;
  verses_count: number;
  pageStart: number;
  pageEnd: number;
}

export enum RevelationPlace {
  Madinah = "madinah",
  Makkah = "makkah",
}
