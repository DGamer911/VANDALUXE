import "../index.css";
import { motion } from "motion/react";
import { Heart, ShoppingBasket } from "lucide-react";
import LOGO from "../assets/LOGO2.png";

function Header() {
  return (
    <header className="bg-white shadow-md w-full p-4">
      <nav className="flex items-center justify-between w-full">
        <span className="flex space-x-0.5 items-center">
          <img className="h-6 w-6  " src={LOGO} alt="" />
          <span
            style={{ fontWeight: "lighter", fontFamily: "serif", transform: "translateY(-2px)", marginRight: "5px" }}
            className="font-thin text-2xl"
          >
            |
          </span>
          <span className="logo m-0 leading-0 p-0">VANDALUXE</span>
        </span>
        <ul className="lg:flex justify-center items-center hidden w-full lg:gap-8 gap-4">
          <motion.li
            className="bg-gray p-2"
            whileHover={{ background: "#DADDD8" }}
          >
            <a href="#" className="text-dark hover:text-accent">
              Home
            </a>
          </motion.li>
          <motion.li className="p-2" whileHover={{ background: "#DADDD8" }}>
            <a href="#" className="text-dark hover:text-accent">
              Shop
            </a>
          </motion.li>
          <motion.li className="p-2" whileHover={{ background: "#DADDD8 " }}>
            <a href="#" className="text-dark hover:text-accent">
              Collection
            </a>
          </motion.li>
          <motion.li className="p-2" whileHover={{ background: " #DADDD8" }}>
            <a href="#" className="text-dark hover:text-accent">
              Contact
            </a>
          </motion.li>
          <motion.li className="p-2" whileHover={{ background: "#DADDD8" }}>
            <a href="#" className="text-dark hover:text-accent">
              About
            </a>
          </motion.li>
        </ul>
        <div className="flex gap-3 ">
          <a className="border-1 p-2 rounded-md" href="">
            <ShoppingBasket
              className="lg:h-5 lg:w-5 md:h-5 md:w-5 sm:h-4 sm:w-4 h-4 w-4"
              strokeWidth={1.5}
            />
          </a>
          <a className="border-1 p-2 rounded-md" href="">
            <Heart
              className="lg:h-5 lg:w-5 md:h-5 md:w-5 sm:h-4 sm:w-4 h-4 w-4"
              strokeWidth={1.5}
            />
          </a>
        </div>
      </nav>
    </header>
  );
}

export default Header;
