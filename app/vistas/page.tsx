"use client";

import UserMovieList from "@/app/components/UserMovieList";

export default function VistasPage() {
  return (
    <UserMovieList
      listType="WATCHED"
      title="Películas Vistas"
      icon="bi-eye-fill"
      emptyMsg="No has marcado ninguna película como vista."
    />
  );
}
