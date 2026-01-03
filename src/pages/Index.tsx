import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus, History, FolderOpen } from "lucide-react";
import { getGamesSummary, getCurrentGameId, getGame } from "@/utils/storage";
import { useEffect, useState } from "react";
import { GameSummary } from "@/types/game";

const Index = () => {
  const navigate = useNavigate();
  const [currentGame, setCurrentGame] = useState<GameSummary | null>(null);
  const [hasHistory, setHasHistory] = useState(false);

  useEffect(() => {
    const games = getGamesSummary();
    setHasHistory(games.length > 0);
    
    const currentId = getCurrentGameId();
    if (currentId) {
      const game = getGame(currentId);
      if (game) {
        setCurrentGame({
          id: game.id,
          playerNames: game.players.map(p => p.name),
          scores: game.players.map(p => p.score),
          createdAt: game.createdAt,
          updatedAt: game.updatedAt,
        });
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-background domino-pattern flex flex-col">
      {/* Header */}
      <header className="pt-12 pb-8 px-6 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gold/10 border border-gold/30 mb-4">
          <div className="grid grid-cols-2 gap-0.5">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="w-2.5 h-2.5 rounded-full bg-gold" />
            ))}
          </div>
        </div>
        <h1 className="font-display text-3xl font-bold text-cream mb-2">
          Domino Score
        </h1>
        <p className="text-muted-foreground">
          Gérez vos parties de domino facilement
        </p>
      </header>

      {/* Main content */}
      <main className="flex-1 px-6 pb-8">
        <div className="max-w-md mx-auto space-y-4">
          {/* Continue current game */}
          {currentGame && (
            <button
              onClick={() => navigate(`/game/${currentGame.id}`)}
              className="w-full game-card-elevated border-gold/50 text-left animate-slide-up"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-gold/10">
                  <FolderOpen className="w-5 h-5 text-gold" />
                </div>
                <div>
                  <h3 className="font-semibold text-cream">Continuer la partie</h3>
                  <p className="text-sm text-muted-foreground">
                    {currentGame.playerNames.join(", ")}
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                {currentGame.playerNames.map((name, i) => (
                  <div key={i} className="flex-1 text-center p-2 rounded-lg bg-secondary">
                    <div className="text-xs text-muted-foreground truncate">{name}</div>
                    <div className="text-gold font-bold">{currentGame.scores[i]}</div>
                  </div>
                ))}
              </div>
            </button>
          )}

          {/* New game */}
          <Button
            onClick={() => navigate("/new-game")}
            className="w-full h-16 bg-gold text-primary-foreground hover:bg-gold-glow text-lg font-semibold gold-glow"
          >
            <Plus className="w-6 h-6 mr-2" />
            Nouvelle partie
          </Button>

          {/* History */}
          <Button
            onClick={() => navigate("/history")}
            variant="outline"
            disabled={!hasHistory}
            className="w-full h-14 border-border text-cream hover:bg-secondary hover:text-cream disabled:opacity-50"
          >
            <History className="w-5 h-5 mr-2" />
            Historique des parties
          </Button>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center">
        <p className="text-muted-foreground text-sm">
          ANDRIANTSOA Hermenio M.
        </p>
      </footer>
    </div>
  );
};

export default Index;
