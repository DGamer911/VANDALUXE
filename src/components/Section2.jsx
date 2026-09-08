import React from 'react'
import "../index.css"
import { motion } from "motion/react";
import { AnimatePresence } from "motion/react";
import placeholder from "../assets/placeholder2.jfif"

function Section2() {
  return (
    <section className="w-full h-full flex flex-col items-center justify-center bg-gray-100 p-8">
        <h1 className="uppercase">Try Out Our Latest Selection</h1>
        <div  className="w-full flex flex-nowrap items-center overflow-x-auto  cardScroll  scroll-smooth gap-4 mt-6">
            <div className="w-[260px] border-2 border-gray rounded flex-none flex flex-col items-center justify-center p-2 text-center">
                <img src={placeholder}  alt="placeholder" className="w-full h-full object-cover"/>
                <h3 className='font-medium'>Product Name</h3>
                <p className="" style={{fontFamily:"Castoro Tilting"}}>$99.99</p>
            </div>
            <div className="w-[260px] border-2 border-gray rounded flex-none flex flex-col items-center justify-center p-2 text-center">
                <img src={placeholder}  alt="placeholder" className="w-full h-full object-cover"/>
                <h3 className='font-medium'>Product Name</h3>
                <p className="" style={{fontFamily:"Castoro Tilting"}}>$99.99</p>
            </div>
            <div className="w-[260px] border-2 border-gray rounded flex-none flex flex-col items-center justify-center p-2 text-center">
                <img src={placeholder}  alt="placeholder" className="w-full h-full object-cover"/>
                <h3 className='font-medium'>Product Name</h3>
                <p className="" style={{fontFamily:"Castoro Tilting"}}>$99.99</p>
            </div>
            <div className="w-[260px] border-2 border-gray rounded flex-none flex flex-col items-center justify-center p-2 text-center">
                <img src={placeholder}  alt="placeholder" className="w-full h-full object-cover"/>
                <h3 className='font-medium'>Product Name</h3>
                <p className="" style={{fontFamily:"Castoro Tilting"}}>$99.99</p>
            </div>
        </div>
    </section>
  )
}

export default Section2