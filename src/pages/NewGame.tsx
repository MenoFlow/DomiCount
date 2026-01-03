import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Plus, Trash2, Play, Users, Target } from "lucide-react";
import { generateId, saveGame, setCurrentGame } from "@/utils/storage";
import { Game, Player } from "@/types/game";
import { toast } from "sonner";

const NewGame = () => {
  const navigate = useNavigate();
  const [players, setPlayers] = useState<string[]>(["", ""]);
  const [targetScore, setTargetScore] = useState<number>(100);

  const addPlayer = () => {
    if (players.length < 4) {
      setPlayers([...players, ""]);
    }
  };

  const removePlayer = (index: number) => {
    if (players.length > 2) {
      setPlayers(players.filter((_, i) => i !== index));
    }
  };

  const updatePlayer = (index: number, name: string) => {
    const updated = [...players];
    updated[index] = name;
    setPlayers(updated);
  };

  const startGame = () => {
    const names = players.map((p) => p.trim()).filter((p) => p);
    
    if (names.length < 2) {
      toast.error("Il faut au moins 2 joueurs");
      return;
    }

    const uniqueNames = new Set(names.map((n) => n.toLowerCase()));
    if (uniqueNames.size !== names.length) {
      toast.error("Les noms doivent être uniques");
      return;
    }

    const gamePlayers: Player[] = names.map((name) => ({
      id: generateId(),
      name,
      score: 0,
    }));

    const game: Game = {
      id: generateId(),
      players: gamePlayers,
      targetScore,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      rounds: [],
    };

    saveGame(game);
    setCurrentGame(game.id);
    toast.success("Partie créée !");
    navigate(`/game/${game.id}`);
  };

  const isValid =
    players.filter((p) => p.trim()).length >= 2 &&
    new Set(players.filter((p) => p.trim()).map((p) => p.toLowerCase())).size ===
      players.filter((p) => p.trim()).length;

  return (
    <div className="min-h-screen bg-background domino-pattern">
      {/* Header */}
      <header className="sticky top-0 bg-background/95 backdrop-blur border-b border-border z-10">
        <div className="flex items-center gap-4 px-4 py-4 max-w-md mx-auto">
          <button
            onClick={() => navigate("/")}
            className="p-2 -ml-2 rounded-lg hover:bg-secondary transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-cream" />
          </button>
          <h1 className="font-display text-xl font-bold text-cream">
            Nouvelle partie
          </h1>
        </div>
      </header>

      {/* Content */}
      <main className="px-4 py-6 max-w-md mx-auto">
        <div className="game-card mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Users className="w-5 h-5 text-gold" />
            <h2 className="font-semibold text-cream">Joueurs ({players.length}/4)</h2>
          </div>

          <div className="space-y-3">
            {players.map((player, index) => (
              <div
                key={index}
                className="flex items-center gap-3 animate-scale-in"
              >
                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-cream font-medium">
                  {index + 1}
                </div>
                <Input
                  placeholder={`Joueur ${index + 1}`}
                  value={player}
                  onChange={(e) => updatePlayer(index, e.target.value)}
                  className="flex-1 bg-secondary border-border text-cream placeholder:text-muted-foreground"
                  maxLength={20}
                />
                {players.length > 2 && (
                  <button
                    onClick={() => removePlayer(index)}
                    className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {players.length < 4 && (
            <Button
              onClick={addPlayer}
              variant="outline"
              className="w-full mt-4 border-dashed border-border text-muted-foreground hover:text-cream hover:bg-secondary"
            >
              <Plus className="w-4 h-4 mr-2" />
              Ajouter un joueur
            </Button>
          )}
        </div>

        {/* Target Score */}
        <div className="game-card mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Target className="w-5 h-5 text-gold" />
            <h2 className="font-semibold text-cream">Score cible</h2>
          </div>
          <div className="flex items-center gap-3">
            <Input
              type="number"
              min={10}
              max={1000}
              value={targetScore}
              onChange={(e) => setTargetScore(Math.max(10, parseInt(e.target.value) || 100))}
              className="flex-1 bg-secondary border-border text-cream text-center text-lg font-semibold"
            />
            <span className="text-muted-foreground">points</span>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Le premier joueur à atteindre ce score remporte la partie.
          </p>
        </div>

        <Button
          onClick={startGame}
          disabled={!isValid}
          className="w-full h-14 bg-gold text-primary-foreground hover:bg-gold-glow text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Play className="w-5 h-5 mr-2" />
          Commencer la partie
        </Button>
      </main>
    </div>
  );
};

export default NewGame;
