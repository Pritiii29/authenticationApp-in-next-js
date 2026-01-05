export default async function UserProfile({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1>Profile</h1>
      <hr />
      <p className="text-4xl">Profile Page </p>
      <span className="p-2 ml-2 rounded bg-amber-300 text-black">{id}</span>
    </div>
  );
}
