
import Score from "./score"
import NameProps from "./name";
import UserButton from "./user-button";

function Navbar() {
  return (
    <div className="border-b w-full">
      <div className="h-20 flex items-center justify-around px-4 w-full">
        <NameProps />
        <div className="flex-1 flex justify-center">
          <Score />
        </div>
        <UserButton />
      </div>
    </div>
  );
}

export default Navbar