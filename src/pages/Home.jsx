import { motion } from "motion/react";
import "../index.css"
import Header from "../components/Header";
import Hero from "../components/Hero";
import Welcome from "../components/Welcome";
import Section2 from "../components/Section2";

function Home(){
    return(
        <div className="flex bg-white flex-col items-center overflow-x-hidden justify-center w-full h-full ">
           <Welcome/>
            <Header/>
            <Hero/>
            <Section2/>
        </div>
    )
}

export default Home;