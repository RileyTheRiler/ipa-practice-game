import { MAX_WRONG } from '../data/hangmanThemes';
import '../styles/hangman.css';

/**
 * Renders the current state of a non-violent "hangman" scene.
 * `wrongCount` (0..MAX_WRONG) drives how far the scene has advanced.
 */
export function HangmanScene({ theme, wrongCount, status }) {
    const lost = status === 'lost' || wrongCount >= MAX_WRONG;
    const livesLeft = Math.max(0, MAX_WRONG - wrongCount);

    return (
        <div className="hangman-scene" style={{ '--scene-accent': theme.accent }}>
            <div className="hangman-stage">
                {lost ? (
                    <div className="hangman-lose">
                        <span className="hangman-lose-emoji">{theme.loseEmoji}</span>
                    </div>
                ) : theme.kind === 'parts' ? (
                    <PartsScene theme={theme} wrongCount={wrongCount} />
                ) : (
                    <MoverScene theme={theme} wrongCount={wrongCount} />
                )}
            </div>

            <div className="hangman-lives" aria-label={`${livesLeft} guesses left`}>
                {Array.from({ length: MAX_WRONG }).map((_, i) => (
                    <span
                        key={i}
                        className={`life-pip ${i < livesLeft ? 'on' : 'off'}`}
                    />
                ))}
            </div>
            <div className="hangman-scene-label">
                {theme.name} · {livesLeft} {livesLeft === 1 ? 'guess' : 'guesses'} left
            </div>
        </div>
    );
}

// A part vanishes per wrong guess; parts[0] disappears first.
function PartsScene({ theme, wrongCount }) {
    return (
        <>
            {theme.parts.map((part, i) => {
                if (i < wrongCount) return null; // already vanished
                return (
                    <span
                        key={i}
                        className="scene-part"
                        style={{
                            left: `${part.x}%`,
                            top: `${part.y}%`,
                            fontSize: part.size,
                        }}
                    >
                        {part.emoji}
                    </span>
                );
            })}
        </>
    );
}

// A single emoji travels toward a goal; reaching it (handled as "lost") loses.
function MoverScene({ theme, wrongCount }) {
    const progress = wrongCount / MAX_WRONG; // 0..1

    let moverX = 50;
    let moverY = 50;
    if (theme.path === 'up') {
        moverY = 80 - progress * 64; // bottom -> top
    } else if (theme.path === 'right') {
        moverX = 14 + progress * 64; // left -> right
        moverY = 60;
    }

    // A short trail behind the mover.
    const trail = Array.from({ length: Math.min(wrongCount, 4) }).map((_, i) => {
        const back = (i + 1) * 0.12;
        if (theme.path === 'up') {
            return { x: 50, y: Math.min(86, moverY + back * 64) };
        }
        return { x: Math.max(10, moverX - back * 64), y: 60 };
    });

    return (
        <>
            {theme.start && (
                <span
                    className="scene-part"
                    style={{
                        left: `${theme.start.x}%`,
                        top: `${theme.start.y}%`,
                        fontSize: theme.start.size,
                        opacity: 1 - progress * 0.7,
                    }}
                >
                    {theme.start.emoji}
                </span>
            )}
            {theme.goal && (
                <span
                    className="scene-part scene-goal"
                    style={{
                        left: `${theme.goal.x}%`,
                        top: `${theme.goal.y}%`,
                        fontSize: theme.goal.size,
                    }}
                >
                    {theme.goal.emoji}
                </span>
            )}
            {trail.map((t, i) => (
                <span
                    key={`trail-${i}`}
                    className="scene-trail"
                    style={{ left: `${t.x}%`, top: `${t.y}%` }}
                >
                    {theme.trail}
                </span>
            ))}
            <span
                className="scene-part scene-mover"
                style={{ left: `${moverX}%`, top: `${moverY}%` }}
            >
                {theme.mover}
            </span>
        </>
    );
}

export default HangmanScene;
