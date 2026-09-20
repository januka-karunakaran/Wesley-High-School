"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Image as ImageIcon, Play, Filter, Grid, List,
  Calendar, ArrowLeft, X, ChevronLeft, ChevronRight,
  Loader2, Search
} from "lucide-react";

interface GalleryItem {
  id: string;
  title: string;
  description?: string;
  category: string;
  mediaType: string; // "photo" | "video"
  mediaUrl: string;
  thumbnailUrl?: string;
  academicYear?: string;
  eventDate?: string;
}

const MOCK_GALLERY: GalleryItem[] = [
  {
    id: "g1", title: "140th Annual Athletic Championship – Track & Field Finals",
    description: "Wesley, Arthur, Mack, and Allen houses compete in the 100m sprint finals at the Annual Athletic Meet 2025.",
    category: "Sports Meet", mediaType: "photo",
    mediaUrl: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800",
    thumbnailUrl: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=400",
    academicYear: "2025", eventDate: "2025-09-14",
  },
  {
    id: "g2", title: "Annual Prize Giving Ceremony – Excellence Awards 2024",
    description: "The Principal presenting the Best Student Award at the 2024 Annual Prize Giving, with distinguished guests from the Ministry of Education.",
    category: "Prize Giving", mediaType: "photo",
    mediaUrl: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800",
    thumbnailUrl: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400",
    academicYear: "2024", eventDate: "2024-12-10",
  },
  {
    id: "g3", title: "Wesley Day Thanksgiving Service – 139th Founders' Day",
    description: "Students and staff assembled at the College Memorial Hall for the annual Wesley Day Thanksgiving Service.",
    category: "Wesley Day", mediaType: "photo",
    mediaUrl: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800",
    thumbnailUrl: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=400",
    academicYear: "2024", eventDate: "2024-10-02",
  },
  {
    id: "g4", title: "Science Fair Exhibition – Senior Category Projects",
    description: "The Wesley Science Society displaying their innovative projects at the Annual School Science Exhibition.",
    category: "Science Fair", mediaType: "photo",
    mediaUrl: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800",
    thumbnailUrl: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=400",
    academicYear: "2025", eventDate: "2025-06-20",
  },
  {
    id: "g5", title: "Cultural Night 2024 – Traditional Dance Performances",
    description: "Students showcasing traditional Tamil and Sinhala cultural dances at the Wesley Cultural Night 2024.",
    category: "Cultural Night", mediaType: "photo",
    mediaUrl: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=800",
    thumbnailUrl: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=400",
    academicYear: "2024", eventDate: "2024-11-15",
  },
  {
    id: "g6", title: "Wesley Cricket XI – Eastern Province Schools Tournament",
    description: "The Wesley High School cricket team in action during the Eastern Province Schools Cricket Tournament 2025.",
    category: "Sports Meet", mediaType: "photo",
    mediaUrl: "https://images.unsplash.com/photo-1624526267942-ab0ff8a3e972?w=800",
    thumbnailUrl: "https://images.unsplash.com/photo-1624526267942-ab0ff8a3e972?w=400",
    academicYear: "2025", eventDate: "2025-07-08",
  },
  {
    id: "g7", title: "New IT Computer Laboratory Inauguration",
    description: "The new 60-seat state-of-the-art computer laboratory inaugurated by the Zonal Director of Education, Kalmunai.",
    category: "School Events", mediaType: "photo",
    mediaUrl: "https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=800",
    thumbnailUrl: "https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=400",
    academicYear: "2025", eventDate: "2025-03-12",
  },
  {
    id: "g8", title: "A/L Results Celebration – National University Entrants 2024",
    description: "Proud students and their parents celebrating outstanding A/L results and university selections for 2024.",
    category: "Prize Giving", mediaType: "photo",
    mediaUrl: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800",
    thumbnailUrl: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=400",
    academicYear: "2024", eventDate: "2024-09-20",
  },
  {
    id: "g9", title: "Inter-School Drama Competition – Wesley Drama Guild",
    description: "The Wesley Drama Guild performing at the Eastern Province Inter-School Drama Competition 2025.",
    category: "Cultural Night", mediaType: "photo",
    mediaUrl: "https://images.unsplash.com/photo-1574267432553-4b4628081c31?w=800",
    thumbnailUrl: "https://images.unsplash.com/photo-1574267432553-4b4628081c31?w=400",
    academicYear: "2025", eventDate: "2025-05-15",
  },
];

const CATEGORIES = ["All", "Sports Meet", "Prize Giving", "Wesley Day", "Science Fair", "Cultural Night", "School Events"];

