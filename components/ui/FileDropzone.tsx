"use client";

import { useRef, useState, DragEvent, ChangeEvent } from "react";
import { Upload, FileText, X, CheckCircle2 } from "lucide-react";

interface FileDropzoneProps {
  label: string;
  accept?: string;
  file: File | null;
  onFile: (f: File | null) => void;
  hint?: string;
}

export default function FileDropzone({ label, accept = ".pdf,.docx", file, onFile, hint }: FileDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) onFile(f);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) onFile(f);
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-2">
      <p className="label-text">{label}</p>

      {file ? (
        <div className="card-elevated flex items-center gap-3 px-4 py-4 animate-fade-in">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: "rgba(0,206,201,0.12)", border: "1px solid rgba(0,206,201,0.25)" }}>
            <CheckCircle2 size={16} style={{ color: "var(--success)" }} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate" style={{ fontFamily: "DM Sans, sans-serif", color: "var(--text-primary)" }}>
              {file.name}
            </p>
            <p className="text-xs mt-0.5" style={{ color: "var(--text-secondary)" }}>{formatSize(file.size)}</p>
          </div>
          <button
            onClick={() => onFile(null)}
            className="p-1 rounded-md transition-colors"
            style={{ color: "var(--text-muted)" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--danger)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
            aria-label="Remove file"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          className="relative rounded-2xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all duration-200"
          style={{
            border: `2px dashed ${dragging ? "var(--accent)" : "var(--border-hover)"}`,
            background: dragging ? "rgba(108,92,231,0.06)" : "transparent",
            transform: dragging ? "scale(1.01)" : "scale(1)",
          }}
        >
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-200"
            style={{ background: dragging ? "rgba(108,92,231,0.15)" : "var(--surface-elevated)" }}>
            <Upload size={20} style={{ color: dragging ? "var(--accent-light)" : "var(--text-secondary)" }} />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium" style={{ fontFamily: "DM Sans, sans-serif", color: "var(--text-primary)" }}>
              {dragging ? "Drop it here" : "Drop file or click to browse"}
            </p>
            <p className="text-xs mt-1" style={{ color: "var(--text-secondary)" }}>
              {hint ?? "Supports PDF and DOCX"}
            </p>
          </div>
          <div className="flex items-center gap-2 mt-1">
            {["PDF", "DOCX"].map((t) => (
              <span key={t} className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium"
                style={{ background: "rgba(108,92,231,0.1)", color: "var(--accent-light)", border: "1px solid rgba(108,92,231,0.2)" }}>
                <FileText size={10} /> {t}
              </span>
            ))}
          </div>
        </div>
      )}

      <input ref={inputRef} type="file" accept={accept} className="hidden" onChange={handleChange} />
    </div>
  );
}
