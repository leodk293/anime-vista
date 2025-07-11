"use client";
import React, { useState, useEffect, use } from "react";
import Loader from "../../../../../components/loader/Loader";
import Image from "next/image";
import { nanoid } from "nanoid";
import Link from "next/link";
import ReadMore from "../../../../../components/readMore";

export default function ReviewsPage({ params }) {
  const resolvedParams = use(params);
  const { animeId } = resolvedParams;

  const [reviews, setReviews] = useState({
    error: false,
    loading: false,
    data: [],
  });

  async function fetchAnimeReviews() {
    setReviews({
      error: false,
      loading: true,
      data: [],
    });
    try {
      const response = await fetch(
        `https://api.jikan.moe/v4/anime/${animeId}/reviews`
      );
      if (!response.ok) {
        throw new Error(`Failed to fetch reviews: ${response.status}`);
      }
      const result = await response.json();
      setReviews({
        error: false,
        loading: false,
        data: result.data,
      });
    } catch (error) {
      console.error(error.message);
      setReviews({
        error: true,
        loading: false,
        data: [],
      });
    }
  }

  useEffect(() => {
    fetchAnimeReviews();
  }, [animeId]);

  // Format date helper
  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (reviews.loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto"></div>
          <p className="text-slate-300">Loading reviews...</p>
        </div>
      </div>
    );
  }

  if (reviews.error) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="text-center p-8 bg-red-900/20 border border-red-500/30 rounded-xl backdrop-blur-sm max-w-md">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.082 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-red-400 mb-2">
            Failed to Load Reviews
          </h2>
          <p className="text-red-300/80 mb-4">
            Something went wrong while fetching reviews
          </p>
          <button
            onClick={fetchAnimeReviews}
            className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-lg text-red-300 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">
              MyAnimeList User Reviews
            </h1>
            <p className="text-slate-400">
              {reviews.data?.length > 0
                ? `${reviews.data.length} review${
                    reviews.data.length !== 1 ? "s" : ""
                  } found`
                : "Community feedback and opinions"}
            </p>
          </div>
        </div>
        <div className="h-1 w-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
      </div>

      {/* Reviews Content */}
      {reviews.data && reviews.data.length > 0 ? (
        <div className="space-y-6">
          {reviews.data.map((review) => (
            <div
              key={nanoid()}
              className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300 hover:border-white/20"
            >
              {/* Review Header */}
              <div className="flex items-start gap-4 mb-4">
                <div className="relative flex-shrink-0">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full opacity-75 group-hover:opacity-100 transition duration-300"></div>
                  <Link href={review?.user?.url} target="_blank">
                    <div className="relative">
                      <Image
                        width={48}
                        height={48}
                        src={
                          review.user?.images?.jpg?.image_url ||
                          "/default-avatar.png"
                        }
                        alt={review.user?.username || "Anonymous"}
                        className="object-cover rounded-full border-2 border-white/20"
                        onError={(e) => {
                          e.target.src =
                            "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjQiIGN5PSIyNCIgcj0iMjQiIGZpbGw9IiM0MzM4NjAiLz4KPHN2ZyB4PSIxMiIgeT0iMTIiIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiM5Q0E0QUYiIHN0cm9rZS13aWR0aD0iMiI+CjxwYXRoIGQ9Im0yMCAxOC0xMC05Ii8+CjxwYXRoIGQ9Im0yMCAxOC0xMC05Ii8+CjxjaXJjbGUgY3g9IjEyIiBjeT0iMTIiIHI9IjMiLz4KPHN2Zz4KPC9zdmc+";
                        }}
                      />
                    </div>
                  </Link>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-white group-hover:text-purple-300 transition-colors">
                      {review.user?.username || "Anonymous User"}
                    </h3>
                    {review.score && (
                      <div className="flex items-center gap-1 bg-amber-500/20 px-2 py-1 rounded-full border border-amber-500/30">
                        <svg
                          className="w-3 h-3 text-amber-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="text-amber-300 text-xs font-medium">
                          {review.score}/10
                        </span>
                      </div>
                    )}
                  </div>

                  {review.date && (
                    <p className="text-slate-400 text-sm flex items-center gap-1">
                      <svg
                        className="w-3 h-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      {formatDate(review.date)}
                    </p>
                  )}
                </div>
              </div>

              {/* Review Content */}
              <div className="space-y-3">
                <div className="prose prose-invert max-w-none">
                  <ReadMore text={review.review} textSize={'text-sm'} maxLength={1000} />
                </div>

                {/* Review Actions */}
                <div className="flex items-center gap-4 text-xs text-slate-400">
                  {review.reactions && (
                    <div className="flex items-center gap-3">
                      {review.reactions.overall > 0 && (
                        <span className="flex items-center gap-1">
                          <svg
                            className="w-3 h-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                            />
                          </svg>
                          {review.reactions.overall} helpful
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-12 max-w-md mx-auto">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-500/20 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-slate-300 mb-2">
              No Reviews Yet
            </h3>
            <p className="text-slate-400">
              Be the first to share your thoughts about this anime!
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
