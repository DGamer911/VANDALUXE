import "../index.css";
import { motion } from "motion/react";
import placeholder from "../assets/placeholder2.jfif";
import { Link } from "react-router-dom";

function Section2() {
  return (
    <section className="w-full h-full flex flex-col items-center justify-center bg-white p-8">
      <h1 className="uppercase text-center">Try Out Our Latest Selection</h1>
      <div className="w-full lg:justify-center items-center  flex flex-nowrap overflow-x-auto  cardScroll  scroll-smooth gap-4 mt-6">
        <div className="max-w-[240px] border-2 border-gray rounded flex-none flex flex-col items-center justify-center p-2 text-center">
          <motion.img
            initial={{ y: -5 }}
            whileInView={{ y: 0 }}
            src={placeholder}
            alt="placeholder"
            className="w-full h-full object-cover"
          />
          <h3 className="font-medium">Product Name</h3>
          <p className="" style={{ fontFamily: "Castoro Titling" }}>
            $99.99
          </p>
        </div>
        <div className="w-[240px] border-2 border-gray rounded flex-none flex flex-col items-center justify-center p-2 text-center">
          <img
            src={placeholder}
            alt="placeholder"
            className="w-full h-full object-cover"
          />
          <h3 className="font-medium">Product Name</h3>
          <p className="" style={{ fontFamily: "Castoro Titling" }}>
            $99.99
          </p>
        </div>
        <div className="w-[240px] border-2 border-gray rounded flex-none flex flex-col items-center justify-center p-2 text-center">
          <img
            src={placeholder}
            alt="placeholder"
            className="w-full h-full object-cover"
          />
          <h3 className="font-medium">Product Name</h3>
          <p className="" style={{ fontFamily: "Castoro Titling" }}>
            $99.99
          </p>
        </div>
        <div className="w-[240px] border-2 border-gray rounded flex-none flex flex-col items-center justify-center p-2 text-center">
          <img
            src={placeholder}
            alt="placeholder"
            className="w-full h-full object-cover"
          />
          <h3 className="font-medium">Product Name</h3>
          <p className="" style={{ fontFamily: "Castoro Titling" }}>
            $99.99
          </p>
        </div>
      </div>
      <div className="border-t-2 space-y-2 w-full flex-col flex items-center justify-center border-white-soft p-2 mt-8 text-center">
        <p className="font-light lg:my-2">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Expedita
          officiis repellendus!
        </p>
        <Link to="/Collection" className="w-full">
          <motion.button
            style={{ border: "1px solid transparent" }}
            whileHover={{
              background: "transparent",
              color: "black",
              border: "1px solid #1C1C1C",
            }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="bg-dark max-w-[300px] p-4 w-full text-white"
          >
            View More
          </motion.button>
        </Link>
      </div>
    </section>
  );
}

export default Section2;
