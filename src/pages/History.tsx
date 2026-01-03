import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Trash2 } from "lucide-react";
import { getGamesSummary, deleteMultipleGames, setCurrentGame } from "@/utils/storage";
import { GameSummary } from "@/types/game";
import { GameCard } from "@/components/GameCard";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { toast } from "sonner";

const History = () => {
  const navigate = useNavigate();
  const [games, setGames] = useState<GameSummary[]>([]);
  const [selectedGames, setSelectedGames] = useState<Set<string>>(new Set());
  const [isSelecting, setIsSelecting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    loadGames();
  }, []);

  const loadGames = () => {
    const loadedGames = getGamesSummary().sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
    setGames(loadedGames);
  };

  const handleSelectGame = (gameId: string) => {
    if (isSelecting) {
      const newSelected = new Set(selectedGames);
      if (newSelected.has(gameId)) {
        newSelected.delete(gameId);
      } else {
        newSelected.add(gameId);
      }
      setSelectedGames(newSelected);
    } else {
      setCurrentGame(gameId);
      navigate(`/game/${gameId}`);
    }
  };

  const handleDeleteSelected = () => {
    deleteMultipleGames(Array.from(selectedGames));
    setSelectedGames(new Set());
    setIsSelecting(false);
    loadGames();
    setShowDeleteConfirm(false);
    toast.success("Parties supprimées");
  };

  const toggleSelectMode = () => {
    if (isSelecting) {
      setSelectedGames(new Set());
    }
    setIsSelecting(!isSelecting);
  };

  return (
    <div className="min-h-screen bg-background domino-pattern">
      {/* Header */}
      <header className="sticky top-0 bg-background/95 backdrop-blur border-b border-border z-10">
        <div className="flex items-center justify-between px-4 py-4 max-w-md mx-auto">
          <button
            onClick={() => navigate("/")}
            className="p-2 -ml-2 rounded-lg hover:bg-secondary transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-cream" />
          </button>
          <h1 className="font-display text-xl font-bold text-cream">
            Historique
          </h1>
          {games.length > 0 && (
            <button
              onClick={toggleSelectMode}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                isSelecting
                  ? "bg-gold text-primary-foreground"
                  : "text-cream hover:bg-secondary"
              }`}
            >
              {isSelecting ? "Annuler" : "Sélectionner"}
            </button>
          )}
        </div>
      </header>

      {/* Content */}
      <main className="px-4 py-6 max-w-md mx-auto">
        {games.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">
              Aucune partie sauvegardée
            </p>
            <Button
              onClick={() => navigate("/new-game")}
              className="bg-gold text-primary-foreground hover:bg-gold-glow"
            >
              Créer une partie
            </Button>
          </div>
        ) : (
          <>
            <p className="text-muted-foreground text-sm mb-4">
              {games.length} partie{games.length !== 1 ? "s" : ""} sauvegardée{games.length !== 1 ? "s" : ""}
            </p>

            <div className="space-y-3">
              {games.map((game) => (
                <GameCard
                  key={game.id}
                  game={game}
                  onSelect={() => handleSelectGame(game.id)}
                  selectable={isSelecting}
                  selected={selectedGames.has(game.id)}
                />
              ))}
            </div>
          </>
        )}
      </main>

      {/* Delete footer */}
      {isSelecting && selectedGames.size > 0 && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/95 backdrop-blur border-t border-border">
          <div className="max-w-md mx-auto">
            <Button
              onClick={() => setShowDeleteConfirm(true)}
              className="w-full bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Supprimer {selectedGames.size} partie{selectedGames.size !== 1 ? "s" : ""}
            </Button>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        title="Supprimer les parties ?"
        description={`Vous allez supprimer ${selectedGames.size} partie${selectedGames.size !== 1 ? "s" : ""}. Cette action est irréversible.`}
        confirmLabel="Supprimer"
        onConfirm={handleDeleteSelected}
        variant="destructive"
      />
    </div>
  );
};

export default History;
