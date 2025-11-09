import ProfilePic from "@/features/profile/components/ProfilePic";

const AdminTopBar = () => {
  return (
    <div className="flex flex-row items-center justify-between w-full p-4 h-full max-h-15 border-b border-b-neutral-300">
      <span className="text-sm text-neutral-500">Wilcs</span>
      <div className="flex flex-row items-center gap-2">
        <input
          id="search"
          type="text"
          autoFocus
          placeholder="Search"
          className="block w-full rounded-md border border-neutral-300 p-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 bg-background text-foreground caret-foreground"
        />

        <div className="hidden sm:block">
          <ProfilePic />
        </div>
      </div>
    </div>
  );
};

export default AdminTopBar;
