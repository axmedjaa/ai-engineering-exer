"use client"
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useDropzone } from "react-dropzone";
import {  Volume2 } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";
interface audioData {
  _id: string;
  title: string;
  url: string;
  createdAt: string;
  updatedAt: string;
}
export default function Home() {
    const [data, setData] = useState<audioData | null>(null);
    const[progress,setProgress]= useState(0);
     const [uploading, setUploading] = useState<boolean>(false);
     const[audios,setAudios]= useState<audioData[]>([])
     useEffect(() => {
       const fetchAudioes = async () => {
         try {
           const response = await fetch("/api/audio");
           const data = await response.json();
           console.log(data);
           setAudios(data.audiodocs);
         } catch (error) {
           console.log(error);
         }
       }
       fetchAudioes();
     },[])
  const onDrop = async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if(!file) return;
    setUploading(true);
    setProgress(0);
    const addProgress=setInterval(()=>{
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(addProgress);
          return prevProgress;
        }
        return prevProgress + 10;
      })      
    },200)
    const formdata = new FormData();
    formdata.append("file", file);
    try {
      const response = await fetch("/api/audio", {
        method: "POST",
        body: formdata
      })
      const data = await response.json();
      console.log(data);
      setData(data.audiodoc);
      if (data?.audiodoc && data.audiodoc.title) {
  setAudios((prev) => [data.audiodoc, ...prev]);
 }
    } catch (error) {
      console.log(error)
    }finally{
      setUploading(false);
      clearInterval(addProgress);
    }
  }
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept:{
      "audio/*":[]
    }
  });
  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/audio?id=${id}`, {
        method: "DELETE",
      });
      setAudios((prev) => prev.filter((audio) => audio._id !== id));
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div className="min-h-screen mx-auto px-[8%]">
    <h1 className="text-3xl font-bold mb-2 capitalize text-center mt-4">ai audio generator</h1>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
      <div className="col-span-2">
        <Card className="flex flex-col gap-4 ">
          <CardTitle className="htext-2xl font-bold ml-6"> Upload & Process audio</CardTitle>
          <CardContent>
             <div
        {...getRootProps()}
        className="cursor-pointer text-center p-32 flex flex-col items-center bg-gray-50 hover:bg-gray-100 transition"
      >
        <Input {...getInputProps()} />
          <Volume2 className="w-12 h-12 text-gray-500 mb-2" />
        {isDragActive ? (
          <p>Drop your audio here...</p>
        ) : (
          <p>Drag & drop a audio, or click to upload</p>
        )}
      </div>
      {
        uploading && (
          <div className="mt-4">
           <p className="text-lg font-medium mb-1">Uploading... {progress}%</p>
            <progress
              value={progress}
              max="100"
              className="w-full h-2 bg-gray-200 rounded-full"
            />
          </div>
        )
      }
      
        {data && (
  <div className="mt-6">
    <h2 className="text-xl font-semibold mb-2">{data?.title}</h2>
    <audio src={data?.url} controls className="w-full rounded-lg shadow" />
  </div>
)}
          </CardContent>
        </Card>
      </div>
      <div className="space-y-4">
        <div className="flex flex-col gap-2">
          <h2>generate audio</h2>
          {
            audios.slice(0,5).map((audio) => (
              <div key={audio._id} className="flex justify-between items-center gap-2">
                <p className="text-sm mt-2">{audio.title}</p>
                <Link href={`/audio/${audio._id}`} className="text-sm mt-2 text-blue-500 hover:underline">generate</Link>
                <button 
                onClick={()=>handleDelete(audio._id)}
                className=" text-red-500 hover:bg-red-700 hover:text-white font-bold mt-1   rounded focus:outline-none focus:shadow-outline">delete</button>
              </div>
            ))
          }
        </div>
      </div>
    </div>
    </div>
  );
}
