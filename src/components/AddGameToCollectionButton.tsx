"use client";

import { useState } from "react";
import { AddGameToCollectionModal } from "@/components/AddGameToCollectionModal";
import type { UserGame, Game } from "@prisma/client";

interface AddGameToCollectionButtonProps {
  collectionId: string;
  userGames: (UserGame & { game: Game })[];
}

export function AddGameToCollectionButton({
  collectionId,
  userGames,
}: AddGameToCollectionButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="rounded-md bg-white text-black px-4 py-2 font-medium transition-all hover:bg-red-900 hover:text-white active:bg-red-950"
      >
        + Добавить игры
      </button>

      {isOpen && (
        <AddGameToCollectionModal
          collectionId={collectionId}
          userGames={userGames}
          onClose={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
