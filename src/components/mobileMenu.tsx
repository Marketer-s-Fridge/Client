import { useRouter, usePathname } from "next/navigation";
import { Dispatch, SetStateAction } from "react";
import { useAuthStatus } from "@/features/auth/hooks/useAuthStatus";

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
  const pathname = usePathname();
  const { isAuthenticated, user } = useAuthStatus();
  const isAdmin = isAuthenticated && user?.id === "mf-admin";

  const handleClick = (path: string) => {
    router.push(path);
    setMenuOpen(false);
  };

  return (
    <div
      className={`fixed inset-0 z-50 transition-all duration-300 ${
        menuOpen
          ? "bg-black/40 backdrop-blur-[2px]"
          : "bg-transparent pointer-events-none"
      }`}
      onClick={() => setMenuOpen(false)}
    >
      <aside
        className={`
          fixed top-0 right-0 h-full w-[260px] max-w-[80%]
          bg-white
          transition-transform duration-300 ease-out
          flex flex-col
          ${menuOpen ? "translate-x-0" : "translate-x-full"}
          ${menuOpen ? "shadow-2xl border-l border-gray-100" : "shadow-none border-l border-transparent"}
        `}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 상단 헤더 */}
        <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-gray-100">
          <div className="flex flex-col">
            <span className="text-xs font-medium text-gray-400 tracking-wide">
              MENU
            </span>
            <span className="text-sm font-semibold text-gray-900">
              Marketer&apos;s Fridge
            </span>
          </div>
          <button
            className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 text-gray-500 text-sm hover:bg-gray-50 transition-colors"
            onClick={() => setMenuOpen(false)}
          >
            ✕
          </button>
        </div>

        {/* 유저 상태 영역 */}
        <div className="px-5 py-3 border-b border-gray-100">
          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-full bg-red-100 flex items-center justify-center text-[11px] font-semibold text-red-500">
                {user?.id?.[0]?.toUpperCase() ?? "U"}
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-gray-800">
                  {user?.id}
                </span>
                <span className="text-[11px] text-gray-400">로그인 상태</span>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-1">
              <span className="text-xs font-semibold text-gray-800">
                아직 로그인하지 않았어요
              </span>
              <button
                onClick={() => handleClick("/login")}
                className="mt-1 inline-flex items-center justify-center rounded-full border border-gray-300 px-3 py-1 text-[11px] font-medium text-gray-700 hover:bg-gray-50"
              >
                Log In / Sign Up
              </button>
            </div>
          )}
        </div>

        {/* 메뉴 리스트 */}
        <ul className="flex-1 overflow-y-auto px-3 py-4 space-y-2 text-sm font-semibold">
          {baseMenuItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <li key={item.label}>
                <button
                  onClick={() => handleClick(item.path)}
                  className={`
                    group w-full flex items-center gap-3 px-3 py-2 rounded-2xl text-left
                    transition-colors duration-150
                    ${
                      isActive
                        ? "bg-red-50 text-red-500"
                        : "text-gray-700 hover:bg-gray-50"
                    }
                  `}
                >
                  <span
                    className={`
                      h-6 w-0.5 rounded-full mr-1
                      ${
                        isActive
                          ? "bg-red-400"
                          : "bg-transparent group-hover:bg-gray-300"
                      }
                    `}
                  />
                  <span className="text-xs">{item.label}</span>
                </button>
              </li>
            );
          })}

          {isAdmin && (
            <li>
              <button
                onClick={() => handleClick("/admin")}
                className="group w-full flex items-center gap-3 px-3 py-2 rounded-2xl text-left bg-red-500 text-white hover:bg-red-600 transition-colors duration-150"
              >
                <span className="h-6 w-0.5 rounded-full mr-1 bg-white/70" />
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center justify-center rounded-full bg-white/15 px-2 py-[2px] text-[10px] font-semibold">
                    ADMIN
                  </span>
                  <span className="text-xs">관리자 대시보드</span>
                </div>
              </button>
            </li>
          )}
        </ul>

        {/* 하단 작은 카피 */}
        <div className="px-5 pb-4 pt-2 border-t border-gray-100">
          <span className="text-[10px] text-gray-400">
            © {new Date().getFullYear()} Marketer&apos;s Fridge
          </span>
        </div>
      </aside>
    </div>
  );
};

export default MobileMenu;
