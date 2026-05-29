import { useState } from "react";
import type { AspectRatio, IThumbnail } from "../assets/assets";
import { DownloadIcon, ImageIcon, Loader2Icon } from "lucide-react";

const PreviewPanel = ({
  thumbnail,
  isLoading,
  aspectRatio,
}: {
  thumbnail: IThumbnail | null;
  isLoading: boolean;
  aspectRatio: AspectRatio;
}) => {
  const aspectClasses: Record<AspectRatio, string> = {
    "16:9": "aspect-video",
    "1:1": "aspect-square",
    "9:16": "aspect-[9/16]",
  };

  const [downloading, setDownloading] = useState(false);

  // ✅ Proper blob download — saves actual file instead of opening tab
  const onDownload = async () => {
    if (!thumbnail?.image_url) return;
    setDownloading(true);
    try {
      const response = await fetch(thumbnail.image_url);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `${(thumbnail.title || "thumbnail").replace(/[^a-z0-9]/gi, "_").toLowerCase()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    } catch {
      // fallback
      window.open(thumbnail.image_url, "_blank");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="relative mx-auto w-full max-w-4xl rounded-3xl border border-white/10 bg-white/[0.03] p-6 shadow-2xl backdrop-blur-xl">
      <div className={`relative overflow-hidden rounded-2xl ${aspectClasses[aspectRatio]}`}>
        {isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/40">
            <Loader2Icon className="size-8 animate-spin text-zinc-400" />
            <div className="text-center">
              <p className="text-sm font-medium text-zinc-200">AI is creating your thumbnail...</p>
              <p className="mt-1 text-xs text-zinc-400">This may take 20-40 seconds with flux-pro</p>
            </div>
          </div>
        )}

        {!isLoading && thumbnail?.image_url && (
          <div className="group relative h-full w-full">
            <img
              src={thumbnail.image_url}
              alt={thumbnail.title}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 flex items-end justify-center bg-black/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <button
                onClick={onDownload}
                disabled={downloading}
                type="button"
                className="mb-6 flex items-center gap-2 rounded-xl bg-white/30 px-5 py-2.5 text-sm font-medium text-white ring-1 ring-white/40 backdrop-blur-md transition hover:scale-105 active:scale-95 disabled:opacity-60"
              >
                {downloading ? (
                  <Loader2Icon className="size-4 animate-spin" />
                ) : (
                  <DownloadIcon className="size-4" />
                )}
                {downloading ? "Downloading..." : "Download Thumbnail"}
              </button>
            </div>
          </div>
        )}

        {!isLoading && !thumbnail?.image_url && (
          <div className="absolute inset-0 m-2 flex flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed border-white/20 bg-black/25">
            <div className="flex size-20 items-center justify-center rounded-full bg-white/10">
              <ImageIcon className="size-10 text-white opacity-50" />
            </div>
            <div className="px-4 text-center">
              <p className="font-medium text-zinc-200">Generate Your First Thumbnail</p>
              <p className="mt-1 text-xs text-zinc-400">Fill out the form and click Generate</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PreviewPanel;
