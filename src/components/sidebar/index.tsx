import React, { ReactNode, useState } from "react";
import { AiFillHome } from "react-icons/ai";
import { GiGraduateCap } from "react-icons/gi";
import { IoIosSettings } from "react-icons/io";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Button from "../ui/Button";
import { useMutation } from "@tanstack/react-query";
import { authService } from "@/services/authService";
import toast from "react-hot-toast";
import SpinnerMini from "../ui/SpinnerMini";

const adminRoutes: { path: string; label: string; icon: ReactNode }[] = [
  {
    path: "/admin/dashboard",
    label: "Dashboard",
    icon: <AiFillHome size={20} />,
  },
  {
    path: "/admin/classes",
    label: "Classes",
    icon: <GiGraduateCap size={20} />,
  },
  {
    path: "/admin/settings",
    label: "System Settings",
    icon: <IoIosSettings size={20} />,
  },
];

const AdminSidebar = () => {
  const [isPrefetched, setIsPrefetched] = useState<boolean>(false);
  const pathname = usePathname();
  const { replace } = useRouter();

  const { mutate, isPending: isLoggingOut } = useMutation({
    mutationFn: authService.logout,
    onMutate: () => {
      replace("/");
      // todo: clear cookies from storage
    },

    onSuccess: () => {
      toast.success("Logout Successful");
    },

    onError: (err) => {
      toast.error(err.message);
    },
  });

  return (
    <nav className="flex flex-col gap-12 w-full justify-between bg-primary-700 h-full p-4">
      <div className="flex flex-col gap-12 w-full">
        <h1 className="text-4xl text-white font-bold">Florintech</h1>

        <ul className="flex flex-col gap-4 w-full">
          {adminRoutes.map((route) => {
            const isActive = route.path === pathname;

            return (
              <li key={route.path}>
                <Link
                  href={route.path}
                  prefetch={isPrefetched ? null : false}
                  onMouseEnter={() => setIsPrefetched(true)}
                  className={`flex flex-row items-center gap-4 text-base  font-normal ${
                    isActive ? "text-white" : "text-neutral-300"
                  }`}
                >
                  <>{route.icon}</>
                  {route.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      <Button onClick={mutate} disabled={isLoggingOut}>
        {isLoggingOut ? (
          <>
            <span className=" mr-2">Logging Out</span>
            <SpinnerMini />
          </>
        ) : (
          "Logout"
        )}
      </Button>
    </nav>
  );
};

export default AdminSidebar;
