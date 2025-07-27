"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

const App = () => {
  return (
    <div className="pt-28">
      <HeroSection />

      <section className="py-16 text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-4xl font-semibold mb-5">
            Ready to{" "}
            <span className="bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">
              Create Something Awesome?
            </span>
          </h2>
          <p className="text-lg text-gray-400 mb-10">
            Be part of a community using AI to edit, design and innovate with ease.
          </p>
          <Link href="/dashboard">
            <Button variant="main" size="lg">
              ✨ Start Now
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default App;
