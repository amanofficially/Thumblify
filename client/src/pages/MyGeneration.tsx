import { useEffect, useState } from "react";
import SoftBackdrop from "../components/SoftBackdrop";
import { type IThumbnail } from "../assets/assets";
import { Link, useNavigate } from "react-router-dom";
import { ArrowUpRightIcon, DownloadIcon, TrashIcon } from "lucide-react";
import { thumbnailAPI } from "../lib/api";
import { useAuth } from "../context/AuthContext";

const MyGeneration = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const aspectRatioClassMap: Record<string, string> = {
    "16:9": "aspect-video",
    "1:1": "aspect-square",
    "9:16": "aspect-[9/16]",
  };

  const [thumbnails, setThumbnails] = useState<IThumbnail[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const fetchThumbnails = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    setLoading(true);
    try {
      const data = await thumbnailAPI.getAll();
      setThumbnails(data.thumbnails);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load thumbnails");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await thumbnailAPI.delete(id);
      setThumbnails((prev) => prev.filter((t) => t._id !== id));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to delete");
    }
  };

  // ✅ Proper download — fetches image as blob, triggers real file download
  const handleDownload = async (imageUrl: string, title: string, thumbId: string) => {
    setDownloadingId(thumbId);
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `${title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}_thumbnail.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    } catch {
      // fallback — open in new tab if blob download fails (e.g. CORS on some CDNs)
      window.open(imageUrl, "_blank");
    } finally {
      setDownloadingId(null);
    }
  };

  useEffect(() => {
    fetchThumbnails();
  }, [isAuthenticated]);

  return (
    <>
      <SoftBackdrop />
      <div className="mt-32 min-h-screen px-6 md:px-16 lg:px-24 xl:px-32">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-zinc-200">My Generations</h1>
          <p className="mt-1 text-sm text-zinc-400">View and manage all your AI-generated thumbnails</p>
        </div>

        {error && <p className="mb-6 text-sm text-red-400 bg-red-400/10 rounded-lg px-3 py-2">{error}</p>}

        {loading && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-[260px] animate-pulse rounded-2xl border border-white/10 bg-white/5"></div>
            ))}
          </div>
        )}

        {!loading && thumbnails.length === 0 && (
          <div className="py-24 text-center">
            <h3 className="text-lg font-semibold text-zinc-200">No thumbnails yet</h3>
            <p className="mt-2 text-sm text-zinc-400">Generate your first thumbnail to see it here</p>
          </div>
        )}

        {!loading && thumbnails.length > 0 && (
          <div className="columns-1 gap-8 sm:columns-2 lg:columns-3 2xl:columns-4">
            {thumbnails.map((thumb: IThumbnail) => {
              const aspectRatioClass = aspectRatioClassMap[thumb.aspect_ratio || "16:9"];
              const isDownloading = downloadingId === thumb._id;
              return (
                <div
                  key={thumb._id}
                  onClick={() => navigate(`/generate/${thumb._id}`)}
                  className="group relative mb-8 cursor-pointer break-inside-avoid rounded-2xl border border-white/10 bg-white/5 shadow-xl transition"
                >
                  <div className={`relative overflow-hidden rounded-t-2xl ${aspectRatioClass} bg-black`}>
                    {thumb.image_url ? (
                      <img
                        src={thumb.image_url}
                        alt={thumb.title}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-white">
                        {thumb.isGenerating ? "Generating..." : "No Image"}
                      </div>
                    )}
                  </div>

                  <div className="space-y-3 p-4">
                    <h3 className="line-clamp-2 text-sm font-semibold text-zinc-100">{thumb.title}</h3>
                    <div className="flex flex-wrap gap-2 text-xs text-zinc-400">
                      <span className="rounded bg-white/10 px-2 py-0.5">{thumb.style}</span>
                      <span className="rounded bg-white/10 px-2 py-0.5">{thumb.color_scheme}</span>
                      <span className="rounded bg-white/10 px-2 py-0.5">{thumb.aspect_ratio}</span>
                    </div>
                    <p className="text-xs text-zinc-500">{new Date(thumb.createdAt!).toDateString()}</p>
                  </div>

                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="absolute bottom-2 right-2 flex gap-1.5 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition"
                  >
                    <button onClick={() => handleDelete(thumb._id)} title="Delete">
                      <TrashIcon className="size-6 rounded bg-black/50 p-1 text-white transition active:bg-pink-600 md:hover:bg-pink-600" />
                    </button>

                    <button
                      onClick={() => handleDownload(thumb.image_url!, thumb.title, thumb._id)}
                      disabled={isDownloading}
                      title="Download"
                    >
                      {isDownloading ? (
                        <span className="flex size-6 items-center justify-center rounded bg-black/50">
                          <svg className="size-3 animate-spin text-white" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                          </svg>
                        </span>
                      ) : (
                        <DownloadIcon className="size-6 rounded bg-black/50 p-1 text-white transition active:bg-pink-600 md:hover:bg-pink-600" />
                      )}
                    </button>

                    <Link
                      target="_blank"
                      to={`/preview?thumbnail_url=${encodeURIComponent(thumb.image_url!)}&title=${encodeURIComponent(thumb.title)}`}
                      title="Preview"
                    >
                      <ArrowUpRightIcon className="size-6 rounded bg-black/50 p-1 text-white transition active:bg-pink-600 md:hover:bg-pink-600" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
};

export default MyGeneration;
