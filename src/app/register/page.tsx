import Link from "next/link";

const inputw = "p-2 border border1";

function Page() {
  return (
    <>
      <div className="flex flex-col items-center">
        <form className="p-4 flex flex-col items-center gap-2">
          <input
            className={inputw}
            type="email"
            required
            placeholder="example@email.com"
          />
          <input
            className={inputw}
            type="password"
            required
            placeholder="*********"
          />
          <button type="submit" className="p-2 bg-blue-500 text-white w-full">
            Register
          </button>
        </form>
        <Link className="p-2 bg-green-500 text-white" href={"/login"}>
          Login with an existing account
        </Link>
      </div>
    </>
  );
}

export default Page;
