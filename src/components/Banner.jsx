import { AnimatePresence, motion } from "motion/react";
import "../index.css";
import { X } from "lucide-react";
import { useState } from "react";

function Banner() {
  const [isVisible, setIsVisible] = useState(true);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        exit={{ opacity: 0, y: -50 }}
        className={
          isVisible
            ? "bg-gray p-3 flex z-10 items-center justify-between w-full"
            : "hidden"
        }
      >
        <p className="text-dark bannerText font-thin">
          Lorem ipsum dolor sit amet consectetur.
        </p>
        <X
          size={18}
          onClick={() => setIsVisible(!isVisible)}
          className=" text-black"
        />
      </motion.div>
    </AnimatePresence>
  );
}

export default Banner;
