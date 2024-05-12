import { UserButton } from "@clerk/nextjs";

const User = () => {
  return (
    <div className="ml-10 flex flex-col justify-center space-y-9">
      <UserButton></UserButton>
    </div>
  );
};

export default User;
