import { motion } from "motion/react";
import "../index.css"
import Banner from "../components/Banner";
import Header from "../components/Header";
import Hero from "../components/Hero";
import Welcome from "../components/Welcome";

function Home(){
    return(
        <div className="flex bg-white flex-col items-center justify-center w-full h-screen ">
           <Welcome/>
            <Banner/>
            <Header/>
            <Hero/>
        </div>
    )
}

export default Home;