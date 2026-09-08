import "../index.css"
import { useEffect, useRef } from "react";
import { motion } from "motion/react";

function Welcome(){
    const previousOverflow = useRef({ body: "", document: "" });

    useEffect(() => {
        const { body, documentElement } = document;
        previousOverflow.current = {
            body: body.style.overflow,
            document: documentElement.style.overflow,
        };

        body.style.overflow = "hidden";
        documentElement.style.overflow = "hidden";

        return () => {
            body.style.overflow = previousOverflow.current.body;
            documentElement.style.overflow = previousOverflow.current.document;
        };
    }, []);

    const unlockScroll = () => {
        document.body.style.overflow = previousOverflow.current.body;
        document.documentElement.style.overflow = previousOverflow.current.document;
    };

    return(
        <motion.section
            initial={{ y: 0 }}
            animate={{ y: "-100%" }}
            transition={{ delay: 5, duration: 0.75, ease: [0.76, 0, 0.24, 1] }}
            onAnimationComplete={unlockScroll}
            className="fixed inset-0 z-50 flex h-[100svh] w-full flex-col items-center justify-center overflow-hidden bg-accent text-white-soft"
        >
            <div className="flex flex-col items-center gap-5">
                <span className="text-[10px] uppercase tracking-[0.45em] text-white-soft/60">Est. 2024</span>
                <h1 style={{fontFamily: "AccentFont"}} className="text-center text-4xl leading-none sm:text-6xl">VANDALUXE</h1>
                <div className="h-px w-16 bg-white-soft/50" />
            </div>
        </motion.section>
    )
}

export default Welcome;