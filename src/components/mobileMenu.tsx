import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction } from "react";
import { useAuthStatus } from "@/features/auth/hooks/useAuthStatus"; // 🔥 추가

interface MobileMenuProps {
  menuOpen: boolean;
  setMenuOpen: Dispatch<SetStateAction<boolean>>;
}

const baseMenuItems = [
  { label: "Home", path: "/" },
  { label: "About Us", path: "/service" },
  { label: "Category", path: "/category" },
  { label: "Contact Us", path: "/contact" },
  { label: "My Page", path: "/myPage" },
  { label: "Log In | Sign Up", path: "/login" },
];

export const MobileMenu = ({ menuOpen, setMenuOpen }: MobileMenuProps) => {
  const router = useRouter();

  // 🔥 로그인 + 유저 정보 가져오기
  const { isAuthenticated, user, isLoading } = useAuthStatus();

  // 🔥 관리자 여부 (mf-admin인지)
  const isAdmin = isAuthenticated && user?.id === "mf-admin";

  return (
    <div
      className={`fixed inset-0 z-50 transition-all duration-300 ${
        menuOpen ? "bg-black/40" : "bg-transparent pointer-events-none"
      }`}
      onClick={() => setMenuOpen(false)}
    >
      <aside
        className={`fixed top-0 right-0 h-full w-64 bg-white p-6 shadow-md transition-transform duration-300 ease-in-out ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="text-right block ml-auto mb-4"
          onClick={() => setMenuOpen(false)}
        >
          ✕
        </button>

        <ul className="space-y-10 text-sm font-bold">
          {baseMenuItems.map((item) => (
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

          {/* 🔥 관리자 전용 메뉴 */}
          {isAdmin && (
            <li
              className="flex items-center gap-3 cursor-pointer text-red-500"
              onClick={() => {
                router.push("/admin");
                setMenuOpen(false);
              }}
            >
              Admin
            </li>
          )}
        </ul>
      </aside>
    </div>
  );
};

export default MobileMenu;