export default function GalleryPage() {
  const [items, setItems]               = useState<GalleryItem[]>(MOCK_GALLERY);
  const [loading, setLoading]           = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeType, setActiveType]     = useState("All"); // "All" | "photo" | "video"
  const [searchQuery, setSearchQuery]   = useState("");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/v1/gallery");
        if (res.ok) {
          const data: GalleryItem[] = await res.json();
          if (data.length > 0) setItems([...data, ...MOCK_GALLERY]);
        }
      } catch { /* backend offline */ }
      finally { setLoading(false); }
    };
    load();
  }, []);

  const filtered = items.filter(item => {
    const matchesCat  = activeCategory === "All" || item.category === activeCategory;
    const matchesType = activeType === "All" || item.mediaType === activeType;
    const matchesSrch = !searchQuery || item.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesType && matchesSrch;
  });

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);
  const prevSlide = () => setLightboxIndex(i => (i === null || i === 0) ? filtered.length - 1 : i - 1);
  const nextSlide = () => setLightboxIndex(i => (i === null || i === filtered.length - 1) ? 0 : i + 1);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") prevSlide();
      if (e.key === "ArrowRight") nextSlide();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  });

  // Group by category for display
  const categoryAlbums = CATEGORIES.filter(c => c !== "All").map(cat => ({
    name: cat,
    count: items.filter(i => i.category === cat).length,
    thumb: items.find(i => i.category === cat)?.thumbnailUrl,
  })).filter(a => a.count > 0);

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Header */}
      <div className="bg-[#071526] text-white py-10 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto">
          <Link href="/" className="inline-flex items-center gap-1.5 text-amber-400 hover:text-amber-300 text-sm mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-amber-500/20 rounded-lg border border-amber-500/30">
              <ImageIcon className="w-6 h-6 text-amber-400" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-crest">School Gallery & Events Hub</h1>
          </div>
          <p className="text-slate-300 text-sm max-w-2xl">
            A visual chronicle of Wesley High School's sporting glory, academic milestones, cultural heritage, and community celebrations.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10">
        {/* Album Overview */}
        <div className="mb-10">
          <h2 className="text-sm font-bold uppercase tracking-widest text-amber-600 mb-4">Browse Albums</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {categoryAlbums.map(album => (
              <button
                key={album.name}
                onClick={() => setActiveCategory(album.name)}
                className={`relative rounded-xl overflow-hidden aspect-square border-2 transition-all ${
                  activeCategory === album.name ? "border-amber-400 scale-95 shadow-lg" : "border-transparent hover:border-amber-300"
                }`}
              >
                <div
                  className="w-full h-full bg-cover bg-center"
                  style={{ backgroundImage: album.thumb ? `url(${album.thumb})` : undefined }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/10" />
                  <div className="absolute bottom-0 left-0 right-0 p-2 text-left">
                    <p className="text-white text-[11px] font-bold leading-tight">{album.name}</p>
                    <p className="text-slate-300 text-[10px]">{album.count} items</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Filters Row */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6 items-start sm:items-center">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search gallery..."
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* Category pills */}
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                  activeCategory === cat
                    ? "bg-[#071526] text-amber-300 border-amber-500/30"
                    : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Media type toggle */}
          <div className="flex items-center bg-white border border-slate-200 rounded-lg overflow-hidden text-xs font-semibold">
            {["All", "photo", "video"].map(t => (
              <button
                key={t}
                onClick={() => setActiveType(t)}
                className={`px-3 py-2 transition-colors capitalize ${
                  activeType === t ? "bg-[#071526] text-amber-300" : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                {t === "photo" ? <><ImageIcon className="w-3.5 h-3.5 inline mr-1" />Photos</> :
                 t === "video" ? <><Play className="w-3.5 h-3.5 inline mr-1" />Videos</> : "All"}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-24 text-slate-400">
            <Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading gallery...
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-slate-400">No items found.</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {filtered.map((item, idx) => (
              <button
                key={item.id}
                onClick={() => openLightbox(idx)}
                className="group relative rounded-2xl overflow-hidden aspect-video sm:aspect-square bg-slate-200 shadow-sm hover:shadow-xl transition-all hover:scale-[1.02]"
              >
                <img
                  src={item.thumbnailUrl || item.mediaUrl}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all">
                  <p className="text-white text-xs font-bold line-clamp-2">{item.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-amber-300 text-[10px] font-semibold">{item.category}</span>
                    {item.eventDate && (
                      <span className="text-slate-400 text-[10px] flex items-center gap-1">
                        <Calendar className="w-2.5 h-2.5" /> {new Date(item.eventDate).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
                {item.mediaType === "video" && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-black/50 flex items-center justify-center border-2 border-white/50 group-hover:scale-110 transition-transform">
                      <Play className="w-5 h-5 text-white ml-0.5" />
                    </div>
                  </div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && filtered[lightboxIndex] && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
          onClick={closeLightbox}
        >
          <button onClick={closeLightbox} className="absolute top-4 right-4 text-white/70 hover:text-white p-2 z-10">
            <X className="w-6 h-6" />
          </button>
          <button onClick={e => { e.stopPropagation(); prevSlide(); }} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-3 bg-white/10 rounded-full z-10">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button onClick={e => { e.stopPropagation(); nextSlide(); }} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-3 bg-white/10 rounded-full z-10">
            <ChevronRight className="w-6 h-6" />
          </button>

          <div className="max-w-4xl w-full" onClick={e => e.stopPropagation()}>
            <img
              src={filtered[lightboxIndex].mediaUrl}
              alt={filtered[lightboxIndex].title}
              className="w-full max-h-[70vh] object-contain rounded-xl"
            />
            <div className="mt-4 text-center text-white">
              <p className="text-lg font-bold font-crest">{filtered[lightboxIndex].title}</p>
              {filtered[lightboxIndex].description && (
                <p className="text-sm text-slate-300 mt-1">{filtered[lightboxIndex].description}</p>
              )}
              <div className="flex items-center justify-center gap-3 mt-2 text-xs text-amber-400 font-medium">
                <span>{filtered[lightboxIndex].category}</span>
                {filtered[lightboxIndex].eventDate && (
                  <><span>·</span><span>{new Date(filtered[lightboxIndex].eventDate!).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</span></>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-1">{lightboxIndex + 1} / {filtered.length}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
