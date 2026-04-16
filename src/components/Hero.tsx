import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, Linkedin, BadgeCheck } from 'lucide-react';
import { content } from '../data/content';

const GREETING_ROLES = [
  "Engineering Manager",
  "Software Architect",
  "AI Builder",
  "Tech Lead Manager",
  "Product Strategist"
];

function useTypewriterRotation(words: string[], typingSpeed = 100, deletingSpeed = 50, pauseTime = 2000) {
  const [index, setIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    const handleTick = () => {
      const currentWord = words[index];

      if (isWaiting) {
        timer = setTimeout(() => {
          setIsWaiting(false);
          setIsDeleting(true);
        }, pauseTime);
        return;
      }

      if (isDeleting) {
        if (displayText === "") {
          setIsDeleting(false);
          setIndex((prev) => (prev + 1) % words.length);
        } else {
          timer = setTimeout(() => {
            setDisplayText(displayText.slice(0, -1));
          }, deletingSpeed);
        }
      } else {
        if (displayText === currentWord) {
          setIsWaiting(true);
        } else {
          timer = setTimeout(() => {
            setDisplayText(currentWord.slice(0, displayText.length + 1));
          }, typingSpeed);
        }
      }
    };

    handleTick();
    return () => clearTimeout(timer);
  }, [displayText, isDeleting, isWaiting, index, words, typingSpeed, deletingSpeed, pauseTime]);

  return { displayText, index };
}

function BeamPill({ children }: { children: React.ReactNode }) {
  return (
    <span className="relative inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm font-medium backdrop-blur-sm group overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-primary/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
      <span className="relative z-10 flex items-center gap-1.5">{children}</span>
    </span>
  );
}

export default function Hero() {
  const { displayText, index } = useTypewriterRotation(GREETING_ROLES);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  return (
    <header className="relative pt-20 pb-32 overflow-hidden border-b border-border/50">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/5 to-transparent" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
      <div className="max-w-5xl mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row items-center gap-12">
          {/* Avatar with verified badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <div className="relative w-44 h-44 md:w-56 md:h-56">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/30 to-accent/30 blur-2xl animate-pulse" />
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/10 to-transparent border border-white/20 shadow-2xl backdrop-blur-sm" />
              <div className="absolute inset-2 rounded-full bg-gradient-to-br from-primary/50 to-primary/10 p-[2.5px]">
                <div className="w-full h-full rounded-full overflow-hidden bg-card shadow-inner">
                  <img
                    src="/foto-avatar.jpg"
                    alt={content.name}
                    width="512"
                    height="512"
                    decoding="async"
                    loading="eager"
                    fetchPriority="high"
                    className="w-full h-full object-cover"
                  />
                </div>
                </div>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
                className="absolute -bottom-1 -right-1 w-12 h-12 rounded-full bg-gradient-to-r from-[#00d9ff] to-[#00a3ff] flex items-center justify-center shadow-lg border-2 border-background"
              >
                <BadgeCheck className="w-7 h-7 text-white" />
              </motion.div>
            </div>
          </motion.div>

          {/* Hero Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center md:text-left flex-1 min-w-0"
          >
            <p className="text-lg md:text-xl text-muted-foreground mb-4">
              Hi, I'm <span className="text-gradient font-bold tracking-tight">{content.handle}</span>,
            </p>
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-6xl xl:text-7xl font-bold tracking-tight mb-6 leading-[1.1] min-h-[2.2em] md:min-h-[1.1em] flex items-start justify-center md:justify-start gap-2 sm:gap-4">
              <span className="inline-block w-[4px] sm:w-[6px] h-[0.85em] bg-primary rounded-sm animate-blink shrink-0 mt-[0.1em]" />
              <span className="text-gradient md:whitespace-nowrap">
                {hydrated ? displayText : GREETING_ROLES[0]}
              </span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground mb-4 font-medium italic">
              who leads AI systems with:
            </p>

            <div className="flex flex-wrap justify-center md:justify-start gap-3 mb-10">
              <BeamPill>Multi-tenant AI Agents</BeamPill>
              <BeamPill>Cloud-Native Infra</BeamPill>
              <BeamPill>Scalable Web Systems</BeamPill>
            </div>

            <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-10">
              {GREETING_ROLES.map((role, i) => (
                <span
                  key={role}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300 backdrop-blur-sm border ${hydrated && i === index
                    ? 'border-primary bg-primary/10 text-foreground scale-105'
                    : 'border-white/10 bg-white/5 text-muted-foreground'
                    }`}
                >
                  {role}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap justify-center md:justify-start gap-4">
              <a
                href={`mailto:${content.email}`}
                aria-label="Send an email to Orlando"
                className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full bg-[#0077b6] text-white font-bold uppercase tracking-widest text-xs hover:brightness-110 hover:shadow-[0_0_30px_rgba(0,119,182,0.4)] transition-all duration-300"
              >
                <Mail className="w-5 h-5" />
                Contact Me
              </a>
              <a
                href="https://linkedin.com/in/orlandomgr"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit Orlando's LinkedIn profile"
                className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full border border-border bg-card backdrop-blur-md hover:bg-muted hover:border-primary/20 transition-all duration-300 text-xs font-bold uppercase tracking-widest"
              >
                <Linkedin className="w-5 h-5 text-[#0a66c2]" />
                LinkedIn
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </header>
  );
}
