import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { colorSchemes, type IThumbnail, type ThumbnailStyle, type AspectRatio } from "../assets/assets";

import SoftBackdrop from "../components/SoftBackdrop";
import AspectRatioSelector from "../components/AspectRatioSelector";
import StyleSelector from "../components/StyleSelector";
import ColorSchemeSelector from "../components/ColorSchemeSelector";
import PreviewPanel from "../components/PreviewPanel";
import { thumbnailAPI } from "../lib/api";
import { useAuth } from "../context/AuthContext";

const Generate = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [title, setTitle] = useState("");
  const [additionalDetails, setAdditionalDetails] = useState("");
  const [thumbnail, setThumbnail] = useState<IThumbnail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [aspectRatio, setAspectRatio] = useState<AspectRatio>("16:9");
  const [colorSchemeId, setColorSchemeId] = useState<string>(colorSchemes[0].id);
  const [style, setStyle] = useState<ThumbnailStyle>("Bold & Graphic");
  const [styleDropDownOpen, setStyleDropDownOpen] = useState(false);

  const handleGenerate = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    if (!title.trim()) {
      setError("Please enter a title or topic.");
      return;
    }

    setLoading(true);
    setError("");
    setThumbnail(null);

    try {
      const data = await thumbnailAPI.generate({
        title: title.trim(),
        style,
        aspect_ratio: aspectRatio,
        color_scheme: colorSchemeId,
        user_prompt: additionalDetails,
      });
      setThumbnail(data.thumbnail);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to generate thumbnail");
    } finally {
      setLoading(false);
    }
  };

  const fetchThumbnail = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const data = await thumbnailAPI.getById(id);
      const t = data.thumbnail;
      setThumbnail(t);
      setTitle(t.title || "");
      setAdditionalDetails(t.user_prompt || "");
      setColorSchemeId(t.color_scheme || colorSchemes[0].id);
      setAspectRatio(t.aspect_ratio || "16:9");
      setStyle(t.style || "Bold & Graphic");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load thumbnail");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchThumbnail();
    }
  }, [id]);

  return (
    <>
      <SoftBackdrop />
      <div className="pt-24 min-h-screen">
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-28 lg:pb-8">
          <div className="grid lg:grid-cols-[400px_1fr] gap-8">
            {/* Left Panel */}
            <div className={`space-y-6 ${id ? "pointer-events-none" : ""}`}>
              <div className="p-6 rounded-2xl bg-white/10 border border-white/10 shadow-xl space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-zinc-100 mb-1">Create Your Thumbnail</h2>
                  <p className="text-sm text-zinc-400">Describe your vision and let AI bring it to life</p>
                </div>

                {error && (
                  <p className="text-sm text-red-400 bg-red-400/10 rounded-lg px-3 py-2">{error}</p>
                )}

                <div className="space-y-5">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-zinc-100">Title or Topic</label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      maxLength={100}
                      placeholder="e.g., 10 Tips for Better Sleep"
                      className="w-full px-4 py-3 rounded-lg border border-white/10 bg-black/20 text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                    <div className="flex justify-end">
                      <span className="text-xs text-zinc-400">{title.length}/100</span>
                    </div>
                  </div>

                  <AspectRatioSelector value={aspectRatio} onChange={setAspectRatio} />
                  <StyleSelector value={style} onChange={setStyle} isOpen={styleDropDownOpen} setIsOpen={setStyleDropDownOpen} />
                  <ColorSchemeSelector value={colorSchemeId} onChange={setColorSchemeId} />

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-zinc-100">
                      Additional Prompts <span className="text-zinc-400 text-xs">(optional)</span>
                    </label>
                    <textarea
                      value={additionalDetails}
                      onChange={(e) => setAdditionalDetails(e.target.value)}
                      rows={3}
                      placeholder="Add any specific elements, mood, or style preferences..."
                      className="w-full px-4 py-3 rounded-lg border border-white/10 bg-white/10 text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-pink-500 resize-none"
                    />
                  </div>
                </div>

                {!id && (
                  <button
                    onClick={handleGenerate}
                    className="text-[15px] w-full py-3.5 rounded-xl font-medium bg-gradient-to-b from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 disabled:cursor-not-allowed text-white"
                    disabled={loading}
                  >
                    {loading ? "Generating..." : "Generate Thumbnail"}
                  </button>
                )}
              </div>
            </div>

            {/* Right Panel */}
            <div>
              <h2 className="text-lg font-semibold text-zinc-100 mb-4">Preview</h2>
              <PreviewPanel thumbnail={thumbnail} isLoading={loading} aspectRatio={aspectRatio} />
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default Generate;
