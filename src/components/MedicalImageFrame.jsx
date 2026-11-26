import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import { Check, Copy, Download, Lock, Maximize2, RotateCcw, X, ZoomIn, ZoomOut } from "lucide-react";
import { useApp } from "../context/AppContext";

export default function MedicalImageFrame({
  src,
  alt = "",
  title = "",
  caption = "",
  className = "",
  style = {},
  imgStyle = {},
  loading = "lazy",
  onLoad,
  allowFocus = true,
  compactBadge = false
}) {
  const { user } = useApp();
  const canCopy = Boolean(user);

  const [focusOpen, setFocusOpen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [guardNotice, setGuardNotice] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!guardNotice) return;
    const t = setTimeout(() => setGuardNotice(false), 2600);
    return () => clearTimeout(t);
  }, [guardNotice]);

  useEffect(() => {
    if (!focusOpen) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") setFocusOpen(false);
      if (e.key === "+" || e.key === "=") setZoom((z) => Math.min(2.6, Number((z + 0.25).toFixed(2))));
      if (e.key === "-") setZoom((z) => Math.max(0.6, Number((z - 0.25).toFixed(2))));
      if (!canCopy && (e.ctrlKey || e.metaKey) && ["c", "s", "p", "u"].includes(e.key.toLowerCase())) {
        e.preventDefault();
        setGuardNotice(true);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [focusOpen, canCopy]);

  const handleBlockedContext = (e) => {
    if (canCopy) return;
    e.preventDefault();
    e.stopPropagation();
    setGuardNotice(true);
  };

  const handleBlockedDrag = (e) => {
    if (canCopy) return;
    e.preventDefault();
  };

  const openFocus = (e) => {
    if (!allowFocus) return;
    e.stopPropagation();
    setZoom(1);
    setFocusOpen(true);
  };

  const handleCopyImage = async () => {
    if (!canCopy || !src) return;
    try {
      const img = new Image();
      img.crossOrigin = "anonymous";
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = src;
      });
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth || 1280;
      canvas.height = img.naturalHeight || 800;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
      if (blob && navigator.clipboard && typeof window.ClipboardItem !== "undefined") {
        await navigator.clipboard.write([new window.ClipboardItem({ "image/png": blob })]);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        return;
      }
    } catch {
      // Fallback: copy direct URL for signed-in users
    }
    try {
      await navigator.clipboard.writeText(window.location.origin + src);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const displayTitle = title || caption || alt || "Clinical Illustration Plate";

  return (
    <>
      <div
        className={`nu-img-protect-wrap ${canCopy ? "is-unlocked" : "is-protected"} ${className}`}
        style={style}
        onContextMenu={handleBlockedContext}
        onDragStart={handleBlockedDrag}
        onCopy={handleBlockedContext}
      >
        <img
          src={src}
          alt={alt}
          loading={loading}
          onLoad={onLoad}
          draggable={canCopy}
          onContextMenu={handleBlockedContext}
          onDragStart={handleBlockedDrag}
          style={imgStyle}
        />

        {!canCopy && (
          <div
            className="nu-img-shield"
            aria-hidden="true"
            onClick={allowFocus ? openFocus : undefined}
            onContextMenu={handleBlockedContext}
            onDragStart={handleBlockedDrag}
          />
        )}

        {allowFocus && (
          <button
            type="button"
            className={`nu-img-focus-btn ${compactBadge ? "is-compact" : ""}`}
            onClick={openFocus}
            title="Open Focus & Zoom view"
            aria-label={`Focus and zoom ${displayTitle}`}
          >
            <Maximize2 size={compactBadge ? 12 : 14} />
            {!compactBadge && <span>Focus / Zoom</span>}
          </button>
        )}

        {guardNotice && !canCopy && (
          <div className="nu-img-guard-toast" role="status">
            <Lock size={12} />
            <span>Sign in to copy or save study diagrams</span>
          </div>
        )}
      </div>

      {focusOpen &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            className="nu-img-focus-backdrop"
            role="dialog"
            aria-modal="true"
            aria-label={displayTitle}
            onClick={() => setFocusOpen(false)}
            onContextMenu={handleBlockedContext}
          >
            <div className="nu-img-focus-modal" onClick={(e) => e.stopPropagation()}>
              <div className="nu-img-focus-toolbar">
                <div className="nu-img-focus-title">{displayTitle}</div>

                <div className="nu-img-focus-actions">
                  <button
                    type="button"
                    className="nu-focus-tool-btn"
                    onClick={() => setZoom((z) => Math.max(0.6, Number((z - 0.25).toFixed(2))))}
                    aria-label="Zoom out"
                    title="Zoom out (-)"
                  >
                    <ZoomOut size={15} />
                    <span>Out</span>
                  </button>
                  <span className="nu-focus-zoom-val">{Math.round(zoom * 100)}%</span>
                  <button
                    type="button"
                    className="nu-focus-tool-btn"
                    onClick={() => setZoom((z) => Math.min(2.6, Number((z + 0.25).toFixed(2))))}
                    aria-label="Zoom in"
                    title="Zoom in (+)"
                  >
                    <ZoomIn size={15} />
                    <span>In</span>
                  </button>
                  <button
                    type="button"
                    className="nu-focus-tool-btn"
                    onClick={() => setZoom(1)}
                    aria-label="Reset zoom"
                    title="Reset zoom"
                  >
                    <RotateCcw size={14} />
                  </button>

                  {canCopy ? (
                    <>
                      <button
                        type="button"
                        className="nu-focus-tool-btn is-accent"
                        onClick={handleCopyImage}
                      >
                        {copied ? <Check size={14} /> : <Copy size={14} />}
                        <span>{copied ? "Copied!" : "Copy Image"}</span>
                      </button>
                      <a
                        href={src}
                        download
                        className="nu-focus-tool-btn is-accent"
                      >
                        <Download size={14} />
                        <span>Download</span>
                      </a>
                    </>
                  ) : (
                    <Link
                      to="/login"
                      className="nu-focus-lock-link"
                      onClick={() => setFocusOpen(false)}
                    >
                      <Lock size={13} />
                      <span>Sign in to copy</span>
                    </Link>
                  )}

                  <button
                    type="button"
                    className="nu-focus-close-btn"
                    onClick={() => setFocusOpen(false)}
                    aria-label="Close focus view"
                  >
                    <X size={17} />
                  </button>
                </div>
              </div>

              <div
                className={`nu-img-focus-stage ${canCopy ? "is-unlocked" : "is-protected"}`}
                onWheel={(e) => {
                  if (e.ctrlKey || e.metaKey || Math.abs(e.deltaY) > 0) {
                    const delta = e.deltaY < 0 ? 0.15 : -0.15;
                    setZoom((z) => Math.min(2.6, Math.max(0.6, Number((z + delta).toFixed(2)))));
                  }
                }}
              >
                <div
                  className="nu-img-focus-inner"
                  style={{ transform: `scale(${zoom})` }}
                  onContextMenu={handleBlockedContext}
                  onDragStart={handleBlockedDrag}
                >
                  <img
                    src={src}
                    alt={alt || displayTitle}
                    draggable={canCopy}
                    onContextMenu={handleBlockedContext}
                    onDragStart={handleBlockedDrag}
                  />
                  {!canCopy && (
                    <div
                      className="nu-img-shield"
                      aria-hidden="true"
                      onContextMenu={handleBlockedContext}
                      onDragStart={handleBlockedDrag}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
