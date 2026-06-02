"use client";

import UserMovieList from "@/app/components/UserMovieList";

export default function WatchlistPage() {
  return (
    <UserMovieList
      listType="WATCHLIST"
      title="Watchlist"
      icon="bi-bookmark-fill"
      emptyMsg="No has agregado ninguna película a tu watchlist."
    />
  );
}
