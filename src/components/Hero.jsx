import "../index.css"
import { motion } from "motion/react";

function Hero(){
    return(
        <div className="p-5 flex flex-col items-center bg-dark justify-center w-full h-[calc(100vh-80px)] bg-hero bg-cover bg-center">
            <div className="flex flex-col gap-2 text-white-soft">
                <h2 style={{fontFamily: "AccentFont"}} className="text-2xl ">ANGELS DON'T MISS</h2>
                <p className="max-w-[400px] font-light">Lorem ipsum dolor sit amet consectetur adipisicing elit. Incidunt iure vero amet eum voluptas autem inventore, nisi voluptatibus totam fuga.</p>
                <button style={{fontFamily:""}} className="bg-white max-w-[200px] p-4 text-accent">View Collection</button>
            </div>
        </div>
    )
}

export default Hero;