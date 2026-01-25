import { useEffect, useState } from 'react';
import '../styles/achievementToast.css';

/**
 * AchievementToast component
 * Displays animated toast notification when achievements are unlocked
 */
export function AchievementToast({ achievement, onDismiss, duration = 4000 }) {
    const [isVisible, setIsVisible] = useState(false);
    const [isLeaving, setIsLeaving] = useState(false);

    useEffect(() => {
        if (achievement) {
            setIsVisible(true);
            setIsLeaving(false);

            const timer = setTimeout(() => {
                setIsLeaving(true);
                setTimeout(() => {
                    setIsVisible(false);
                    onDismiss?.();
                }, 400); // Match exit animation duration
            }, duration);

            return () => clearTimeout(timer);
        }
    }, [achievement, duration, onDismiss]);

    if (!isVisible || !achievement) {
        return null;
    }

    return (
        <div className={`achievement-toast ${isLeaving ? 'leaving' : ''}`}>
            <div className="achievement-toast-glow"></div>
            <div className="achievement-toast-content">
                <div className="achievement-unlocked-label">
                    🏆 Achievement Unlocked!
                </div>
                <div className="achievement-toast-main">
                    <div className="achievement-toast-icon">
                        {achievement.icon}
                    </div>
                    <div className="achievement-toast-info">
                        <div className="achievement-toast-name">
                            {achievement.name}
                        </div>
                        <div className="achievement-toast-desc">
                            {achievement.description}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

/**
 * Achievement toast queue manager
 * Handles displaying multiple achievements one at a time
 */
export function AchievementToastQueue({ achievements = [], onComplete }) {
    const [queue, setQueue] = useState([]);
    const [current, setCurrent] = useState(null);

    useEffect(() => {
        if (achievements.length > 0) {
            setQueue(prev => [...prev, ...achievements]);
        }
    }, [achievements]);

    useEffect(() => {
        if (!current && queue.length > 0) {
            setCurrent(queue[0]);
            setQueue(prev => prev.slice(1));
        }
    }, [current, queue]);

    const handleDismiss = () => {
        setCurrent(null);
        if (queue.length === 0) {
            onComplete?.();
        }
    };

    return <AchievementToast achievement={current} onDismiss={handleDismiss} />;
}

export default AchievementToast;
