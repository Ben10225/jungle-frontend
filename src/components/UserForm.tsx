import axios from "axios";
import { useState } from "react";
import { ENDPOINT } from "../App";
import { useNavigate } from "react-router-dom";

const UserForm = () => {
  interface formObject {
    name: string;
    id: number;
  }

  interface reqObject {
    name: string;
    email: string;
    password: string;
  }

  const [formData, setFormData] = useState<reqObject>({
    name: "",
    email: "",
    password: "",
  });

  const formObj: formObject[] = [
    { name: "sign-up-name", id: 1 },
    { name: "sign-up-email", id: 2 },
    { name: "sign-up-password", id: 3 },
  ];

  const navigate = useNavigate();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    s: string
  ) => {
    if (s === "sign-up-name") {
      setFormData({ ...formData, name: e.target.value });
    } else if (s === "sign-up-email") {
      setFormData({ ...formData, email: e.target.value });
    } else {
      setFormData({ ...formData, password: e.target.value });
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      console.log({ error: true });
      return;
    }

    try {
      const response = await axios.post(`${ENDPOINT}/input`, formData);
      console.log(response.data);
      navigate("/");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <>
      <form
        className="w-screen h-screen flex justify-center items-center flex-col"
        onSubmit={handleSignup}
      >
        <h1 className="font-medium text-3xl mb-14 text-yellow-50">
          Sign up Page
        </h1>

        {formObj.map((item) => {
          return (
            <div className="mb-7" key={item.id}>
              <div className="border-stone-100 w-32 inline-block">
                <label
                  className="text-white text-tl font-light cursor-pointer relative top-1"
                  htmlFor={item.name}
                >
                  {item.name.split("-")[2].toUpperCase()}
                </label>
              </div>

              <input
                className="outline-none border-b-[1px] border-white bg-transparent text-white tracking-wide font-extralight pb-1 pr-1 pl-1"
                type="text"
                id={item.name}
                onChange={(e) => handleInputChange(e, item.name)}
              />
            </div>
          );
        })}
        <button
          type="submit"
          className="mt-6 bg-transparent text-stone-400 font-normal hover:text-white py-2 px-4 border border-stone-400 hover:border-white rounded transition duration-200"
        >
          Sign up
        </button>
      </form>
    </>
  );
};

export default UserForm;
