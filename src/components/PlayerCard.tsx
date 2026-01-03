import { Player } from "@/types/game";
import { Crown } from "lucide-react";

interface PlayerCardProps {
  player: Player;
  isLeading: boolean;
  rank: number;
}

export const PlayerCard = ({ player, isLeading, rank }: PlayerCardProps) => {
  return (
    <div
      className={`game-card relative overflow-hidden transition-all duration-300 animate-scale-in ${
        isLeading ? "border-gold gold-glow" : ""
      }`}
    >
      {isLeading && (
        <div className="absolute top-3 right-3">
          <Crown className="w-5 h-5 text-gold" />
        </div>
      )}
      
      <div className="flex items-center gap-4">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${
            isLeading
              ? "bg-gold text-primary-foreground"
              : "bg-secondary text-foreground"
          }`}
        >
          {rank}
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-lg truncate text-cream">
            {player.name}
          </h3>
        </div>
        
        <div className="text-right">
          <span
            className={`text-2xl font-display font-bold ${
              isLeading ? "text-gold" : "text-cream"
            }`}
          >
            {player.score}
          </span>
          <span className="text-muted-foreground text-sm ml-1">pts</span>
        </div>
      </div>
    </div>
  );
};
