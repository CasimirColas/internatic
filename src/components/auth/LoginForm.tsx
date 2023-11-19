"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { signOut } from "next-auth/react";

function LoginForm() {
  const [loginData, setloginData] = useState({ email: "", password: "" });
  const [errorMessage, seterrorMessage] = useState("");
  const inputw = "p-2 border border1";
  return (
    <div className="p-4 flex flex-col items-center gap-2">
      <input
        className={inputw}
        type="email"
        required
        placeholder="example@email.com"
        value={loginData.email}
        onChange={(e) => setloginData({ ...loginData, email: e.target.value })}
      />
      <input
        className={inputw}
        type="password"
        required
        placeholder="*********"
        value={loginData.password}
        onChange={(e) =>
          setloginData({ ...loginData, password: e.target.value })
        }
      />
      <button
        className="p-2 bg-orange-500 text-white w-full"
        onClick={async (e) => {
          e.preventDefault();

          const req = await signIn("credentials", {
            ...loginData,
            redirect: false,
          });
          if (req?.error) {
            seterrorMessage(req.error);
          }
          if (req?.ok) {
            seterrorMessage("");
            console.log(req);
          }
        }}
      >
        Login
      </button>
      <button
        onClick={(e) => {
          e.preventDefault();
          signOut();
        }}
        className="border border-solid w-full border-blue-500 p-2"
      >
        Sign out
      </button>
      {errorMessage !== "" ? (
        <p className="p-2 bg-red-300 text-red-700 w-full text-center">
          {errorMessage}
        </p>
      ) : null}
    </div>
  );
}

export default LoginForm;
