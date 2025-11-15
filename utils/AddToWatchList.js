'use client'
import { Button } from '@/components/ui/button'
import React from 'react'
import { useSession } from 'next-auth/react'
import { toast } from "react-toastify";
import { useState } from 'react'

export default function AddToList({ animeId, animeName, animeImage, year, season, genres }) {

    const { status, data: session } = useSession();
    const [isLoading, setIsLoading] = useState(false);

    const success = () => {
        toast.success("Added to Watchlist", {
            position: "top-right",
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
        });
    };

    const alreadyAdded = () => {
        toast("Already added to Watchlist", {
            position: "top-right",
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
        });
    };

    const loginAlert = () => {
        toast.error("Login first to add anime to your watchlist.", {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
        });
    };

    async function AddToWatchList() {
        if (status === "unauthenticated") {
            loginAlert();
            return;
        }

        if (status === "loading") {
            toast.info("Please wait for authentication...");
            return;
        }

        if (!animeId || !animeName || !animeImage) {
            toast.error("Missing anime information");
            return;
        }

        // Validate required fields for API
        if (year === undefined || season === undefined || !genres || !Array.isArray(genres)) {
            toast.error("Missing required anime details (year, season, or genres)");
            return;
        }

        if (!session?.user?.id || !session?.user?.name) {
            toast.error("User session is incomplete. Please login again.");
            return;
        }
        setIsLoading(true);
        try {
            const res = await fetch("/api/watch-list", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    animeId: String(animeId),
                    animeTitle: String(animeName),
                    animePoster: String(animeImage),
                    userId: String(session?.user.id),
                    userName: String(session?.user.name),
                    year: Number(year),
                    season: String(season),
                    genres: Array.isArray(genres) 
                        ? genres.map(g => typeof g === 'object' && g !== null ? (g.name || String(g)) : String(g))
                        : [typeof genres === 'object' && genres !== null ? (genres.name || String(genres)) : String(genres)],
                }),
            });

            console.log("Response status:", res.status);

            if (!res.ok) {
                const errorData = await res.json();
                console.error("API Error:", errorData);

                if (res.status === 409) {
                    alreadyAdded();
                } else if (res.status === 400) {
                    toast.error(`Invalid request: ${errorData.error}`);
                } else if (res.status === 500) {
                    toast.error("Server error. Please try again later.");
                } else {
                    toast.error("Failed to add anime to Watchlist");
                }
                return;
            }
            const responseData = await res.json();
            console.log("Success response:", responseData);
            success();

        }
        catch (error) {
            console.error("Network error:", error);

            if (error.name === "TypeError" && error.message.includes("fetch")) {
                toast.error("Network error. Please check your connection.");
            } else if (error.name === "SyntaxError") {
                toast.error("Invalid server response. Please try again.");
            } else {
                toast.error("An unexpected error occurred. Please try again.");
            }

        } finally {
            setIsLoading(false);
        }
    }
    return (
        <Button
            className="border border-white/20 cursor-pointer bg-white/5 mt-4 w-full font-medium text-white text-sm hover:bg-white/10 duration-200"
            onClick={AddToWatchList}
        >
            {isLoading ? "Adding..." : "Add to Watchlist"}
        </Button>
    )
}
