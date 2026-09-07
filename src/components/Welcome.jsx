import "../index.css"
import { motion, AnimatePresence } from "motion/react";

function Welcome(){
    return(
        <motion.section initial={{y:0}} animate={{y:-900}} transition={{delay: 5,ease: "easeOut", type: "spring", duration:1}} className="z-10 absolute bg-accent w-screen h-screen ">
            <div>
                <h1 style={{fontFamily: "AccentFont"}} className="text-4xl text-white-soft absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] animate-text">VANDALUXE</h1>
            </div>
        </motion.section>
    )
}

export default Welcome;