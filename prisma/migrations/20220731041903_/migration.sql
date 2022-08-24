-- CreateTable
CREATE TABLE "Alquran" (
    "id" INTEGER NOT NULL,
    "verse_number" INTEGER NOT NULL,
    "verse_key" TEXT NOT NULL,
    "juz_number" INTEGER NOT NULL,
    "hizb_number" INTEGER NOT NULL,
    "rub_el_hizb_number" INTEGER NOT NULL,
    "ruku_number" INTEGER NOT NULL,
    "manzil_number" INTEGER NOT NULL,
    "surah_number" INTEGER NOT NULL,
    "chapter_id" INTEGER NOT NULL,
    "text_imlaei" TEXT NOT NULL,
    "text_uthmani" TEXT NOT NULL,
    "page_number" TEXT NOT NULL,

    CONSTRAINT "Alquran_pkey" PRIMARY KEY ("id")
);
