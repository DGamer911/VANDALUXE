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
import { NavLink } from "react-router-dom";

function Header() {
  const [isMenuClicked, setIsMenuClicked] = useState(false);

  // Navigation links configuration
  const navLinks = [
    { label: "Home", path: "/" },
    { label: "Shop", path: "/shop" },
    { label: "Favorite", path: "/favorites" },
    { label: "About", path: "/about" },
  ];

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
    "text-dark-soft hover:text-accent hover:border-gray hover:border border border-transparent p-2";

  function handleToggleOffMenu() {
    setIsMenuClicked(!isMenuClicked);
  }

  return (
    <div className="w-full bg-dark z-50 fixed top-0 left-0 flex flex-col items-center justify-center">
      <header className="bg-white  border-b border-gray w-full p-4">
        <nav className="flex items-center justify-between w-full">
          <span className="flex space-x-0.5 items-center">
            <img
              className="h-6 w-6 translate-y-[-1.5px]   "
              src={LOGO}
              alt=""
            />

            <span
              style={{
                fontWeight: "lighter",
                fontFamily: "serif",
                marginRight: "5px",
              }}
              className="font-thin text-dark-soft translate-y-[-3px] text-2xl"
            >
              |
            </span>

            <span className="logo m-0 leading-0 p-0">VANDALUXE</span>
          </span>

          <ul className="lg:flex justify-center items-center hidden w-full lg:gap-8 gap-4">
            {navLinks.map((link) => (
              <motion.li
                key={link.label}
                whileHover={{}}
                transition={{ duration: 0.2 }}
              >
                <NavLink
                  to={link.path}
                  className={({ isActive }) =>
                    `relative p-3 text-dark transition-all duration-300
              border rounded border-transparent
              links
              
                    after:transition-all after:duration-300
                    ${
                      isActive
                        ? "bg-white-soft"
                        : "after:w-0 hover:border hover:border-gray"
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              </motion.li>
            ))}

            <motion.li className="">
              <a
                href="/#contact"
                className="text-dark border border-transparent a p-3 rounded hover:border-gray hover:text-accent"
              >
                Contact
              </a>
            </motion.li>
          </ul>

          <div className="flex gap-3 ">
            <button className="border-1 p-2 rounded-md">
              <NavLink to="/cart">
                <ShoppingBasket
                  className="lg:h-5 lg:w-5 md:h-5 md:w-5 sm:h-4 sm:w-4 h-4 w-4"
                  strokeWidth={1.5}
                />
              </NavLink>
            </button>

            <NavLink className="flex" to="/favorites">
              <button className="flex border-1 p-2 rounded-md">
                <Heart
                  className="lg:h-5 lg:w-5 md:h-5 md:w-5 sm:h-4 sm:w-4 h-4 w-4"
                  strokeWidth={1.5}
                />
              </button>
            </NavLink>

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
            className="w-full h-[calc(100svh-4rem)] bg-white border-t justify-between border-gray   p-2 flex flex-col items-center gap-2"
          >
            <div className="w-full">
              <input
                type="text"
                placeholder="Search..."
                className="border-gray active:border active:border-red-500 border w-full p-2 rounded-md"
              />
            </div>

            <div className="flex uppercase w-full p-2 flex-col links items-center gap-2">
              {navLinks.map((link) => (
                <NavLink
                  to={link.path}
                  onClick={handleToggleOffMenu}
                  key={link.label}
                  className="w-full"
                >
                  {({ isActive }) => (
                    <motion.div
                      initial={{ x: isActive ? 5 : 0 }}
                      animate={{ x: isActive ? 5 : 0 }}
                      whileHover={{ x: 5 }}
                      transition={{ duration: 0.3, type: "spring" }}
                      className={`${linkStyle} ${
                        isActive ? "bg-white-soft text-accent" : ""
                      }`}
                      style={{ fontFamily: "Castoro Titling" }}
                    >
                      {link.label}
                    </motion.div>
                  )}
                </NavLink>
              ))}

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
            </div>

            <div className="flex gap-4 p-4  w-full justify-center">
              <a
                target="_blank"
                href="https://www.instagram.com/vlxstudios?stkn=ZHYwajQ2N3Mzc20z&utm_source=qr"
              >
                <FontAwesomeIcon
                  size="lg"
                  icon={faInstagram}
                  className={socialIconStyle}
                />
              </a>

              <a target="_blank" href="https://x.com/vlxstudios_?s=11">
                <FontAwesomeIcon
                  size="lg"
                  icon={faXTwitter}
                  className={socialIconStyle}
                />
              </a>

              <a
                target="_blank"
                href="https://www.tiktok.com/@vandaluxe.15?_r=1&_t=ZS-99fRRQJYsw4"
              >
                <FontAwesomeIcon
                  size="lg"
                  icon={faTiktok}
                  className={socialIconStyle}
                />
              </a>

              <a target="_blank" href="https://w.app/vlxstudios">
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
