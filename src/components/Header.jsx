import "../index.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AnimatePresence, motion } from "motion/react";
import { Heart, ShoppingBasket, Menu, X } from "lucide-react";
import LOGO from "../assets/LOGO2.png";
import { useState, useEffect } from "react";
import {
  faInstagram,
  faTiktok,
  faWhatsapp,
  faXTwitter,
} from "@fortawesome/free-brands-svg-icons";
import { Link } from "react-router-dom";

function Header() {
  const [isVisible, setIsVisible] = useState(true);
  const [isMenuClicked, setIsMenuClicked] = useState(false);

  useEffect(() => {
    if (isMenuClicked) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMenuClicked]);

  const linkStyle =
    "text-dark border-b border-gray w-full p-4 transition-colors duration-300 ease-in-out";
  const socialIconStyle =
    "text-dark hover:text-accent hover:border-dark hover:border border border-transparent p-2";

  function handleToggleOffMenu() {
    setIsMenuClicked(!isMenuClicked);
  }
  return (
    <div className="w-full z-50 fixed top-0 left-0 flex flex-col items-center justify-center">
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
      <header className="bg-white border-b border-gray w-full p-4">
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
              <Link to="/" className="text-dark hover:text-accent">
                Home
              </Link>
            </motion.li>
            <motion.li className="p-2" whileHover={{ background: "#DADDD8" }}>
              <Link to="/Shop" className="text-dark hover:text-accent">
                Shop
              </Link>
            </motion.li>
            <motion.li className="p-2" whileHover={{ background: "#DADDD8 " }}>
              <Link to="/Collection" className="text-dark hover:text-accent">
                Collection
              </Link>
            </motion.li>
            <motion.li className="p-2" whileHover={{ background: " #DADDD8" }}>
              <a href="/#contact" className="text-dark hover:text-accent">
                Contact
              </a>
            </motion.li>
            <motion.li className="p-2" whileHover={{ background: "#DADDD8" }}>
              <Link to="/About" className="text-dark hover:text-accent">
                About
              </Link>
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
              {!isMenuClicked ? (
                <Menu
                  className="lg:h-5 lg:w-5 md:h-5 md:w-5 sm:h-4 sm:w-4 h-4 w-4"
                  strokeWidth={1.5}
                />
              ) : (
                <X
                  className="lg:h-5 lg:w-5 md:h-5 md:w-5 sm:h-4 sm:w-4 h-4 w-4"
                  strokeWidth={1.5}
                />
              )}
            </button>
          </div>
        </nav>
      </header>

      <AnimatePresence>
        {isMenuClicked && (
          <motion.div
            initial={{ opacity: 0, scale: 1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className={
              isVisible
                ? "w-full h-[calc(100svh-7rem)] bg-white border-t-1 justify-between border-gray fixed top-28  p-2 flex flex-col items-center gap-2"
                : "w-full h-[calc(100svh-7rem)] bg-white border-t-1 justify-between border-gray fixed top-16  p-2 flex flex-col items-center gap-2"
            }
          >
            <div className="w-full">
              <input
                type="text"
                placeholder="Search..."
                className="border-gray active:border-1 active:border-red-500 border w-full p-2 rounded-md"
              />
            </div>
            <div className="flex uppercase w-full p-2 flex-col links items-center gap-2">
              <Link to="/" onClick={handleToggleOffMenu} className="w-full">
                <motion.div
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.3, type: "spring" }}
                  className={linkStyle}
                  style={{ fontFamily: "Castoro Titling" }}
                >
                  Home
                </motion.div>
              </Link>
              <Link to="/Shop" onClick={handleToggleOffMenu} className="w-full">
                <motion.div
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.3, type: "spring" }}
                  className={linkStyle}
                  style={{ fontFamily: "Castoro Titling" }}
                >
                  Shop
                </motion.div>
              </Link>
              <Link
                to="/Collection"
                onClick={handleToggleOffMenu}
                className="w-full"
              >
                <motion.div
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.3, type: "spring" }}
                  className={linkStyle}
                  style={{ fontFamily: "Castoro Titling" }}
                >
                  Collection
                </motion.div>
              </Link>
              <a
                href="/#contact"
                onClick={handleToggleOffMenu}
                className="w-full"
              >
                <motion.div
                  whileHover={{ x: 5 }}
                  className={linkStyle}
                  transition={{ duration: 0.3, type: "spring" }}
                  style={{ fontFamily: "Castoro Titling" }}
                >
                  Contact
                </motion.div>
              </a>
              <Link
                to="/About"
                onClick={handleToggleOffMenu}
                className="w-full"
              >
                <motion.div
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.3, type: "spring" }}
                  className={linkStyle}
                  style={{ fontFamily: "Castoro Titling" }}
                >
                  About
                </motion.div>
              </Link>
            </div>
            <div className="flex gap-4 p-4  w-full justify-center">
              <a                 target="_blank" href="https://www.instagram.com/vlxstudios?stkn=ZHYwajQ2N3Mzc20z&utm_source=qr">
                <FontAwesomeIcon
                  size="lg"
                  icon={faInstagram}
                  className={socialIconStyle}
                />
              </a>
              <a                 target="_blank" href="https://x.com/vlxstudios_?s=11">
                <FontAwesomeIcon
                  size="lg"
                  icon={faXTwitter}
                  className={socialIconStyle}
                />
              </a>
              <a                 target="_blank" href="https://www.tiktok.com/@vandaluxe.15?_r=1&_t=ZS-99fRRQJYsw4">
                <FontAwesomeIcon
                  size="lg"
                  href=""
                  icon={faTiktok}
                  className={socialIconStyle}
                />
              </a>
              <a                 target="_blank" href="https://w.app/vlxstudios">
                <FontAwesomeIcon
                  size="lg"
                  icon={faWhatsapp}
                  className={socialIconStyle}
                />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Header;
