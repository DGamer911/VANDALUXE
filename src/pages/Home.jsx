import "../index.css";
import Hero from "../components/Hero";
import Welcome from "../components/Welcome";
import Section2 from "../components/Section2";
import Contact from "../components/Contact";

function Home() {
  return (
    <div className="flex homePage bg-dark flex-col items-center overflow-x-hidden justify-center w-full h-full ">
      <Welcome />

      <Hero />
      <Section2 />
      <div id="contact">
        <Contact />
      </div>
    </div>
  );
}

export default Home;
