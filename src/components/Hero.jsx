import { Link } from "react-router-dom";
import "../index.css";

function Hero() {
  return (
    <div className="p-5 flex mt-20 flex-col items-center bg-dark justify-center w-full h-[calc(100vh-80px)] bg-hero bg-cover bg-center">
      <div className="flex flex-col gap-2 text-white-soft">
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
            className="bg-white text-center border hover:border-gray border-white hover:bg-gray text-dark rounded-full py-3 px-6 "
          >
            Join the community
          </a>
          <Link
            to="/Collection"
            className="bg-transparent text-center hover:border-gray  py-3 px-6 border font-white rounded-full border-white"
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
