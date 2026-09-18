import "../index.css";
import model from "../assets/vdx11.jpeg";
import logo from "../assets/logo1.jpeg";
import { NavLink } from "react-router-dom";
import { Shirt, File, KeyRoundIcon } from "lucide-react";
import { motion } from "motion/react";

function About() {
  const styles = {
    model: {
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      backgroundSize: "cover",
      backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${model})`,
    },
  };

  return (
    <div className="flex scroll-smooth homePage bg-dark flex-col items-center overflow-x-hidden text-white justify-center w-full h-full">
      <section
        style={styles.model}
        className="p-5 relative flex flex-col items-center lg:bg-dark justify-center lg:bg-contain w-full h-screen bg-hero bg-cover bg-center"
      >
        <div className=" storeBanner flex justify-between items-center absolute p-2 top-12 w-full h-[100px]">
          <span className="font-sm cursor-pointer border border-white-soft text-white-soft p-2 font-thin">
            <NavLink className="font-sm hover:underline" to="/">
              Home
            </NavLink>
            {" / "}About Us
          </span>
        </div>
        <div className="flex flex-col w-full items-center justify-center gap-2">
          <span className="text-center flex flex-col gap-2">
            <p className="text-sm font-light text-gray tracking-widest ">
              ABOUT
            </p>
            <h1
              style={{ fontFamily: "AccentFont" }}
              className="font-bold text-white text-center text-2xl uppercase"
            >
              VANDALUXE
            </h1>
          </span>
          <p className="text-center max-w-[400px] font-light">
            Vandaluxe is a Nigerian streetwear and creative brand built for
            those who refuse to blend in.
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
      <section className="relative w-full text-center h-screen  flex flex-col items-center">
        <h1
          style={{ fontFamily: "AccentFont" }}
          className="absolute leading-30 text-8xl top-5 text-gray/20 z-1"
        >
          ABOUT VANDALUXE ABOUT VANDALUXE ABOUT VANDALUXE
        </h1>
        <div className="bg-dark-soft z-5 -translate-y-[50%] p-4 w-[80%] text-white text-center">
          <h1 style={{ fontFamily: "Castoro titling" }}>
            NOT JUST WHAT YOU WEAR. IT’S HOW YOU MOVE.
          </h1>
        </div>
        <div className="w-full flex-col flex gap-25  z-2 p-5">
          <div className="bg-dark-soft z-2 p-2">
            <img src={logo} alt="" />
            <p className="text-start p-2 my-2 font-light">
              Born in Abuja, <mark>Vandaluxe</mark> exists at the intersection
              of style, rebellion, individuality, and culture. We create pieces
              that carry intention — clothing designed not simply to be worn,
              but to become part of how you express who you are.
            </p>
          </div>
        </div>
      </section>
      <section className="mt-15 bg-[linear-gradient(#1c1c1c,#fafafa)] w-full z-5">
        <div className=" p-2">
          <h1 style={{ fontFamily: "Castoro titling" }} className="text-center">
            We don’t believe style should come with a rulebook.<br></br>That’s
            where REBEL N’ STYLE comes in.
          </h1>
        </div>

        <div className="w-full p-4">
          <div className="bg-dark-soft lg:flex z-2 p-2">
            <img className="lg:max-w-[400px]" src={logo} alt="" />
            <div className="bg-dark-soft absolute p-2 -translate-y-[118%] translate-x-[5%]">
              <h1 style={{fontFamily:"AccentFont"}}>REBEL N’ STYLE</h1>
              <h2 className="text-gray  text-sm font-light">Rebellion isn’t always loud.</h2>
            </div>
            <p className="text-start my-2 p-2 font-light">
              Sometimes, rebellion is choosing your own direction when everyone
              expects you to follow theirs. REBEL N’ STYLE is the Vandaluxe
              mindset — challenging the ordinary, breaking patterns, and
              expressing yourself without asking for permission.
            </p>
          </div>
        </div>
      </section>
      <section className="bg-white flex flex-col justify-center items-center p-5 w-full text-dark-soft">
        <div style={{fontFamily:"Castoro titling"}} className="text-center my-2" >We believe your style should be yours</div>
        <ul className="w-full gap-2  flex flex-col">
          <motion.li
          className="bg-white-soft rounded flex items-center justify-between p-4"><span>No Uniform</span><Shirt/></motion.li>
          <li className="bg-white-soft rounded p-4 flex items-center justify-between "><span>No template</span><File/></li>
          <li className="bg-white-soft rounded p-4 flex items-center justify-between "><span>No permission required</span><KeyRoundIcon/></li>
        </ul>
      </section>
    </div>
  );
}

export default About;
