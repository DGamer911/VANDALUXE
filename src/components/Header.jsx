import "../index.css";
import { AnimatePresence, motion } from "motion/react";
import { Heart, ShoppingBasket, Menu, Search } from "lucide-react";
import LOGO from "../assets/LOGO2.png";
import { useState } from "react";
import Banner from "../components/Banner";


function Header() {
  const [isSearchClicked, setIsSearchClicked] = useState(false);
  const [isMenuClicked, setIsMenuClicked] = useState(false);

  return (
    <div className="w-full fixed top-0 left-0 flex flex-col items-center justify-center">
        <Banner/>
      <header className="bg-white w-full p-4">
        <nav className="flex items-center justify-between w-full">
          <span className="flex space-x-0.5 items-center">
            <img className="h-6 w-6  " src={LOGO} alt="" />
            <span
              style={{
                fontWeight: "lighter",
                fontFamily: "serif",
                transform: "translateY(-2px)",
                marginRight: "5px",
              }}
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
            <button className="border-1 p-2 rounded-md">
              <ShoppingBasket
                className="lg:h-5 lg:w-5 md:h-5 md:w-5 sm:h-4 sm:w-4 h-4 w-4"
                strokeWidth={1.5}
              />
            </button>
            <button className="lg:flex md:flex hidden border-1 p-2 rounded-md">
              <Heart
                className="lg:h-5 lg:w-5 md:h-5 md:w-5 sm:h-4 sm:w-4 h-4 w-4"
                strokeWidth={1.5}
              />
            </button>
            <button
              onClick={() => setIsMenuClicked(!isMenuClicked)}
              className="border-1 p-2 lg:hidden rounded-md"
            >
              <Menu
                className="lg:h-5 lg:w-5 md:h-5 md:w-5 sm:h-4 sm:w-4 h-4 w-4"
                strokeWidth={1.5}
              />
            </button>
          </div>
        </nav>
      </header>
      {isSearchClicked && (
        <div className=" w-full bg-white-soft z-50 p-2 flex items-center justify-center">
          <input
            type="text"
            placeholder="Search..."
            className="p-2 border rounded-md w-1/2"
          />
        </div>
      )}
      {isMenuClicked && (
        <AnimatePresence>
            <motion.div className="w-full w-full bg-white-soft z-50 p-2 flex flex-col items-center justify-center gap-2">
          <a
            href="#"
            className="text-dark bg-white w-full py-3 rounded text-center hover:text-accent"
          >
            Home
          </a>
          <a
            href="#"
            className="text-dark bg-white w-full py-3 rounded text-center hover:text-accent"
          >
            Shop
          </a>
          <a
            href="#"
            className="text-dark bg-white w-full py-3 rounded text-center hover:text-accent"
          >
            Collection
          </a>
          <a
            href="#"
            className="text-dark bg-white w-full py-3 rounded text-center hover:text-accent"
          >
            Contact
          </a>
          <a
            href="#"
            className="text-dark bg-white w-full py-3 rounded text-center hover:text-accent"
          >
            About
          </a>
        </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}

export default Header;
