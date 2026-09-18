import { Link } from "react-router-dom";

function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center text-center px-6">
    <div className="bg-dark-soft flex flex-col gap-2 rounded p-5">
          <p className="text-sm mb-5 uppercase tracking-widest text-gray/20">
        Error 404
      </p>

      <h1 style={{fontFamily:"AccentFont"}} className="text-6xl md:text-8xl text-white font-bold ">
        404
      </h1>

      <h2 className="text-2xl md:text-3xl text-white font-semibold">
        Page not found
      </h2>

      <p className="text-gray/80 max-w-sm my-2">
        Sorry, the page you're looking for doesn't exist or may have been
        moved.
      </p>

      <Link
        to="/"
        className="px-6 py-3 bg-white text-dark rounded-full hover:bg-gray transition"
      >
        Back to Home
      </Link>
    </div>
    </main>
  );
}

export default NotFound;