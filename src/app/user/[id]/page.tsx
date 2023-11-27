function Page({ params }: { params: { id: string } }) {
  return <>Profile | User {params.id}</>;
}

export default Page;
