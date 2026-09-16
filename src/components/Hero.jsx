import { Link } from "react-router-dom";
import "../index.css";
import model from "../assets/image1.jpg"


function Hero() {
    const styles = {
      model: {
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundImage:
          `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${model})`
      },
    };
  

  return (
    <div style={styles.model} className={`p-5 flex flex-col items-center justify-center w-full h-screen`}>
      <div className="flex  translate-y-10 flex-col gap-2 text-white-soft">
        <h2 style={{ fontFamily: "AccentFont" }} className="text-2xl ">
          ANGELS DON'T MISS
        </h2>
        <p className="max-w-[400px] font-light">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Incidunt iure
          vero amet eum voluptas autem inventore, nisi voluptatibus totam fuga.
        </p>
        <div className="flex lg:fex-row flex-col gap-2">
          <a

            onClick={() => console.log("clicked")}
            href="/#contact"
            className="bg-white uppercase text-center border hover:border-gray border-white hover:bg-gray text-dark rounded-full transition-all py-3 duration-300 ease-out px-1 "
          >
            Join the rebellion
          </a>
          <Link
            to="/Shop"
            className="bg-transparent uppercase text-center hover:border-gray  py-3 px-6 border font-white duration-300 ease-out transition-all rounded-full border-white"
            onClick={() => console.log("clicked")}
          >
            Unlock the Vault
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Hero;
