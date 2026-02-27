"use client";
import React from "react";
import { useState, useEffect, use } from "react";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import Image from "next/image";

export default function Community({ params }) {
  const { status, data: session } = useSession();
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingComments, setLoadingComments] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [actionLoading, setActionLoading] = useState(null);
  const resolvedParams = use(params);
  const { animeId } = resolvedParams;

  const success = () => {
    toast.success("Comment Successfully Posted", {
      position: "top-right",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  async function getAnimeTitle() {
    try {
      const res = await fetch(`https://api.jikan.moe/v4/anime/${animeId}`);
      if (!res.ok) throw new Error("An error has occurred");
      const result = await res.json();
      return result.data?.title ?? "Unknown Anime";
    } catch (error) {
      console.error(error.message);
      return "Unknown Anime";
    }
  }

  async function fetchComments() {
    try {
      setLoadingComments(true);
      const res = await fetch(`/api/comments?animeId=${encodeURIComponent(animeId)}`);
      if (!res.ok) throw new Error("Failed to load comments");
      const data = await res.json();
      setComments(data.comments ?? []);
    } catch (error) {
      console.error(error.message);
      setComments([]);
    } finally {
      setLoadingComments(false);
    }
  }

  async function editComments(commentId, newCommentText) {
    if (!session?.user?.id) return;
    const trimmed = (newCommentText ?? editText).trim();
    if (!trimmed) { toast.error("Comment cannot be empty"); return; }
    try {
      setActionLoading(commentId);
      const res = await fetch("/api/comments", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ commentId, userId: session.user.id, comment: trimmed }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        toast.success("Comment updated", { autoClose: 1000 });
        setEditingId(null);
        setEditText("");
        await fetchComments();
      } else {
        toast.error(data.error ?? "Failed to update comment");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setActionLoading(null);
    }
  }

  async function deleteComments(commentId) {
    if (!session?.user?.id) return;
    if (!confirm("Delete this comment?")) return;
    try {
      setActionLoading(commentId);
      const res = await fetch("/api/comments", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ commentId, userId: session.user.id }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        toast.success("Comment deleted");
        await fetchComments();
      } else {
        toast.error(data.error ?? "Failed to delete comment");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setActionLoading(null);
    }
  }

  async function storeComments() {
    if (!session?.user?.id) { toast.error("Please sign in to comment"); return; }
    const trimmed = comment.trim();
    if (!trimmed) { toast.error("Comment cannot be empty"); return; }
    try {
      setLoading(true);
      const animeName = await getAnimeTitle();
      const res = await fetch(`/api/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: session.user.id,
          userName: session.user.name ?? "Anonymous",
          comment: trimmed,
          animeId,
          animeName,
          avatar:
            session.user.image ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(session.user.name ?? "User")}`,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        success();
        setComment("");
        await fetchComments();
      } else {
        toast.error(data.error ?? "Failed to post comment. Try again.");
      }
    } catch (error) {
      toast.error("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handelSubmit(event) {
    event.preventDefault();
    await storeComments();
  }

  useEffect(() => { fetchComments(); }, [animeId]);

  return (
    <div className="w-full mx-auto px-4 py-8 text-gray-100">

      {/* ── Header ── */}
      <div className="flex items-center gap-3 mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-white whitespace-nowrap">
          Community
        </h1>
        <div className="flex-1 h-px bg-gradient-to-r from-violet-500/50 to-transparent" />
        {!loadingComments && (
          <span className="text-xs text-gray-400 bg-white/5 border border-white/10 rounded-full px-3 py-1 whitespace-nowrap">
            {comments.length} {comments.length === 1 ? "comment" : "comments"}
          </span>
        )}
      </div>

      {/* ── Composer ── */}
      <div className="mb-8 rounded-xl bg-white/5 border border-white/10 p-4">
        {status === "authenticated" ? (
          <form onSubmit={handelSubmit} className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              {session.user?.image && (
                <Image
                  src={session.user.image}
                  alt={session.user.name ?? "You"}
                  width={36}
                  height={36}
                  className="rounded-full object-cover ring-2 ring-violet-500/40 shrink-0"
                />
              )}
              <input
                onChange={(e) => setComment(e.target.value)}
                value={comment}
                type="text"
                placeholder="Share your thoughts with the community…"
                disabled={loading}
                className="flex-1 bg-transparent text-gray-100 placeholder-gray-200 text-sm outline-none py-1 border-b border-white/10 focus:border-violet-500 transition-colors disabled:opacity-50"
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading || !comment.trim()}
                className="bg-violet-600 hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors"
              >
                {loading ? "Posting…" : "Post Comment"}
              </button>
            </div>
          </form>
        ) : (
          <p className="text-sm text-gray-200 text-center py-2">
            Sign in to share your thoughts with the community.
          </p>
        )}
      </div>

      {/* ── Comments Section ── */}
      <section>
        <div className="flex items-center gap-3 mb-5">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-200 whitespace-nowrap">
            Discussions
          </h2>
          <div className="flex-1 h-px bg-gray-500" />
        </div>

        {/* Loading */}
        {loadingComments && (
          <div className="flex items-center justify-center gap-2 py-16 text-gray-600">
            <div className="w-4 h-4 border-2 border-gray-600 border-t-violet-500 rounded-full animate-spin" />
            <span className="text-sm">Loading comments…</span>
          </div>
        )}

        {/* Empty */}
        {!loadingComments && comments.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-200 text-sm">No comments yet. Be the first to share!</p>
          </div>
        )}

        {/* Comment List */}
        {!loadingComments && comments.length > 0 && (
          <ul className="flex flex-col gap-3">
            {comments.map((c) => (
              <li
                key={c._id}
                className="group flex gap-3 rounded-xl bg-white/5 hover:bg-white/[0.07] border border-white/[0.06] hover:border-violet-500/20 p-4 transition-all"
              >
                {/* Avatar */}
                {c.avatar ? (
                  <Image
                    src={c.avatar}
                    alt={c.userName}
                    width={38}
                    height={38}
                    className="rounded-full object-cover ring-1 ring-white/10 shrink-0 self-start mt-0.5"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-violet-900/50 border border-violet-500/20 flex items-center justify-center shrink-0 self-start mt-0.5 text-sm font-medium text-violet-300">
                    {c.userName?.[0]?.toUpperCase() ?? "?"}
                  </div>
                )}

                {/* Body */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2 mb-1 flex-wrap">
                    <span className="text-sm font-semibold text-white">{c.userName}</span>
                    {c.createdAt && (
                      <span className="text-xs text-gray-200">
                        {new Date(c.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    )}
                  </div>

                  {editingId === c._id ? (
                    <div className="mt-2 flex flex-col gap-2">
                      <textarea
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        autoFocus
                        rows={3}
                        className="w-full bg-white/5 border border-white/10 focus:border-violet-500 rounded-lg text-gray-100 text-sm px-3 py-2 outline-none resize-none transition-colors"
                        placeholder="Edit your comment…"
                      />
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => editComments(c._id)}
                          disabled={actionLoading === c._id}
                          className="bg-green-600 hover:bg-green-500 disabled:opacity-50 text-white text-xs font-medium px-4 py-1.5 rounded-lg transition-colors"
                        >
                          {actionLoading === c._id ? "Saving…" : "Save"}
                        </button>
                        <button
                          type="button"
                          onClick={() => { setEditingId(null); setEditText(""); }}
                          disabled={actionLoading === c._id}
                          className="bg-white/10 hover:bg-white/15 text-gray-300 text-xs font-medium px-4 py-1.5 rounded-lg transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-300 leading-relaxed break-words whitespace-pre-wrap">
                      {c.comment}
                    </p>
                  )}
                </div>

                {/* Edit / Delete — visible on hover */}
                {editingId !== c._id && String(c.userId) === session?.user?.id && (
                  <div className="flex flex-col gap-1.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity self-start">
                    <button
                      type="button"
                      onClick={() => { setEditingId(c._id); setEditText(c.comment); }}
                      disabled={actionLoading != null}
                      className="text-xs text-gray-400 hover:text-violet-400 bg-white/5 hover:bg-violet-500/10 border border-white/10 hover:border-violet-500/30 disabled:opacity-40 px-3 py-1.5 rounded-lg transition-all"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteComments(c._id)}
                      disabled={actionLoading != null}
                      className="text-xs text-red-400 hover:text-red-300 bg-white/5 hover:bg-red-500/10 border border-white/10 hover:border-red-500/30 disabled:opacity-40 px-3 py-1.5 rounded-lg transition-all"
                    >
                      {actionLoading === c._id ? "…" : "Delete"}
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}