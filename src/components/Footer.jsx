import { motion } from "motion/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faInstagram,
  faTiktok,
  faWhatsapp,
  faXTwitter,
} from "@fortawesome/free-brands-svg-icons";
import { Link } from "react-router-dom";
import "../index.css";

function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    { label: "Home", to: "/" },
    { label: "Shop", to: "/shop" },
    { label: "About", to: "/about" },
    { label: "Contact", to: "/#contact" },
  ];

  const legalLinks = [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms & Conditions", href: "#" },
    { label: "Returns", href: "#" },
  ];

  return (
    <footer className="bg-dark text-white w-full">
      {/* Main Footer Content */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 lg:gap-16 gap-8">
          {/* Brand Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="md:col-span-1"
          >
            <h2
              style={{ fontFamily: "AccentFont" }}
              className="text-2xl border-b border-dark-soft pb-2 font-semibold mb-2"
            >
              VANDALUXE
            </h2>
            <p className="text-gray text-sm leading-relaxed">
              Premium fashion redefined. Timeless pieces, modern style.
            </p>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="md:col-span-1"
          >
            <h3 className="font-medium text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {footerLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.to}
                    className="text-gray hover:text-white transition-colors duration-300 text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Support */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="md:col-span-1"
          >
            <h3 className="font-medium text-lg mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-gray hover:text-white transition-colors duration-300 text-sm"
                >
                  Help Center
                </a>
              </li>

              <li>
                <a
                  href="#"
                  className="text-gray hover:text-white transition-colors duration-300 text-sm"
                >
                  Size Guide
                </a>
              </li>
            </ul>
          </motion.div>

          {/* Connect */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="md:col-span-1"
          >
            <h3 className="font-medium text-lg mb-4">Connect</h3>
            <div className="flex flex-col gap-3 mb-4">
              <a
                              target="_blank"
                href="https://www.tiktok.com/@vandaluxe.15?_r=1&_t=ZS-99fRRQJYsw4"
                className="flex items-center gap-2 text-gray hover:text-white transition-colors duration-300 text-sm"
              >
                <FontAwesomeIcon icon={faTiktok} size="sm" />
                <span>Tiktok</span>
              </a>
              <a
                              target="_blank"
                href="https://x.com/vlxstudios_?s=11"
                className="flex items-center gap-2 text-gray hover:text-white transition-colors duration-300 text-sm"
              >
                <FontAwesomeIcon icon={faXTwitter} size="sm" />
                <span>Twitter</span>
              </a>
              <a
                href="https://w.app/vlxstudios"
                target="_blank"
                className="flex items-center gap-2 text-gray hover:text-white transition-colors duration-300 text-sm"
              >
                <FontAwesomeIcon icon={faWhatsapp} size="sm" />
                <span>Whatsapp</span>
              </a>
              <a
                              target="_blank"
                href="https://www.instagram.com/vlxstudios?stkn=ZHYwajQ2N3Mzc20z&utm_source=qr"
                className="flex items-center gap-2 text-gray hover:text-white transition-colors duration-300 text-sm"
              >
                <FontAwesomeIcon icon={faInstagram} size="sm" />
                <span>Instagram</span>
              </a>
            </div>
<div className="space-y-2">
                <p className="text-gray text-xs">
              Email: <span className="text-white">hello@vandaluxe.com</span>
            </p>
            <p className="text-gray text-xs">
              Phone: <span className="text-white">+2349045523346</span>
            </p>
</div>
          </motion.div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray/20"></div>

      {/* Bottom Footer */}
      <div className="max-w-6xl mx-auto px-6 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-gray text-sm text-center md:text-left"
          >
            &copy; {currentYear} VANDALUXE. All rights reserved.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex gap-4 md:gap-6"
          >
            {legalLinks.map((link, index) => (
              <a
                key={index}
                href={link.href}
                className="text-gray hover:text-white transition-colors duration-300 text-xs md:text-sm"
              >
                {link.label}
              </a>
            ))}
          </motion.div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
