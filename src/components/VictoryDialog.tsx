import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trophy, Plus, History, Trash2 } from "lucide-react";
import { Player } from "@/types/game";

interface VictoryDialogProps {
  open: boolean;
  winner: Player | null;
  targetScore: number;
  onNewGame: () => void;
  onRestoreGame: () => void;
  onDeleteGame: () => void;
}

export const VictoryDialog = ({
  open,
  winner,
  targetScore,
  onNewGame,
  onRestoreGame,
  onDeleteGame,
}: VictoryDialogProps) => {
  if (!winner) return null;

  return (
    <Dialog open={open}>
      <DialogContent className="bg-card border-border max-w-sm mx-auto" hideCloseButton>
        <DialogHeader className="text-center">
          <div className="mx-auto w-20 h-20 bg-gold/20 rounded-full flex items-center justify-center mb-4 animate-scale-in">
            <Trophy className="w-10 h-10 text-gold" />
          </div>
          <DialogTitle className="text-2xl font-display text-cream text-center">
            🎉 Victoire ! 🎉
          </DialogTitle>
          <DialogDescription className="text-center space-y-2">
            <p className="text-lg text-cream font-semibold">
              {winner.name} remporte la partie !
            </p>
            <p className="text-muted-foreground">
              Score final : <span className="text-gold font-bold">{winner.score} points</span>
            </p>
            <p className="text-sm text-muted-foreground">
              (Objectif : {targetScore} points)
            </p>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 mt-4">
          <Button
            onClick={onNewGame}
            className="w-full h-12 bg-gold text-primary-foreground hover:bg-gold-glow font-semibold"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nouvelle partie
          </Button>
          <Button
            onClick={onRestoreGame}
            variant="outline"
            className="w-full h-12 border-border text-cream hover:bg-secondary"
          >
            <History className="w-4 h-4 mr-2" />
            Restaurer une partie
          </Button>
          <Button
            onClick={onDeleteGame}
            variant="outline"
            className="w-full h-12 border-border text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Supprimer cette partie
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
