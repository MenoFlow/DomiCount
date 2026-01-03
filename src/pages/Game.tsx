import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus, RotateCcw, Trash2, Home, Target } from "lucide-react";
import { getGame, saveGame, setCurrentGame, deleteGame, generateId } from "@/utils/storage";
import { Game as GameType, Round, Player } from "@/types/game";
import { PlayerCard } from "@/components/PlayerCard";
import { AddPointsDialog } from "@/components/AddPointsDialog";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { VictoryDialog } from "@/components/VictoryDialog";
import { toast } from "sonner";

const Game = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [game, setGame] = useState<GameType | null>(null);
  const [showAddPoints, setShowAddPoints] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showVictory, setShowVictory] = useState(false);
  const [winner, setWinner] = useState<Player | null>(null);

  useEffect(() => {
    if (id) {
      const loadedGame = getGame(id);
      if (loadedGame) {
        setGame(loadedGame);
        setCurrentGame(id);
        // Check if game was already won
        const gameWinner = loadedGame.players.find(p => p.score >= (loadedGame.targetScore || 100));
        if (gameWinner) {
          setWinner(gameWinner);
          setShowVictory(true);
        }
      } else {
        navigate("/");
      }
    }
  }, [id, navigate]);

  if (!game) return null;

  const targetScore = game.targetScore || 100;
  const sortedPlayers = [...game.players].sort((a, b) => b.score - a.score);
  const maxScore = Math.max(...game.players.map((p) => p.score));

  const checkForWinner = (players: Player[]) => {
    const gameWinner = players.find(p => p.score >= targetScore);
    if (gameWinner) {
      setWinner(gameWinner);
      setShowVictory(true);
    }
  };

  const handleAddPoints = (
    winnerId: string,
    losersPoints: { playerId: string; points: number }[]
  ) => {
    const totalPoints = losersPoints.reduce((sum, lp) => sum + lp.points, 0);

    const updatedPlayers = game.players.map((player) => {
      if (player.id === winnerId) {
        return { ...player, score: player.score + totalPoints };
      }
      return player;
    });

    const round: Round = {
      id: generateId(),
      winnerId,
      pointsGained: totalPoints,
      losersPoints,
      timestamp: new Date().toISOString(),
    };

    const updatedGame: GameType = {
      ...game,
      players: updatedPlayers,
      rounds: [...game.rounds, round],
      updatedAt: new Date().toISOString(),
    };

    setGame(updatedGame);
    saveGame(updatedGame);

    const roundWinner = updatedPlayers.find((p) => p.id === winnerId);
    toast.success(`${roundWinner?.name} gagne ${totalPoints} points !`);

    // Check for game winner
    checkForWinner(updatedPlayers);
  };

  const handleResetScores = () => {
    const updatedGame: GameType = {
      ...game,
      players: game.players.map((p) => ({ ...p, score: 0 })),
      rounds: [],
      updatedAt: new Date().toISOString(),
    };

    setGame(updatedGame);
    saveGame(updatedGame);
    setShowResetConfirm(false);
    setWinner(null);
    setShowVictory(false);
    toast.success("Scores réinitialisés");
  };

  const handleDeleteGame = () => {
    deleteGame(game.id);
    setCurrentGame(null);
    toast.success("Partie supprimée");
    navigate("/");
  };

  const handleVictoryNewGame = () => {
    setShowVictory(false);
    navigate("/new-game");
  };

  const handleVictoryRestore = () => {
    setShowVictory(false);
    navigate("/history");
  };

  const handleVictoryDelete = () => {
    handleDeleteGame();
  };

  return (
    <div className="min-h-screen bg-background domino-pattern flex flex-col">
      {/* Header */}
      <header className="sticky top-0 bg-background/95 backdrop-blur border-b border-border z-10">
        <div className="flex items-center justify-between px-4 py-4 max-w-md mx-auto">
          <button
            onClick={() => navigate("/")}
            className="p-2 -ml-2 rounded-lg hover:bg-secondary transition-colors"
          >
            <Home className="w-5 h-5 text-cream" />
          </button>
          <h1 className="font-display text-xl font-bold text-cream">
            Partie en cours
          </h1>
          <div className="w-9" />
        </div>
      </header>

      {/* Target Score Banner */}
      <div className="bg-secondary/50 border-b border-border">
        <div className="flex items-center justify-center gap-2 px-4 py-2 max-w-md mx-auto">
          <Target className="w-4 h-4 text-gold" />
          <span className="text-sm text-muted-foreground">Objectif :</span>
          <span className="text-gold font-bold">{targetScore} points</span>
        </div>
      </div>

      {/* Scores */}
      <main className="flex-1 px-4 py-6 max-w-md mx-auto w-full">
        <div className="space-y-3 mb-6">
          {sortedPlayers.map((player, index) => {
            const rank = index + 1;
            const isLeading = player.score === maxScore && maxScore > 0;
            const progress = Math.min((player.score / targetScore) * 100, 100);
            return (
              <div key={player.id} className="relative">
                <PlayerCard
                  player={player}
                  isLeading={isLeading}
                  rank={rank}
                />
                {/* Progress bar */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-secondary rounded-b-xl overflow-hidden">
                  <div 
                    className="h-full bg-gold transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Rounds info */}
        <div className="text-center text-muted-foreground text-sm mb-6">
          {game.rounds.length} manche{game.rounds.length !== 1 ? "s" : ""} jouée{game.rounds.length !== 1 ? "s" : ""}
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <Button
            onClick={() => setShowAddPoints(true)}
            className="w-full h-14 bg-gold text-primary-foreground hover:bg-gold-glow text-lg font-semibold gold-glow"
            disabled={showVictory}
          >
            <Plus className="w-5 h-5 mr-2" />
            Nouvelle manche
          </Button>

          <div className="flex gap-3">
            <Button
              onClick={() => setShowResetConfirm(true)}
              variant="outline"
              className="flex-1 border-border text-cream hover:bg-secondary"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Réinitialiser
            </Button>
            <Button
              onClick={() => setShowDeleteConfirm(true)}
              variant="outline"
              className="flex-1 border-border text-destructive hover:bg-destructive/10 hover:text-destructive"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Supprimer
            </Button>
          </div>
        </div>
      </main>

      {/* Dialogs */}
      <AddPointsDialog
        open={showAddPoints}
        onOpenChange={setShowAddPoints}
        players={game.players}
        onConfirm={handleAddPoints}
      />

      <ConfirmDialog
        open={showResetConfirm}
        onOpenChange={setShowResetConfirm}
        title="Réinitialiser les scores ?"
        description="Tous les scores seront remis à zéro. Les noms des joueurs seront conservés."
        confirmLabel="Réinitialiser"
        onConfirm={handleResetScores}
      />

      <ConfirmDialog
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        title="Supprimer la partie ?"
        description="Cette action est irréversible. La partie et tous les scores seront supprimés définitivement."
        confirmLabel="Supprimer"
        onConfirm={handleDeleteGame}
        variant="destructive"
      />

      <VictoryDialog
        open={showVictory}
        winner={winner}
        targetScore={targetScore}
        onNewGame={handleVictoryNewGame}
        onRestoreGame={handleVictoryRestore}
        onDeleteGame={handleVictoryDelete}
      />
    </div>
  );
};

export default Game;
