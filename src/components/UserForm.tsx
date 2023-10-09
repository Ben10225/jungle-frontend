import axios from "axios";
import { useState, useRef } from "react";
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

  interface resObject {
    OK: boolean;
  }

  interface errorResObject {
    response: {
      data: {
        OK: boolean;
        message: string;
      };
    };
  }

  const [stopSubmitBtn, setStopSubmitBtn] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  const [alertText, setAlertText] = useState({
    content: "",
    className: "text-rose-400 font-normal h-8 mt-5",
  });

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
      handleErrorAlert("請輸入註冊資訊");
      return;
    }

    try {
      const response = await axios.post<resObject>(
        `${ENDPOINT}/user`,
        formData
      );
      if (response.data.OK) {
        setAlertText({
          className: "text-green-400 font-normal h-8 mt-5",
          content: "註冊成功 頁面將自行轉跳",
        });
        formRef.current?.reset();
        setStopSubmitBtn(true);
        if (btnRef.current) {
          btnRef.current.className =
            "mt-6 bg-transparent text-stone-400 font-normal py-2 px-4 border border-stone-400 rounded transition duration-200";
        }
        setTimeout(() => {
          navigate("/");
        }, 1500);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as errorResObject;
        handleErrorAlert(axiosError.response?.data?.message);
      }
    }
  };

  const handleErrorAlert = (text: string) => {
    setAlertText({
      ...alertText,
      content: text,
    });
    setStopSubmitBtn(true);
    setTimeout(() => {
      setAlertText({
        ...alertText,
        content: "",
      });
      setStopSubmitBtn(false);
    }, 2000);
  };

  return (
    <>
      <form
        ref={formRef}
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
        <h3 className={alertText.className}>{alertText.content}</h3>
        <button
          type="submit"
          className="mt-6 bg-transparent text-stone-400 font-normal hover:text-white py-2 px-4 border border-stone-400 hover:border-white rounded transition duration-200"
          disabled={stopSubmitBtn}
          ref={btnRef}
        >
          Sign up
        </button>
      </form>
    </>
  );
};

export default UserForm;
