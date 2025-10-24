"use client";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
interface audioData {
  _id: string;
  title: string;
  url: string;
  text: string;
  translatedText: string;
  createdAt: string;
}

const GenearteAudioPage = () => {
  const params = useParams();
  const [audio, setAudio] = useState<audioData | null>(null);
  const [loading, setLoading] = useState(true);
  const [transcribing, setTranscribing] = useState(false);
  const [language, setLanguage] = useState("so");
  const [translating, setTranslating] = useState(false);
  const [translatedText, setTranslatedText] = useState("");
  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const response = await fetch(`/api/audio?id=${params.id}`);
        const data = await response.json();
        setAudio(data.audiodoc);
        console.log(data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchVideo();
  }, [params.id]);
   const handleTranscribe = async () => {
    setTranscribing(true);
    try {
      const response = await fetch(`/api/generate?id=${params.id}`, {
        method: "POST",
      });
      const data = await response.json();
      if (data.audiodoc.text) {
        setAudio((prev) =>
          prev ? { ...prev, text: data.audiodoc.text } : prev
        );
      }
    } catch (error) {
      console.log(error);
    } finally {
      setTranscribing(false);
    }
  };
  const handleTranslate = async () => {
    setTranslating(true);
    try {
      const response = await fetch("/api/translate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: audio?.text,
          targetLanguage: language,
          id: audio?._id,
        }),
      });
      const data = await response.json();
      if (data.audiodoc.translatedText) {
        setTranslatedText(data.audiodoc.translatedText);
        setAudio((prev) =>
          prev
            ? { ...prev, translatedText: data.audiodoc.translatedText }
            : prev
        );
        console.log(data);
      } else {
        console.log("Translation failed");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setTranslating(false);
    }
  };

  if (loading)
    return <div className="text-2xl text-center m-[20%]">Loading...</div>;
  if (!audio) return <div>Video not found</div>;
  return (
    <div className="p-8 space-y-4">
      <h1>{audio.title}</h1>
      <audio src={audio.url} controls></audio>
      {!audio.text && (
        <button
          onClick={handleTranscribe}
          disabled={transcribing}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        >
          {transcribing ? "Transcribing..." : "Generate Text"}
        </button>
      )}
      <p>{audio.text}</p>
      {audio.text && (
        <div className="mt-4 flex gap-2 items-center">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="so">Somali</option>
            <option value="en">English</option>
            <option value="ar">Arabic</option>
            <option value="fr">French</option>
            <option value="es">Spanish</option>
          </select>

          <button
            onClick={handleTranslate}
            disabled={translating}
            className={`px-4 py-2 rounded text-white ${
              translating ? "bg-gray-400" : "bg-green-500 hover:bg-green-600"
            }`}
          >
            {translating ? "Translating..." : "Translate"}
          </button>
        </div>
      )}

      {audio.translatedText && (
        <div className="mt-4 p-4 bg-gray-100 rounded-lg flex flex-col justify-end">
          <h2 className="font-semibold">Translated Text:</h2>
          <p className="mt-2">{audio.translatedText}</p>
        </div>
      )}
    </div>
  );
};

export default GenearteAudioPage;
