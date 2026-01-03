import { GameSummary } from "@/types/game";
import { Calendar, Users, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface GameCardProps {
  game: GameSummary;
  onSelect?: () => void;
  onDelete?: () => void;
  selectable?: boolean;
  selected?: boolean;
}

export const GameCard = ({
  game,
  onSelect,
  onDelete,
  selectable = false,
  selected = false,
}: GameCardProps) => {
  const maxScore = Math.max(...game.scores);
  const leaderIndex = game.scores.indexOf(maxScore);

  return (
    <div
      onClick={onSelect}
      className={`game-card cursor-pointer transition-all duration-200 ${
        selected ? "border-gold gold-glow" : "hover:border-muted-foreground"
      } ${selectable ? "relative" : ""}`}
    >
      {selectable && (
        <div
          className={`absolute top-3 right-3 w-5 h-5 rounded-full border-2 transition-all ${
            selected
              ? "border-gold bg-gold"
              : "border-muted-foreground"
          }`}
        >
          {selected && (
            <svg
              className="w-full h-full text-primary-foreground"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
          )}
        </div>
      )}

      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2 text-muted-foreground text-sm">
          <Calendar className="w-4 h-4" />
          <span>
            {format(new Date(game.updatedAt), "d MMM yyyy", { locale: fr })}
          </span>
        </div>
        {onDelete && !selectable && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="flex items-center gap-2 mb-3">
        <Users className="w-4 h-4 text-muted-foreground" />
        <span className="text-cream font-medium">
          {game.playerNames.length} joueurs
        </span>
      </div>

      <div className="space-y-2">
        {game.playerNames.map((name, index) => (
          <div
            key={index}
            className="flex items-center justify-between text-sm"
          >
            <span
              className={`truncate ${
                index === leaderIndex && maxScore > 0
                  ? "text-gold font-medium"
                  : "text-cream"
              }`}
            >
              {name}
            </span>
            <span
              className={`font-medium ${
                index === leaderIndex && maxScore > 0
                  ? "text-gold"
                  : "text-muted-foreground"
              }`}
            >
              {game.scores[index]} pts
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
