import React from "react";
import { motion, AnimatePresence } from "motion/react";
import "../index.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faInstagram,
  faTiktok,
  faWhatsapp,
  faXTwitter,
} from "@fortawesome/free-brands-svg-icons";
import { X } from "lucide-react";
import { faMobileScreen } from "@fortawesome/free-solid-svg-icons/faMobileScreen";

function Contact() {
  const [isContactOpen, setIsContactOpen] = React.useState(false);

  React.useEffect(() => {
    if (isContactOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isContactOpen]);

  return (
    <section
      id="contact"
      className="p-5 lg:p-3 flex  items-center justify-center bg-white w-screen min-h-screen"
    >
      <div className="flex flex-col lg:flex-row my-30 items-stretch justify-center w-full max-w-5xl h-[calc(100vh-100px)]">
        {/* Socials - Left Side */}
        <div className="bg-linear-to-br from-white-soft to-gray/30 flex-2 p-8 rounded lg:rounded-l-lg lg:rounded-r-none flex flex-col justify-between">
          <div>
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex border-b border-dark-soft/20 pb-2 items-center justify-between mb-4"
            >
              <h1 className="uppercase text-2xl lg:text-2xl font-semibold text-dark ">
                Get In Touch
              </h1>
              <div>
                <FontAwesomeIcon size="lg" icon={faMobileScreen} />
              </div>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-dark-soft text-base leading-relaxed mb-8"
            >
              Have questions about our latest collection? Want pricing
              information or need assistance with an order? Reach out to us
              through any of our social channels below.
            </motion.p>

            <div>
              <p className="text-sm font-semibold text-dark mb-4">
                Connect With Us:
              </p>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                <motion.a
                  initial={{ opacity: 0, y: -20 }}
                  target="_blank"
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.15 }}
                  className="flex flex-row lg:flex-col lg:space-y-2 justify-between items-center p-4 bg-white rounded cursor-pointer border-2 hover:bg-gray border-transparent hover:border-dark-soft transition-all"
                  href="https://x.com/vlxstudios_?s=11"
                >
                  <div className="flex items-center gap-3">
                    <FontAwesomeIcon
                      className="text-dark-soft"
                      size="lg"
                      icon={faXTwitter}
                    />
                    <span className="lg:hidden block font-sm text-dark">Twitter</span>
                  </div>
                  <span className="text-sm text-dark-soft">@Vlxstudios_</span>
                </motion.a>
                <motion.a
                  initial={{ opacity: 0, y: -20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.15 }}
                  target="_blank"
                  className="flex flex-row lg:flex-col lg:space-y-2 justify-between items-center p-4 bg-white rounded cursor-pointer border-2 hover:bg-gray border-transparent hover:border-dark-soft transition-all"
                  href="https://w.app/vlxstudios"
                >
                  <div className="flex items-center gap-3">
                    <FontAwesomeIcon
                      className="text-dark-soft"
                      size="lg"
                      icon={faWhatsapp}
                    />
                    <span className="lg:hidden block font-sm text-dark">Whatsapp</span>
                  </div>
                  <span className="text-sm text-dark-soft">@Vlxstudios</span>
                </motion.a>

                <motion.a
                  initial={{ opacity: 0, y: -20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                  target="_blank"
                  className="flex flex-row lg:flex-col lg:space-y-2 justify-between items-center p-4 bg-white rounded cursor-pointer border-2 hover:bg-gray border-transparent hover:border-dark-soft transition-all"
                  href="https://www.tiktok.com/@vandaluxe.15?_r=1&_t=ZS-99fRRQJYsw4"
                >
                  <div className="flex items-center gap-3">
                    <FontAwesomeIcon
                      className="text-dark-soft"
                      size="lg"
                      icon={faTiktok}
                    />
                    <span className="lg:hidden block font-semibold text-dark">TikTok</span>
                  </div>
                  <span className="text-sm text-dark-soft">@vandaluxe</span>
                </motion.a>

                <motion.a
                  initial={{ opacity: 0, y: -20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  target="_blank"
                  transition={{ duration: 0.3, delay: 0.25 }}
                  className="flex flex-row lg:flex-col lg:space-y-2 justify-between items-center p-4 bg-white rounded cursor-pointer border-2 hover:bg-gray border-transparent hover:border-dark-soft transition-all"
                  href="https://www.instagram.com/vlxstudios?stkn=ZHYwajQ2N3Mzc20z&utm_source=qr"
                >
                  <div className="flex items-center gap-3">
                    <FontAwesomeIcon
                      className="text-dark-soft"
                      size="lg"
                      icon={faInstagram}
                    />
                    <span className="lg:hidden block font-semibold text-dark">Instagram</span>
                  </div>
                  <span className="text-sm text-dark-soft">@vlxstudios</span>
                </motion.a>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <p className="text-center lg:hidden p-3 text-sm font-medium text-dark mb-4">
              Request Info or Get Pricing
            </p>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-dark-soft lg:block hidden text-sm mb-6 leading-relaxed"
            >
              Fill out the form on the right and we'll get back to you as soon
              as possible with the information you need.
            </motion.p>

            <button
              className="bg-dark-soft p-4 w-full rounded text-white lg:hidden font-semibold hover:bg-dark transition-colors shadow-md"
              onClick={() => setIsContactOpen(!isContactOpen)}
            >
              Send Message
            </button>
          </div>
        </div>

        {/* Contact Form - Right Side - Desktop Only */}
        <div className="hidden lg:flex lg:flex-2 bg-gray/20 p-8 rounded-r-lg rounded-l-none flex-col justify-center">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-dark-soft lg:hidden text-sm mb-6 leading-relaxed"
          >
            Fill out the form below and we'll get back to you as soon as
            possible with the information you need.
          </motion.p>

          <form action="" className="w-full space-y-4">
            <div className="flex gap-2">
           
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.15 }}
              >
                <label
                  htmlFor="userName"
                  className="text-sm font-thin text-dark-soft block mb-2"
                >
                  First Name
                </label>
                <input
                  type="text"
                  placeholder="John"
                  className="w-full p-3 border border-dark-soft/20 rounded bg-white focus:outline-none focus:ring-2 focus:ring-dark-soft transition"
                  id="userName"
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.15 }}
              >
                <label
                  htmlFor="userName"
                  className="text-sm font-thin text-dark-soft block mb-2"
                >
                  Last Name
                </label>
                <input
                  type="text"
                  placeholder="Doe"
                  className="w-full p-3 border border-dark-soft/20 rounded bg-white focus:outline-none focus:ring-2 focus:ring-dark-soft transition"
                  id="userName"
                />
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <label
                className="text-sm font-thin text-dark-soft block mb-2"
                htmlFor="userEmail"
              >
                Email Address
              </label>
              <input
                type="email"
                placeholder="your@email.com"
                className="w-full p-3 border border-dark-soft/20 rounded bg-white focus:outline-none focus:ring-2 focus:ring-dark-soft transition"
                name="email"
                id="userEmail"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.25 }}
            >
              <label
                className="text-sm font-thin text-dark-soft block mb-2"
                htmlFor="userPhoneNumber"
              >
                Phone Number
              </label>
              <input
                type="text"
                placeholder="+234 | 904459088"
                className="w-full p-3 border border-dark-soft/20 rounded bg-white focus:outline-none focus:ring-2 focus:ring-dark-soft transition"
                id="userPhoneNumber"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <label
                className="text-sm font-thin text-dark-soft block mb-2"
                htmlFor="userMessage"
              >
                Message
              </label>
              <textarea
                rows={3}
                placeholder="Tell us how we can help..."
                className="w-full p-3 border border-dark-soft/20 rounded bg-white focus:outline-none focus:ring-2 focus:ring-dark-soft transition resize-none"
                id="userMessage"
              />
            </motion.div>

            <motion.button
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.35 }}
              whileHover={{ scale: 1.02 }}
              className="bg-dark rounded text-white w-full p-4 font-semibold hover:bg-dark-soft transition-colors mt-6 shadow-md"
              type="submit"
            >
              Send Message
            </motion.button>
          </form>
        </div>
      </div>

      {/* Mobile Modal - Contact Form */}
      <AnimatePresence>
        {isContactOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="bg-transparent backdrop-blur-2xl text-dark fixed top-0 left-0 p-5 h-screen overflow-scroll contactScroll flex justify-center items-center z-20 w-full"
          >
            <div className="bg-white translate-y-30 p-6 rounded-lg max-w-sm w-full shadow-2xl">
              <div className="flex border-b-2 border-gray justify-between items-center pb-4 mb-6">
                <h1 className="font-bold lg:hidden text-xl">Contact Us</h1>
                <X
                  onClick={() => setIsContactOpen(!isContactOpen)}
                  size={24}
                  className="cursor-pointer hover:text-dark-soft transition"
                />
              </div>
              <form action="" className="w-full space-y-4">
                <div>
                  <label
                    htmlFor="userName"
                    className="text-sm font-semibold text-dark-soft block mb-2"
                  >
                    Full Name
                  </label>
                  <input
                    type="text"
                    placeholder="Your Full Name"
                    className="w-full p-3 border border-gray rounded focus:outline-none focus:ring-2 focus:ring-dark-soft transition"
                    id="userName"
                  />
                </div>
                <div>
                  <label
                    className="text-sm font-semibold text-dark-soft block mb-2"
                    htmlFor="userEmail"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="email@domain.com"
                    className="w-full p-3 border border-gray rounded focus:outline-none focus:ring-2 focus:ring-dark-soft transition"
                    name="email"
                    id="userEmail"
                  />
                </div>
                <div>
                  <label
                    className="text-sm font-semibold text-dark-soft block mb-2"
                    htmlFor="userPhoneNumber"
                  >
                    Phone Number
                  </label>
                  <input
                    type="text"
                    placeholder="+234 | 904459088"
                    className="w-full p-3 border border-gray rounded focus:outline-none focus:ring-2 focus:ring-dark-soft transition"
                    id="userPhoneNumber"
                  />
                </div>
                <div>
                  <label
                    className="text-sm font-semibold text-dark-soft block mb-2"
                    htmlFor="userMessage"
                  >
                    Message
                  </label>
                  <textarea
                    type="text"
                    rows={4}
                    placeholder="Your Message"
                    className="w-full p-3 border border-gray rounded focus:outline-none focus:ring-2 focus:ring-dark-soft transition resize-none"
                    id="userMessage"
                  />
                </div>
                <button
                  className="bg-dark rounded text-white w-full p-4 font-semibold hover:bg-dark-soft transition-colors mt-2"
                  type="submit"
                >
                  Submit
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

export default Contact;
