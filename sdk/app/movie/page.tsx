"use client"
import { useState } from "react"

export default function MovieForm() {
  const [form, setForm] = useState({
    title: "",
    year: "",
    genre: "",
    rating: "",
    director: "",
    description: ""
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      const res = await fetch("/api/movie", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          year: Number(form.year),
          rating: form.rating ? Number(form.rating) : undefined
        })
      })
      if (res.ok) {
        alert("Movie added!")
        setForm({ title: "", year: "", genre: "", rating: "", director: "", description: "" })
      }
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div style={{ maxWidth: 400, margin: "auto", padding: 20 }}>
      <h1>Add Movie</h1>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <input name="title" placeholder="Title" value={form.title} onChange={handleChange} required />
        <input name="year" type="number" placeholder="Year" value={form.year} onChange={handleChange} required />
        <input name="genre" placeholder="Genre" value={form.genre} onChange={handleChange} required />
        <input name="rating" type="number" placeholder="Rating (0-10)" min={0} max={10} value={form.rating} onChange={handleChange} />
        <input name="director" placeholder="Director" value={form.director} onChange={handleChange} />
        <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} />
        <button type="submit" style={{ padding: "8px", background: "blue", color: "white", border: "none", borderRadius: 4 }}>
          Add Movie
        </button>
      </form>
    </div>
  )
}
