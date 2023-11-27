import SideUserNav from "@/components/pages/user/ui/SideNav";

function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { id: string };
}) {
  return (
    <div className="flex h-full sm:flex-row flex-col w-full bg-user bg-cover">
      <SideUserNav
        className="sm:w-72 sm:flex-col flex-row bg-[#F5F5F580]"
        userId={params.id}
      />
      <div className="p-4 h-full max-h-[80vh] sm:max-h-[94vh] overflow-y-auto w-full">
        {children}
      </div>
    </div>
  );
}

export default Layout;
