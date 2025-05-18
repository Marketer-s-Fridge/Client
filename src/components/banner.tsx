import React from "react";

interface BannerProps {
  title: string;
}

export default function Banner({ title }: BannerProps) {
  return (
    <section className="main-red py-10 text-center">
      <h1 className="text-white text-2xl font-bold">{title}</h1>
    </section>
  );
}
