import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { text, direction } = body;

    if (!text) {
      return NextResponse.json({ error: "No text provided" }, { status: 400 });
    }

    let englishText = text; // এটি সবসময় ইংরেজি রাখব ফরম্যাটের জন্য
    let translated = "";

    // যদি বাংলা টেক্সট দেওয়া হয়, আগে ইংরেজিতে কনভার্ট করব
    if (direction === "bn|en") {
      const enResponse = await axios.get("https://api.mymemory.translated.net/get", {
        params: { q: text, langpair: "bn|en" },
      });
      englishText = enResponse.data.responseData.translatedText;
      translated = englishText; // যেহেতু বাংলা থেকে ইংরেজি, তাই translated হবে ইংরেজি
    } else {
      // যদি ইংরেজি দেওয়া হয়, বাংলা ট্রান্সলেট করব
      const bnResponse = await axios.get("https://api.mymemory.translated.net/get", {
        params: { q: text, langpair: "en|bn" },
      });
      translated = bnResponse.data.responseData.translatedText;
    }

    // সবসময় ইংরেজি টেক্সট থেকে formatted বানাব
    const formatted = englishText.toLowerCase().replace(/\s+/g, "-");

    return NextResponse.json({
      formatted, // সবসময় ইংরেজি
      translated, // অনুবাদ (বাংলা বা ইংরেজি)
      combined: `${formatted} → ${translated}`,
    });
  } catch (error) {
    console.error("Translation error:", error);
    return NextResponse.json({ error: "Translation failed" }, { status: 500 });
  }
}
