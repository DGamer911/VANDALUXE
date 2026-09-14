import "../index.css";
import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { selection } from "../data/data";

function Section2() {
  return (
    <section className="w-full h-full flex flex-col items-center justify-center bg-white p-8">
      <h1
        style={{ fontFamily: "Castoro titling" }}
        className="uppercase text-center"
      >
        Try Out Our Latest Selection
      </h1>
      <div className="w-full lg:justify-center items-center  flex flex-nowrap overflow-x-auto  cardScroll  scroll-smooth gap-4 mt-6">
        {selection.map((item, id) => (
          <div
            className="max-w-[240px] border-2 border-gray rounded flex-none flex flex-col items-center justify-center p-2 text-center"
            key={id}
          >
            <motion.img
              initial={{ y: -5 }}
              whileInView={{ y: 0 }}
              src={item.img}
              alt="placeholder"
              className="w-full h-full object-cover"
            />
            <div className="bg-white-soft w-full rounded mt-1 p-1">
              <h3 className="font-medium">{item.name}</h3>
              <p className="">{item.price}</p>
            </div>
          </div>
        ))}
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
