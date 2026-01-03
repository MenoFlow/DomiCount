import { useState } from "react";
import { Player } from "@/types/game";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trophy, Check } from "lucide-react";

interface AddPointsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  players: Player[];
  onConfirm: (winnerId: string, losersPoints: { playerId: string; points: number }[]) => void;
}

export const AddPointsDialog = ({
  open,
  onOpenChange,
  players,
  onConfirm,
}: AddPointsDialogProps) => {
  const [winnerId, setWinnerId] = useState<string>("");
  const [points, setPoints] = useState<Record<string, string>>({});

  const handleConfirm = () => {
    if (!winnerId) return;

    const losersPoints = players
      .filter((p) => p.id !== winnerId)
      .map((p) => ({
        playerId: p.id,
        points: parseInt(points[p.id] || "0", 10),
      }));

    onConfirm(winnerId, losersPoints);
    setWinnerId("");
    setPoints({});
    onOpenChange(false);
  };

  const totalPoints = players
    .filter((p) => p.id !== winnerId)
    .reduce((sum, p) => sum + (parseInt(points[p.id] || "0", 10)), 0);

  const handleClose = () => {
    setWinnerId("");
    setPoints({});
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="bg-card border-border max-w-md mx-4">
        <DialogHeader>
          <DialogTitle className="font-display text-xl text-cream flex items-center gap-2">
            <Trophy className="w-5 h-5 text-gold" />
            Nouvelle manche
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Sélectionnez le gagnant et entrez les points restants des adversaires.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Winner selection */}
          <div className="space-y-3">
            <Label className="text-cream font-medium">Qui a gagné ?</Label>
            <div className="grid grid-cols-2 gap-2">
              {players.map((player) => (
                <button
                  key={player.id}
                  onClick={() => setWinnerId(player.id)}
                  className={`p-3 rounded-lg border transition-all ${
                    winnerId === player.id
                      ? "border-gold bg-gold/10 text-gold"
                      : "border-border bg-secondary hover:border-muted-foreground text-cream"
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    {winnerId === player.id && <Check className="w-4 h-4" />}
                    <span className="font-medium truncate">{player.name}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Losers points */}
          {winnerId && (
            <div className="space-y-3 animate-slide-up">
              <Label className="text-cream font-medium">
                Points restants des adversaires
              </Label>
              <div className="space-y-3">
                {players
                  .filter((p) => p.id !== winnerId)
                  .map((player) => (
                    <div
                      key={player.id}
                      className="flex items-center gap-3 bg-secondary rounded-lg p-3"
                    >
                      <span className="flex-1 text-cream font-medium truncate">
                        {player.name}
                      </span>
                      <Input
                        type="number"
                        min="0"
                        placeholder="0"
                        value={points[player.id] || ""}
                        onChange={(e) =>
                          setPoints({ ...points, [player.id]: e.target.value })
                        }
                        className="w-24 text-center bg-card border-border text-cream"
                      />
                      <span className="text-muted-foreground text-sm">pts</span>
                    </div>
                  ))}
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-border">
                <span className="text-muted-foreground">Total pour le gagnant</span>
                <span className="text-gold font-display text-xl font-bold">
                  +{totalPoints} pts
                </span>
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              onClick={handleClose}
              className="flex-1 border-border text-cream hover:bg-secondary"
            >
              Annuler
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={!winnerId}
              className="flex-1 bg-gold text-primary-foreground hover:bg-gold-glow"
            >
              Valider
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
