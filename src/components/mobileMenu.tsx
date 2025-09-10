import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction } from "react";

interface MobileMenuProps {
  menuOpen: boolean;
  setMenuOpen: Dispatch<SetStateAction<boolean>>;
}

const menuItems = [
  { label: "Home", path: "/" },
  { label: "About Us", path: "/service" },
  { label: "Category", path: "/category" },
  { label: "Contact Us", path: "/contact" },
  { label: "My Page", path: "/myPage" },
  { label: "Log In | Sign Up", path: "/login" },
];
export const MobileMenu = ({ menuOpen, setMenuOpen }: MobileMenuProps) => {
  const router = useRouter();

  return (
    <div
      className={`fixed inset-0 z-50 transition-all duration-300 ${
        menuOpen ? "bg-black/40" : "bg-transparent pointer-events-none"
      }`}
      onClick={() => setMenuOpen(false)} // ✅ 오버레이 클릭 시 닫기
    >
      <aside
        className={`fixed top-0 right-0 h-full w-64 bg-white p-6 shadow-md transition-transform duration-300 ease-in-out ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
        onClick={(e) => e.stopPropagation()} // ✅ aside 클릭은 전파 막기
      >
        <button
          className="text-right block ml-auto mb-4"
          onClick={() => setMenuOpen(false)}
        >
          ✕
        </button>
        <ul className="space-y-10 text-sm font-bold">
          {menuItems.map((item) => (
            <li
              key={item.label}
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => {
                router.push(item.path);
                setMenuOpen(false);
              }}
            >
              {item.label}
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
};

export default MobileMenu;
