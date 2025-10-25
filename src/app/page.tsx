"use client";
import { useState } from "react";
import axios from "axios";
import { FaCopy, FaCheck, FaBroom, FaExchangeAlt } from "react-icons/fa";

export default function Home() {
  const [text, setText] = useState("");
  const [result, setResult] = useState<{
    formatted?: string;
    translated?: string;
    combined?: string;
  }>({});
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState<{
    formatted?: boolean;
    translated?: boolean;
  }>({});
  const [direction, setDirection] = useState<"en|bn" | "bn|en">("en|bn");

  const handleTranslate = async () => {
    if (!text.trim()) return;
    setLoading(true);

    try {
      const res = await axios.post("/api/translate", { text, direction });
      setResult(res.data);
    } catch (error) {
      console.error("Error translating:", error);
      setResult({ combined: "❌ Translation failed. Try again!" });
    }

    setLoading(false);
  };

  const handleCopy = async (type: "formatted" | "translated") => {
    const value = result[type];
    if (!value) return;
    await navigator.clipboard.writeText(value);
    setCopied({ [type]: true });
    setTimeout(() => setCopied({ [type]: false }), 1500);
  };

  const handleClear = () => {
    setText("");
    setResult({});
  };

  const toggleDirection = () => {
    setDirection((prev) => (prev === "en|bn" ? "bn|en" : "en|bn"));
    setResult({});
  };

  const langLabel =
    direction === "en|bn" ? "English → Bangla" : "Bangla → English";

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-200 dark:from-gray-900 dark:to-gray-800 md:px-4">
      <div className="w-full max-w-4xl bg-white dark:bg-gray-900 shadow-2xl md:rounded-3xl p-8 border border-gray-200 dark:border-gray-700 transition-all">
        <h1 className="text-4xl font-extrabold text-center text-indigo-600 dark:text-indigo-400 mb-8 drop-shadow-md">
          🌍 Translate App
        </h1>

        {/* Toggle language direction */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <span className="font-semibold text-gray-700 dark:text-gray-300">
            {langLabel}
          </span>
          <button
            onClick={toggleDirection}
            className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-1 rounded-full shadow-md transition-all"
            title="Switch Translation Direction"
          >
            <FaExchangeAlt /> Switch
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Left side input */}
          <div className="flex-1 flex flex-col gap-3">
            <label
              htmlFor="text"
              className="font-semibold text-gray-700 dark:text-gray-300 text-lg"
            >
              {direction === "en|bn"
                ? "Enter English text"
                : "বাংলা লিখুন (Type Bangla text)"}
            </label>
            <textarea
              id="text"
              placeholder={
                direction === "en|bn"
                  ? "Type something in English..."
                  : "বাংলায় কিছু লিখুন..."
              }
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition h-40 resize-none mt-1"
            />

            <div className="flex gap-3">
              <button
                onClick={handleTranslate}
                disabled={loading}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg transition-all disabled:opacity-70 text-lg shadow-md"
              >
                {loading ? "Translating..." : "Translate"}
              </button>

              <button
                onClick={handleClear}
                className="flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-5 rounded-lg transition-all text-lg shadow-md"
                title="Clear all text"
              >
                <FaBroom />
                Clear
              </button>
            </div>
          </div>

          {/* Right side output */}
          <div className="flex-1 flex flex-col gap-4">
            <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
              Translation Result
            </h2>

            <div className="border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 rounded-xl p-5 min-h-[180px] text-gray-700 dark:text-gray-100 space-y-4 shadow-sm">
              {loading ? (
                <p className="animate-pulse text-gray-500">
                  Translating your text...
                </p>
              ) : (
                <>
                  {/* Formatted Section */}
                  <div className="flex justify-between items-center">
                    <strong>Formatted:</strong>
                    <button
                      onClick={() => handleCopy("formatted")}
                      className="text-indigo-500 hover:text-indigo-700 transition"
                      title="Copy formatted text"
                    >
                      {copied.formatted ? (
                        <FaCheck className="text-green-500" />
                      ) : (
                        <FaCopy />
                      )}
                    </button>
                  </div>
                  <p className="text-base bg-gray-100 dark:bg-gray-700 p-2 rounded-md break-words">
                    {result.formatted || "-"}
                  </p>

                  {/* Translated Section */}
                  <div className="flex justify-between items-center">
                    <strong>Translated:</strong>
                    <button
                      onClick={() => handleCopy("translated")}
                      className="text-indigo-500 hover:text-indigo-700 transition"
                      title="Copy translated text"
                    >
                      {copied.translated ? (
                        <FaCheck className="text-green-500" />
                      ) : (
                        <FaCopy />
                      )}
                    </button>
                  </div>
                  <p className="text-base bg-gray-100 dark:bg-gray-700 p-2 rounded-md font-[solaimanlipi]">
                    {result.translated || "-"}
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <footer className="mt-10 mb-6 text-gray-600 dark:text-gray-400 text-sm text-center">
        © {new Date().getFullYear()} Translate App by{" "}
        <span className="font-semibold text-indigo-600 dark:text-indigo-400">
          MD Masum Billah
        </span>
      </footer>
    </main>
  );
}
