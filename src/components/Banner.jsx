import { motion } from "motion/react";
import "../index.css"
import { div } from "motion/react-client";
import { X } from "lucide-react" 

function Banner(){
    return(
        <div className="bg-gray p-3 flex items-center justify-between w-full">
            <p className='text-dark bannerText font-thin'>Lorem ipsum dolor sit amet consectetur.
            </p>
            <X size={18} className=" text-black" />
        </div>
    )
}

export default Banner;