import "../index.css";
import model from "../assets/vdx11.jpeg";
import model2 from "../assets/LOGO1.jpeg";
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
  const message = [
    {
      id: 1,
      title: "INDIVIDUALITY",
      msg: "We create for people who would rather be themselves than become a copy of someone else.",
    },
    {
      id: 2,
      title: "REBELLION",
      msg: "We question the expected and challenge the ordinary. Vandaluxe was built to move differently.",
    },
    {
      id: 3,
      title: "EXPRESSION",
      msg: "Clothing is a language. Every piece, graphic, silhouette, and detail is part of the conversation.",
    },
    {
      id: 4,
      title: "EVOLUTION",
      msg: "Vandaluxe is constantly moving. We experiment, create, refine, and push the vision forward.",
    },
    {
      id: 5,
      title: "CRAFT",
      msg: "The idea is only the beginning. We care about how that idea becomes something real.",
    },
  ];

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
              className="font-bold text-white text-center text-3xl uppercase"
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
      <section className="relative w-full text-center h-screen lg:h-fit  flex flex-col items-center">
        <h1
          style={{ fontFamily: "AccentFont" }}
          className="absolute leading-30 text-8xl top-5 text-gray/20 z-1"
        >
          ABOUT VANDALUXE ABOUT VANDALUXE ABOUT VANDALUXE ABOUT VANDALUXE
        </h1>
        <div className="bg-dark-soft z-5 -translate-y-[50%] p-4 w-[80%] text-white text-center">
          <h1 style={{ fontFamily: "Castoro titling" }}>
            NOT JUST WHAT YOU WEAR. IT’S HOW YOU MOVE.
          </h1>
        </div>
        <div className="w-full flex-col items-center flex  z-2 p-5">
          <div className="bg-dark-soft max-w-[500px] flex lg:flex-row flex-col z-2 p-2">
            <img src={model2} alt="" className="lg:max-w-[200px]" />
            <p className="text-start p-2 my-2 font-light lg:font-normal">
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
            <img className="lg:max-w-[400px]  " src={model} alt="" />
            <div className="bg-dark-soft absolute p-2 -translate-y-[118%] translate-x-[5%]">
              <h1 style={{ fontFamily: "AccentFont" }}>REBEL N’ STYLE</h1>
              <h2 className="text-gray  text-sm font-light">
                Rebellion isn’t always loud.
              </h2>
            </div>
            <p className="text-start my-2 p-2 font-light">
              Sometimes, rebellion is choosing your own direction when everyone
              expects you to follow theirs.<br></br> REBEL N’ STYLE is the
              Vandaluxe mindset — challenging the ordinary, breaking patterns,
              and expressing yourself without asking for permission.
            </p>
          </div>
        </div>
      </section>
      <section className="bg-white flex flex-col justify-center items-center p-5 w-full text-dark-soft">
        <h1
          style={{ fontFamily: "Castoro titling" }}
          className="text-center my-4"
        >
          We believe your style should be yours
        </h1>
        <ul className="w-full gap-2 lg:flex-row items-center justify-center flex flex-col">
          <motion.li className="bg-white-soft flex-1 max-w-[320px] w-full rounded flex items-center justify-between p-4">
            <span>No Uniform</span>
            <Shirt strokeWidth={1.5} size={20} />
          </motion.li>
          <li className="bg-white-soft rounded flex-1 max-w-[320px] w-full p-4 flex items-center justify-between ">
            <span>No template</span>
            <File strokeWidth={1.5} size={20} />
          </li>
          <li className="bg-white-soft rounded flex-1 max-w-[320px] w-full p-4 flex items-center justify-between ">
            <span>No permission required</span>
            <KeyRoundIcon strokeWidth={1.5} size={20} />
          </li>
        </ul>
      </section>
      <section className="bg-white flex flex-col justify-center items-center w-full text-dark-soft">
        <h1
          style={{ fontFamily: "Castoro titling" }}
          className="text-center w-full my-4 border-y p-4 border-gray text-dark"
        >
          WHAT WE STAND FOR
        </h1>

        <div className="flex lg:flex-wrap lg:justify-center gap-5  fg p-5 w-full overflow-x-scroll ">
          {message.map((text) => (
            <div
              className="bg-accent3 rounded lg:max-w-[350px] w-full text-white flex flex-col max-w-[250px] flex-none"
              key={text.id}
            >
              <h1
                style={{ fontFamily: "Castoro titling" }}
                className="bg-accent5 rounded-t p-3"
              >
                {text.title}
              </h1>
              <p className="p-4 italic">{`"${text.msg}"`}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="bg-[linear-gradient(#fafafa,#1c1c1c)] p-5">
        <h1
          style={{ fontFamily: "Castoro titling" }}
          className="text-center w-full my-4 p-4 bg-dark-soft"
        >
          MORE THAN CLOTHING
        </h1>
        <div className="p-4 bg-dark-soft">
          Vandaluxe is being built as a creative world. Fashion is the
          foundation, but the vision extends beyond the clothes — into
          photography, film, music, art, design, storytelling, and culture.
          Every collection is another chapter. Every piece carries part of the
          story. Every person who wears Vandaluxe becomes part of the world.
        </div>
        <div className="p-4 bg-dark-soft my-4">
          <span className="bg-white p-1 text-dark">THE BEGINNING</span>
          Vandaluxe started with a simple idea: Create something that feels like
          us. What began as a small vision in Abuja is growing into something
          much bigger — a brand built from <strong><span  className="bg-purple-500 p-1">creativity</span> , <span className="bg-purple-500 p-1">ambition</span>, and the <span className="bg-purple-500 p-1">belief</span></strong> that you don’t
          have to follow an existing path to create something meaningful. We’re
          still building. Still experimenting. Still evolving. And that’s
          exactly how we want it. THIS IS
          <span className="bg-amber-400 p-1 text-accent">VLX.</span><br></br>
          <br></br>
          <em>
            "We don’t want to tell you who to be. We want to create pieces that
            give you another way to express who you already are."
          </em><br></br><br></br>
   So wear it your way. Move your way. Create your own rules.<br></br> 
        </div>
        <h1 style={{ fontFamily:"AccentFont"}} className="p-4 border bg-dark-soft ">
                   REBEL N’
          STYLE. VANDALUXE
        </h1>
      </section>
    </div>
  );
}

export default About;
