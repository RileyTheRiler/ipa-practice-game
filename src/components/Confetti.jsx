import { useEffect, useRef, useCallback } from 'react';

/**
 * Canvas-based confetti explosion component
 * Triggers a colorful particle celebration on correct answers
 */
export function Confetti({ trigger, duration = 2000 }) {
    const canvasRef = useRef(null);
    const animationRef = useRef(null);
    const particlesRef = useRef([]);

    const colors = [
        '#FF6B6B', // Coral red
        '#4ECDC4', // Teal
        '#FFE66D', // Yellow
        '#95E1D3', // Mint
        '#F38181', // Salmon
        '#AA96DA', // Purple
        '#FCBAD3', // Pink
        '#A8D8EA', // Light blue
    ];

    const createParticle = useCallback((x, y) => {
        const angle = Math.random() * Math.PI * 2;
        const velocity = 8 + Math.random() * 8;
        return {
            x,
            y,
            vx: Math.cos(angle) * velocity,
            vy: Math.sin(angle) * velocity - 5,
            color: colors[Math.floor(Math.random() * colors.length)],
            size: 6 + Math.random() * 6,
            rotation: Math.random() * 360,
            rotationSpeed: (Math.random() - 0.5) * 15,
            gravity: 0.3,
            friction: 0.99,
            opacity: 1,
            shape: Math.random() > 0.5 ? 'rect' : 'circle',
        };
    }, [colors]);

    const explode = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        // Create burst of particles
        const particleCount = 80;
        particlesRef.current = [];
        for (let i = 0; i < particleCount; i++) {
            particlesRef.current.push(createParticle(centerX, centerY));
        }
    }, [createParticle]);

    const animate = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        let hasActiveParticles = false;

        particlesRef.current.forEach((p) => {
            if (p.opacity <= 0) return;
            hasActiveParticles = true;

            // Update physics
            p.vx *= p.friction;
            p.vy *= p.friction;
            p.vy += p.gravity;
            p.x += p.vx;
            p.y += p.vy;
            p.rotation += p.rotationSpeed;
            p.opacity -= 0.015;

            // Draw particle
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate((p.rotation * Math.PI) / 180);
            ctx.globalAlpha = Math.max(0, p.opacity);
            ctx.fillStyle = p.color;

            if (p.shape === 'rect') {
                ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
            } else {
                ctx.beginPath();
                ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
                ctx.fill();
            }

            ctx.restore();
        });

        if (hasActiveParticles) {
            animationRef.current = requestAnimationFrame(animate);
        }
    }, []);

    // Handle trigger changes
    useEffect(() => {
        if (trigger) {
            explode();
            animate();
        }

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [trigger, explode, animate]);

    // Handle canvas resize
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
        return () => window.removeEventListener('resize', resizeCanvas);
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
                zIndex: 9999,
            }}
        />
    );
}

export default Confetti;
