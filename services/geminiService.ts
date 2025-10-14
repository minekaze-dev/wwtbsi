import { GoogleGenAI, Type } from "@google/genai";
import { Question, GameMode } from '../types';
import { GAME_MODES } from '../constants';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateQuestions = async (mode: GameMode): Promise<Question[]> => {
  const modeConfig = GAME_MODES[mode];
  const { questionCount } = modeConfig;

  const prompt = `Buatkan satu set kuis berisi ${questionCount} pertanyaan untuk game gaya 'Who Wants to be a Millionaire' dengan mode "${mode}".

Aturan Konten & Bahasa:
1.  Bahasa Utama: Mayoritas pertanyaan harus dalam Bahasa Indonesia.
2.  Pengecualian: Boleh menyertakan beberapa soal cerita (word problems) atau soal tes Bahasa Inggris dalam Bahasa Inggris.
3.  Pastikan setiap set pertanyaan yang dihasilkan unik dan berbeda dari yang sebelumnya.

Struktur Topik & Kesulitan (Sesuaikan dengan total ${questionCount} pertanyaan):
-   10 Pertanyaan Pertama (Mudah hingga Sedang): Mulai dengan pertanyaan yang bisa dijangkau namun tetap menarik, mencakup pengetahuan umum populer tentang Indonesia dan dunia. Tingkat kesulitan harus meningkat secara bertahap dalam 10 pertanyaan ini.
-   Pertanyaan Selanjutnya (Meningkat Tajam): Setelah 10 pertanyaan pertama, tingkat kesulitan harus meningkat tajam. Masuk ke topik yang lebih spesifik, analitis, dan memerlukan pengetahuan mendalam (sains global, teknologi, sejarah dunia yang tidak umum, matematika, tes Bahasa Inggris).
-   Pertanyaan Terakhir (Sangat Sulit hingga Pakar): Puncak kesulitan berada di pertanyaan-pertanyaan terakhir, dengan soal yang sangat menantang dan obskur yang hanya bisa dijawab oleh para ahli.

Format Output:
Untuk setiap pertanyaan, berikan empat pilihan ganda dengan hanya satu jawaban yang benar. Sertakan kategori untuk setiap pertanyaan (e.g., 'Matematika', 'Pengetahuan Umum', 'Sains', 'Sejarah', 'Bahasa Inggris'). Pastikan pilihan jawaban lain masuk akal namun salah.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            questions: {
              type: Type.ARRAY,
              description: `An array of ${questionCount} quiz questions.`,
              items: {
                type: Type.OBJECT,
                properties: {
                  q: {
                    type: Type.STRING,
                    description: "The text of the question."
                  },
                  options: {
                    type: Type.ARRAY,
                    description: "An array of 4 string options.",
                    items: { type: Type.STRING }
                  },
                  answerIndex: {
                    type: Type.INTEGER,
                    description: "The 0-based index of the correct option in the options array."
                  },
                  difficulty: {
                    type: Type.STRING,
                    description: "The difficulty of the question (e.g., 'Easy', 'Medium', 'Hard', 'Expert')."
                  },
                  category: {
                    type: Type.STRING,
                    description: "The category of the question (e.g., 'Matematika', 'Pengetahuan Umum')."
                  }
                },
                required: ["q", "options", "answerIndex", "difficulty", "category"]
              }
            }
          },
          required: ["questions"]
        }
      }
    });

    const jsonText = response.text.trim();
    const parsed = JSON.parse(jsonText);
    
    if (parsed.questions && Array.isArray(parsed.questions) && parsed.questions.length > 0) {
        return parsed.questions as Question[];
    } else {
        throw new Error("Invalid question format received from API.");
    }
  } catch (error) {
    console.error("Error generating questions:", error);
    throw new Error("Failed to generate questions. Please try again.");
  }
};


export const getChatLifelineHelp = async (question: Question, userMessage: string, isInitialMessage: boolean): Promise<string> => {
  const optionsString = question.options.map((opt, i) => `${String.fromCharCode(65 + i)}: ${opt}`).join(', ');
  
  const greetings = [
    "Weh tumben ngechat, lagi ujian lo nanya ginian? 😂",
    "Astaga, soal apaan nih? Serius amat.",
    "Buset, lagi ikut kuis jadi orang pinter ya lo?",
    "Wkwk, lagi butuh bantuan master ya? Sini gue liat soalnya.",
    "Hah? Soal ginian? Lo ngetes gue apa gimana nih?"
  ];

  const initialPrompt = `Anda adalah seorang "bestie" (sahabat karib) yang sangat gaul dan santai. Teman Anda tiba-tiba mengirimi Anda pesan berisi soal kuis.

  Soal yang dikirim: "${question.q}"
  
  Tugas Anda:
  1.  BERPURA-PURALAH KAGET DAN PENASARAN. Jangan langsung memberikan petunjuk.
  2.  Balas dengan pesan yang SANGAT SINGKAT dan GAUL. Gunakan salah satu dari sapaan acak berikut: "${greetings.join('", "')}".
  3.  Jaga agar balasan tetap singkat dan terasa seperti sedang chatting.
  4.  INTINYA: Buat seolah-olah Anda baru menerima pesan itu dan sedang memulai percakapan. Jangan berikan petunjuk apapun di balasan pertama ini. Biarkan teman Anda bertanya lagi untuk mendapatkan petunjuk.`;
  
  const correctAnswerText = question.options[question.answerIndex];
  const correctAnswerLetter = String.fromCharCode(65 + question.answerIndex);

  const followupPrompt = `Anda adalah seorang "bestie" (sahabat karib) yang sangat gaul dan santai. Anda sedang melanjutkan obrolan tentang soal kuis dengan teman Anda.

  Soal yang sedang dibahas: "${question.q}"
  Pilihannya: ${optionsString}
  Jawaban yang benar adalah: "${correctAnswerText}"
  
  Teman Anda baru saja membalas: "${userMessage}"
  
  Tugas Anda:
  1.  Sekarang berikan JAWABANNYA, tapi dengan gaya RAGU-RAGU atau tidak yakin 100%.
  2.  Gunakan bahasa gaul, singkat, dan santai. Sertakan emoji atau gurauan.
  3.  JANGAN terdengar seperti AI atau terlalu formal. Buatlah terdengar seperti tebakan dari seorang teman.
  
  Contoh balasan yang bagus (pilih salah satu gaya secara acak atau buat variasimu sendiri):
  - "Hmm, gue kurang yakin sih, tapi kayanya jawabannya ${correctAnswerLetter}. ${correctAnswerText} deh. Coba aja, moga bener wkwk"
  - "Duh soal ginian, ngetes ya lo? 🤣 Feeling gue sih ${correctAnswerLetter}. ${correctAnswerText}, tapi jangan salahin gue kalo salah ya!"
  - "Antara ${correctAnswerLetter} sama pilihan lain gue ragu... tapi gue lebih condong ke ${correctAnswerLetter}. ${correctAnswerText}. Semoga hoki!"
  - "Kayanya ${correctAnswerText} deh. Gatau juga tapi, coba aja dulu 😬"
  
  Intinya: Sebutkan jawaban yang benar ("${correctAnswerText}") tapi dengan cara yang tidak terlalu percaya diri.`;
  
  const prompt = isInitialMessage ? initialPrompt : followupPrompt;

  try {
     const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    return response.text.trim();
  } catch (error) {
    console.error("Error getting chat lifeline help:", error);
    return "Duh, sori, koneksi gue lagi jelek nih. Gak bisa mikir...";
  }
};