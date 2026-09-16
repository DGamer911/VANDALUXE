import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Heart } from "lucide-react";
import { selection } from "../data/data";
import { useFavorites } from "../context/FavoritesContext";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  faFacebook,
  faInstagram,
  faXTwitter,
  faPinterest,
} from "@fortawesome/free-brands-svg-icons";
import "../index.css";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const product = selection.find((product) => product.id === Number(id));

  if (!product) {
    return <h1>Product not found</h1>;
  }
  const { toggleFavorite, isFavorite } = useFavorites();

  const favorite = isFavorite(product.id);

  return (
    <section className="product-details lg:pt-20 gap-2 relative overflow-x-hidden lg:flex w-full p-5">
      <div className="flex mt-14 lg:gap-2 top-13 left-10 z-10 lg:absolute justify-between">
        <button
          className=" bg-transparent lg:bg-dark-soft border border-gray/20 p-2 cursor-pointer text-gray hover:text-white  flex gap-1 items-center"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={18} />
          <span className="text-sm ">Back</span>
        </button>
        <div className="flex p-2 items-center gap-2 lg:bg-dark-soft bg-transparent border border-gray/20 text-gray">
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
      <div className="mt-2 relative bg-dark-soft w-fit gap-8 lg:flex items-center p-4 text-white">
        <div className="w-full absolute left-0 lg:left-90 lg:translate-x-[9%] px-4 lg:top-4  flex justify-between ">
          <Heart
            onClick={() => toggleFavorite(product.id)}
            aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
            className="bg-dark-soft translate-x-[38%] mt-1 ml-1 w-10 h-10 p-[12px] hover:p-[10px] duration-150 text-white "
            fill={favorite ? "currentColor" : "none"}
          />
        </div>
        <img
          className="w-full lg:max-w-[500px] cursor-pointer"
          src={product.img}
          alt={product.name}
        />

        <div className="flex flex-col lg:max-w-[400px] w-full items-center">
          <div className="bg-dark px-6 py-2 text-center absolute translate-y-[-50%]">
            <h1 className="lg:text-2xl lg:font-bold font-accent">
              {product.name}
            </h1>

            <h2>₦{product.price.toLocaleString()}</h2>
          </div>

          <p className="mt-10 mb-2 text-center font-light">
            {product.description}
          </p>
          <a className="font-light lg:hidden text-sm cursor-pointer uppercase underline">
            View Size guide
          </a>
          <div className="flex w-full items-center justify-between my-2">
            <ul className="flex flex-2/3 gap-1">
              {product.size.map((size) => (
                <li className="bg-transparent hover:border-white hover:text-white cursor-pointer uppercase text-xs font-light w-10 text-center border  border-gray/20 p-2">
                  {size}
                </li>
              ))}
            </ul>
            <div className="flex">
              {product.color.map((color) => (
                <span
                  className={`bg-${color} border border-gray p-4 cursor-pointer`}
                />
              ))}
            </div>
          </div>

          <div className="w-full items-center justify-center gap-2 flex">
            <button className="bg-white flex-2/3 text-dark p-4 w-full">
              Add to Bag
            </button>
          </div>
        </div>
      </div>
      <div className="lg:block flex-1/3 p-5 mt-2 hidden bg-dark-soft">
        <div className="border-b border-gray/20  pb-4">
          <span className="uppercase text-white">size chart</span>
        </div>
        <div className="uppercase my-4 bg-transparent border border-gray/20 text-white p-2">
          sizes in inches
        </div>
        <table className="text-white border border-gray/20 p-4">
          <thead>
            <tr className="uppercase">
              <th>size</th>
              <th>chest</th>
              <th>waist</th>
              <th>hip</th>
              <th>inseam</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="uppercase font-semibold">xxs</td>
              <td>29"-30"</td>
              <td>21"-23"</td>
              <td>33"-34"</td>
              <td>26"</td>
            </tr>
            <tr>
              <td className="uppercase">xs</td>
              <td>31"-32"</td>
              <td>24"-25"</td>
              <td>35"-36"</td>
              <td>26.5"</td>
            </tr>
            <tr>
              <td className="uppercase">s</td>
              <td>33"-34"</td>
              <td>26"-27"</td>
              <td>37"-38"</td>
              <td>27.5"</td>
            </tr>
            <tr>
              <td className="uppercase">m</td>
              <td>35"-36"</td>
              <td>28"-29"</td>
              <td>39"-40"</td>
              <td>28"</td>
            </tr>
            <tr>
              <td className="uppercase">l</td>
              <td>37"-38"</td>
              <td>30"-31"</td>
              <td>41"-42"</td>
              <td>28.5"</td>
            </tr>
            <tr>
              <td className="uppercase">xl</td>
              <td>39"-40"</td>
              <td>32"-34"</td>
              <td>43"-44"</td>
              <td>29"</td>
            </tr>
            <tr>
              <td className="uppercase">xxl</td>
              <td>41"-42"</td>
              <td>35"-37"</td>
              <td>45"-46"</td>
              <td>29.5"</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default ProductDetails;
