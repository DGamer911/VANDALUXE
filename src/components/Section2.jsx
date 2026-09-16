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
          {selection.map((item) => (
            <motion.div
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3, type: "spring" }}
              className=" cursor-pointer hover:shadow-2xl flex flex-none mb-10 flex-col items-center justify-between relative bg-white-soft p-2 max-w-[220px]"
              key={item.id}
            >
              <motion.img
                whileHover={{ scale: 1.1 }}
                className=""
                src={item.img}
                alt=""
              />
              <div className="bg-white-soft text-center translate-y-5 absolute bottom-0 px-4 py-2  flex flex-col">
                <span>{item.name}</span>
                <span className="" style={{}}>
                 ₦{item.price.toLocaleString()}
                </span>
              </div>
            </motion.div>
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
