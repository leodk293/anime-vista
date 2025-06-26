"use client";
import React from "react";
import { useState, useEffect, use } from "react";
import Loader from "../../../../../components/loader/Loader";
import { nanoid } from "nanoid";

export default function CharactersPage({ params }) {
  const resolvedParams = use(params);
  const { animeId } = resolvedParams;
  

  

  return (
    <div className=" text-white flex flex-col">
      <h1>Characters</h1>
    </div>
  );
}
