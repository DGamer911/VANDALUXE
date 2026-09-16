import { useFavorites } from "../context/FavoritesContext";
import { selection } from "../data/data";
import ProductCard from "../components/ProductCard";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  faFacebook,
  faInstagram,
  faXTwitter,
  faPinterest,
} from "@fortawesome/free-brands-svg-icons";
import "../index.css";

function Favorites() {
  const { favorites } = useFavorites();
  const navigate = useNavigate();

  const favoriteProducts = selection.filter((product) =>
    favorites.includes(product.id),
  );

  return (
    <section className="mt-16 flex  flex-col justify-center items-center bg-dark p-5 text-white">
      <div className="mb-3 flex w-full items-center justify-between">
        <button
          className=" bg-transparent lg:bg-dark-soft border border-gray/20 p-2 cursor-pointer text-gray hover:text-white  flex gap-1 items-center"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={18} />
          <span className="text-sm ">Back</span>
        </button>
        <div className="flex p-2  items-center gap-2 lg:bg-dark-soft bg-transparent border border-gray/20 text-gray">
          <span className="uppercase border-r border-gray/20 text-sm font-light pr-2">
            Share
          </span>
          <div className="flex gap-1 text-white ">
            <FontAwesomeIcon
              className="hover:text-gray cursor-pointer"
              icon={faInstagram}
            />
            <FontAwesomeIcon
              className="hover:text-gray cursor-pointer"
              icon={faFacebook}
            />
            <FontAwesomeIcon
              className="hover:text-gray cursor-pointer"
              icon={faXTwitter}
            />
            <FontAwesomeIcon
              className="hover:text-gray cursor-pointer"
              icon={faPinterest}
            />
          </div>
        </div>
      </div>
        <h1 style={{fontFamily:"AccentFont"}} className="text-2xl mb-4 bg-dark-soft p-4 w-full text-center">Favorites</h1>


      {favoriteProducts.length === 0 ? (
        <p>You haven't added any favorites yet.</p>
      ) : (
        <div className="products-grid md:gap-7 gap-4 grid lg:grid-cols-6 grid-cols-2 md:grid-cols-4">
          {favoriteProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}

export default Favorites;
