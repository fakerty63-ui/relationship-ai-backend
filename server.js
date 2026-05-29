import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || "development";
const OPENAI_MODEL = process.env.OPENAI_MODEL || "gpt-5.5";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY belum diisi.");
  }

  const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    });

    const allowedOrigins = [
      "http://localhost:5173",
        "http://localhost:3000",
          // nanti tambahkan domain frontend Vercel di sini
            // "https://nama-app-kamu.vercel.app",
            ];

            app.use(
              cors({
                  origin(origin, callback) {
                        if (!origin) return callback(null, true);

                              if (allowedOrigins.includes(origin)) {
                                      return callback(null, true);
                                            }

                                                  return callback(new Error("CORS tidak diizinkan untuk origin ini."));
                                                      },
                                                        })
                                                        );

                                                        app.use(express.json({ limit: "1mb" }));

                                                        const SYSTEM_PROMPT = `
                                                        Kamu adalah AI content strategist untuk akun TikTok carousel relationship dan mental health ringan.

                                                        Aturan:
                                                        - Bahasa Indonesia.
                                                        - Jangan ubah niche ke motivasi umum.
                                                        - Jangan pakai bahasa psikologi berat.
                                                        - Jangan memberi diagnosis klinis.
                                                        - Fokus pada hook, retention, emotional impact, save/share, dan kritik risiko gagal.
                                                        - Target audiens: orang yang capek nebak-nebak, terlalu sering memaklumi, dan ingin paham perasaannya tanpa diceramahi.
                                                        - Jawaban harus tajam, spesifik, dan tidak generik.
                                                        `;

                                                        const prompts = {
                                                          ide: `
                                                          Buatkan 20 ide konten TikTok carousel untuk akun relationship dan mental health ringan.

                                                          Jangan kasih ide generik seperti:
                                                          - red flag pasangan
                                                          - cara move on
                                                          - self love
                                                          - toxic relationship

                                                          Kecuali angle-nya dibuat baru dan lebih tajam.

                                                          Setiap ide harus punya:
                                                          1. Judul/hook utama
                                                          2. Luka emosional spesifik
                                                          3. Kenapa orang akan berhenti scroll
                                                          4. Kenapa orang akan save/share
                                                          5. Format carousel 6 slide
                                                          6. Skor potensi viral 1–10
                                                          7. Kritik kenapa ide ini bisa gagal.
                                                          `,

                                                            caption: `
                                                            Tulis 5 pilihan caption TikTok untuk carousel relationship.

                                                            Struktur:
                                                            1. Kalimat pertama sebagai hook emosional
                                                            2. Mini cerita/refleksi singkat
                                                            3. Reframing yang bikin pembaca mikir
                                                            4. CTA komentar atau save

                                                            Jangan terlalu puitis.
                                                            Jangan menggurui.
                                                            Jangan pakai bahasa psikologi berat.
                                                            `,

                                                              auto: `
                                                              Ubah premis menjadi paket konten lengkap:
                                                              1. Audit apakah premis generik atau tajam
                                                              2. Luka emosional spesifik
                                                              3. Common belief yang dilawan
                                                              4. Hidden mechanism / diagnosis pola
                                                              5. Hook utama
                                                              6. Carousel 6 slide
                                                              7. Caption TikTok
                                                              8. CTA komentar
                                                              9. CTA save/share
                                                              10. Kritik risiko gagal.
                                                              `,

                                                                growth: `
                                                                Buat rencana growth 30 hari untuk akun TikTok carousel relationship dan mental health ringan.

                                                                Kondisi:
                                                                - Followers masih kecil
                                                                - Beberapa konten sudah tembus ribuan views
                                                                - Format utama carousel teks dark emotional

                                                                Buat:
                                                                1. Target realistis
                                                                2. 5 pilar konten
                                                                3. Kalender 30 hari
                                                                4. Jam posting yang dites
                                                                5. Strategi balas komentar
                                                                6. Metrik evaluasi
                                                                7. Hal yang harus dihentikan
                                                                8. Pola konten yang harus diulang.
                                                                `,

                                                                  hook: `
                                                                  Buat 30 hook 3 detik pertama untuk TikTok carousel niche relationship dan mental health ringan.

                                                                  Setiap hook beri:
                                                                  1. Tipe hook
                                                                  2. Skor stop-scroll
                                                                  3. Alasan kuat
                                                                  4. Risiko gagal
                                                                  5. Versi lebih halus
                                                                  6. Versi lebih brutal.
                                                                  `,

                                                                    repurpose: `
                                                                    Ubah satu konten carousel relationship menjadi:
                                                                    1. Versi Reels carousel
                                                                    2. Versi TikTok story 3 frame
                                                                    3. Caption panjang
                                                                    4. Komentar pancing diskusi
                                                                    5. Thread pendek
                                                                    6. Script voice over 30 detik
                                                                    7. Quote single image.
                                                                    `,

                                                                      engage: `
                                                                      Buat sistem engagement untuk akun TikTok carousel relationship dan mental health ringan:
                                                                      1. Struktur caption terbaik
                                                                      2. 20 CTA komentar natural
                                                                      3. 20 CTA save/share tidak maksa
                                                                      4. 5 set hashtag relevan
                                                                      5. Strategi posting 14 hari
                                                                      6. Cara membaca TikTok Analytics
                                                                      7. Kapan ulang format menang
                                                                      8. Kapan buang format lemah.
                                                                      `,
                                                                      };

                                                                      function cleanText(value, fallback = "") {
                                                                        if (typeof value !== "string") return fallback;
                                                                          return value.trim();
                                                                          }

                                                                          function buildPrompt(menu, topic, userInput) {
                                                                            return `
                                                                            Menu: ${menu}

                                                                            Topik/premis:
                                                                            ${topic || "Relationship & Mental Health"}

                                                                            Input tambahan user:
                                                                            ${userInput || "-"}

                                                                            Tugas:
                                                                            ${prompts[menu]}
                                                                            `;
                                                                            }

                                                                            app.get("/", (req, res) => {
                                                                              res.json({
                                                                                  success: true,
                                                                                      status: "Server jalan",
                                                                                          endpoint: "/api/generate",
                                                                                            });
                                                                                            });

                                                                                            app.get("/api/health", (req, res) => {
                                                                                              res.json({
                                                                                                  success: true,
                                                                                                      status: "OK",
                                                                                                          model: OPENAI_MODEL,
                                                                                                              environment: NODE_ENV,
                                                                                                                });
                                                                                                                });

                                                                                                                app.get("/api/menus", (req, res) => {
                                                                                                                  res.json({
                                                                                                                      success: true,
                                                                                                                          menus: Object.keys(prompts),
                                                                                                                            });
                                                                                                                            });

                                                                                                                            app.post("/api/generate", async (req, res) => {
                                                                                                                              try {
                                                                                                                                  const menu = cleanText(req.body?.menu);
                                                                                                                                      const topic = cleanText(req.body?.topic);
                                                                                                                                          const userInput = cleanText(req.body?.userInput);

                                                                                                                                              if (!menu) {
                                                                                                                                                    return res.status(400).json({
                                                                                                                                                            success: false,
                                                                                                                                                                    error: "Menu wajib diisi.",
                                                                                                                                                                          });
                                                                                                                                                                              }

                                                                                                                                                                                  if (!prompts[menu]) {
                                                                                                                                                                                        return res.status(400).json({
                                                                                                                                                                                                success: false,
                                                                                                                                                                                                        error: "Menu tidak valid.",
                                                                                                                                                                                                                allowedMenus: Object.keys(prompts),
                                                                                                                                                                                                                      });
                                                                                                                                                                                                                          }

                                                                                                                                                                                                                              const response = await client.responses.create({
                                                                                                                                                                                                                                    model: OPENAI_MODEL,
                                                                                                                                                                                                                                          instructions: SYSTEM_PROMPT,
                                                                                                                                                                                                                                                input: buildPrompt(menu, topic, userInput),
                                                                                                                                                                                                                                                      max_output_tokens: 4000,
                                                                                                                                                                                                                                                          });

                                                                                                                                                                                                                                                              return res.json({
                                                                                                                                                                                                                                                                    success: true,
                                                                                                                                                                                                                                                                          menu,
                                                                                                                                                                                                                                                                                topic: topic || "Relationship & Mental Health",
                                                                                                                                                                                                                                                                                      output: response.output_text || "",
                                                                                                                                                                                                                                                                                          });
                                                                                                                                                                                                                                                                                            } catch (error) {
                                                                                                                                                                                                                                                                                                console.error("Generate error:", error);

                                                                                                                                                                                                                                                                                                    return res.status(500).json({
                                                                                                                                                                                                                                                                                                          success: false,
                                                                                                                                                                                                                                                                                                                error: "Gagal generate. Cek API key, billing, model, atau koneksi server.",
                                                                                                                                                                                                                                                                                                                      detail:
                                                                                                                                                                                                                                                                                                                              NODE_ENV === "development"
                                                                                                                                                                                                                                                                                                                                        ? error.message
                                                                                                                                                                                                                                                                                                                                                  : "Internal server error",
                                                                                                                                                                                                                                                                                                                                                      });
                                                                                                                                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                                                                                                                        });

                                                                                                                                                                                                                                                                                                                                                        app.use((req, res) => {
                                                                                                                                                                                                                                                                                                                                                          res.status(404).json({
                                                                                                                                                                                                                                                                                                                                                              success: false,
                                                                                                                                                                                                                                                                                                                                                                  error: "Endpoint tidak ditemukan.",
                                                                                                                                                                                                                                                                                                                                                                    });
                                                                                                                                                                                                                                                                                                                                                                    });

                                                                                                                                                                                                                                                                                                                                                                    app.listen(PORT, () => {
                                                                                                                                                                                                                                                                                                                                                                      console.log(`Server jalan di port ${PORT}`);
                                                                                                                                                                                                                                                                                                                                                                      });