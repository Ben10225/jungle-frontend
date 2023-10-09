import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <>
      <div className="w-screen h-screen flex justify-center items-center flex-col">
        <h1 className="text-white text-3xl mb-20">This is Home Page</h1>
        <h6 className="text-white text-xl font-light mb-20">
          Welcome to Jungle Shop 🙋‍♀️
        </h6>
        <Link to="/register">
          <button className="mt-6 bg-transparent text-stone-400 font-normal hover:text-white py-2 px-4 border border-stone-400 hover:border-white rounded transition duration-200">
            Sign up
          </button>
        </Link>
      </div>
    </>
  );
};

export default HomePage;
