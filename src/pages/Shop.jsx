import storeBanner from "../assets/store.jpg";
import "../index.css";
import { NavLink } from "react-router-dom";
import model from "../assets/image1.jpg";
import { selection } from "../data/data";
import { motion } from "motion/react";
import { Search, ListFilterIcon } from "lucide-react";

function Shop() {
  const styles = {
    storeBanner: {
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      backgroundSize: "cover",
      color: "white",
      backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${storeBanner})`,
    },
    model: {
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      backgroundSize: "cover",
      backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${model})`,
    },
  };

  return (
    <div className="flex homePage bg-dark flex-col items-center overflow-x-hidden text-white justify-center w-full h-full ">
      <section
        style={styles.model}
        className="p-5 relative flex flex-col items-center lg:bg-dark justify-center lg:bg-contain w-full h-screen bg-hero bg-cover bg-center"
      >
        <div className=" storeBanner flex justify-between items-center absolute p-2 top-12 w-full h-[100px]">
          <span className="font-sm cursor-pointer border border-white-soft text-white-soft p-2 font-thin">
            <NavLink className="font-sm hover:underline" to="/">
              Home
            </NavLink>
            {" / "}Shop
          </span>
        </div>
        <div className="flex flex-col w-full items-center justify-center gap-2">
          <h1
            style={{ fontFamily: "AccentFont" }}
            className="font-bold text-white text-4xl uppercase"
          >
            Shop
          </h1>
          <p className="text-center max-w-[400px] font-light">
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Vero earum
            fugiat consequatur error enim itaque.
          </p>
          <a
            onClick={() => console.log("clicked")}
            href="/#contact"
            className="bg-transparent text-white  uppercase text-center border hover:text-dark border-white hover:bg-white text-dark rounded-full py-3 px-1 transition-all duration-300 ease-out w-full max-w-[320px] "
          >
            Join the rebellion
          </a>
        </div>
      </section>
      <section className="relative w-full text-center  flex flex-col items-center">
        <h1
          className="bg-dark-soft translate-y-[-50%] p-4 w-[40%] text-white text-center"
          style={{ fontFamily: "Castoro titling" }}
        >
          Collection
        </h1>

        <div className="w-full lg:justify-center items-center flex flex-nowrap overflow-x-auto  cardScroll  scroll-smooth gap-4 py-2 px-6 mt-4">
          {selection.map((item) => (
            <motion.div
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3, type: "spring" }}
              className=" cursor-pointer flex flex-none mb-10 flex-col items-center justify-between relative bg-dark-soft p-2 max-w-[220px]"
              key={item.id}
            >
              <motion.img
                whileHover={{ scale: 1.1 }}
                className=""
                src={item.img}
                alt=""
              />
              <div className="bg-dark-soft translate-y-5 absolute bottom-0 px-4 py-2  flex flex-col">
                <span>{item.name}</span>
                <span className="" style={{}}>
                  {item.price}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
      <section className="border-t flex flex-col items-center border-gray/20 p-5">
        <div className="w-full  mb-4 gap-2 flex">
          <button className="border-gray/20 border text-gray/20 p-2">
            <ListFilterIcon />
          </button>
          <input
            className="p-2 flex-2/3 outline-0 border-gray/20 border"
            placeholder="Search"
            type="text"
          />
          <button className="border-gray/20 border text-gray/20 p-2">
            <Search />
          </button>
        </div>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {selection.map((item) => (
            <motion.div
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3, type: "spring" }}
              className=" cursor-pointer flex flex-none flex-col items-center justify-between relative bg-dark-soft  max-w-[135px]"
              key={item.id}
            >
              <motion.img
                whileHover={{ scale: 1.01 }}
                className="rounded-b-2xl"
                src={item.img}
                alt=""
              />
              <div className="flex flex-col p-3 gap-[1px]">
                <span>{item.name}</span>
                <span className="text-center font-light" style={{}}>
                  {item.price}
                </span>
                <button className="bg-white w-full p-2 text-dark">
                  Buy Now
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Shop;
