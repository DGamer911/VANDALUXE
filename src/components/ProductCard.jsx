import { Heart } from "lucide-react";
import { useFavorites } from "../context/FavoritesContext";
import { motion } from "motion/react";
import { NavLink } from "react-router-dom";

function ProductCard({ product }) {
  const { toggleFavorite, isFavorite } = useFavorites();

  const favorite = isFavorite(product.id);

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3, type: "spring" }}
      className=" cursor-pointer flex flex-none flex-col items-center justify-between relative bg-dark-soft lg:max-w-[200px]  max-w-[135px]"
      key={product.id}
    >
      <button
      className="absolute left-0 bg-dark-soft mt-1 ml-1 p-2"
        onClick={() => toggleFavorite(product.id)}
        aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
      >
        <Heart className="w-4 h-4 hover:text-gray" fill={favorite ? "currentColor" : "none"} />
      </button>
      <NavLink to={`/products/${product.id}`}>
        <motion.img className="" src={product.img} alt="" />
        <div className="flex flex-col p-3 gap-[1px]">
          <span className="text-center">{product.name}</span>
          <span className="text-center font-light" style={{}}>
            ₦{product.price.toLocaleString()}
          </span>

          <button className="bg-white  w-full p-2 text-dark">Buy Now</button>
        </div>
      </NavLink>
    </motion.div>
  );
}

export default ProductCard;
