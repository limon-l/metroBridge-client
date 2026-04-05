import { useState } from "react";

const REACTIONS = [
  { emoji: "👍", label: "Like", key: "like" },
  { emoji: "❤️", label: "Love", key: "love" },
  { emoji: "😮", label: "Wow", key: "wow" },
  { emoji: "🤝", label: "Support", key: "support" },
];

export default function ReactionPicker({ onReact, currentReaction }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleReact = (reactionKey) => {
    onReact(reactionKey);
    setIsOpen(false);
  };

  const currentReactionEmoji = REACTIONS.find(
    (r) => r.key === currentReaction,
  )?.emoji;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 px-2 py-1 text-neutral hover:text-primary transition-colors"
        title="Add reaction">
        <span className="text-lg">{currentReactionEmoji || "👍"}</span>
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />

          {/* Picker */}
          <div className="absolute bottom-full left-0 mb-2 bg-white border border-border rounded-lg shadow-lg p-2 z-20 flex gap-1">
            {REACTIONS.map((reaction) => (
              <button
                key={reaction.key}
                onClick={() => handleReact(reaction.key)}
                className="text-2xl hover:scale-125 transition-transform p-1 rounded hover:bg-neutral-light"
                title={reaction.label}>
                {reaction.emoji}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
