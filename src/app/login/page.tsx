function Page() {
  const inputw = "p-2 border border1";
  return (
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
        <button type="submit" className="p-2 bg-orange-500 text-white w-full">
          Login
        </button>
      </form>
    </div>
  );
}

export default Page;
