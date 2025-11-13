"use client";

import React, { ReactNode } from "react";
import { GoPlus } from "react-icons/go";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/input";
import { FaUser } from "react-icons/fa6";
// import { HiUserGroup } from "react-icons/hi";
// import { LuBuilding2 } from "react-icons/lu";
import AppTable, { TableDataItem } from "@/components/table";
import { useRouter } from "next/navigation";
import {
  useGetClasses,
  useGetTeachers,
} from "@/features/dashboard/queries/useDashboard";
import { errorLogger } from "@/lib/axios";
import { formatDate } from "../../../../../utils/helpers";

const headerColumns = [
  "Class Name",
  "Teacher's Name",
  "Total Courses",
  "Created On",
];

const AdminClasses = () => {
  const {
    data: allClasses,
    isLoading: classesLoading,
    error: classesError,
  } = useGetClasses();

  const {
    data: allTeachers,
    isLoading: teachersLoading,
    error: teachersError,
  } = useGetTeachers();
  const { push } = useRouter();

  const quickStats: { icon: ReactNode; label: string; count: number }[] = [
    {
      icon: <FaUser color="#0284c7" />,
      label: "Total Classes",
      count: allClasses ? allClasses?.length : 0,
    },
    // {
    //   icon: <HiUserGroup color="#0284c7" />,
    //   label: "Total Students",
    //   count: "1,344",
    // },
  ];

  if (classesError) {
    errorLogger(classesError);
  }
  if (teachersError) {
    errorLogger(teachersError);
  }

  return (
    <section className="flex flex-col gap-4 w-full">
      <h1 className="text-2xl font-semibold">Manage Classes</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 w-full gap-4">
        <div className="col-span-1 lg:col-span-2 flex flex-col gap-3 bg-background rounded-xl w-full p-3">
          <div className="flex flex-col md:flex-row flex-wrap items-stretch gap-3 min-h-8 w-full">
            <div className="flex-1">
              <Input />
            </div>

            <div>
              <Button disabled={classesLoading || teachersLoading}>
                <div className="flex flex-row items-center gap-2 w-full">
                  <GoPlus />
                  <span>Create New Class</span>
                </div>
              </Button>
            </div>
          </div>

          <AppTable
            data={allClasses ?? []}
            isLoading={classesLoading}
            headerColumns={headerColumns}
            itemKey={({ itemIndex }) => `${itemIndex}`}
            onRowPress={({ item }) => push(`/admin/classes/${item.id}`)}
            renderItem={({ item }) => (
              <>
                <TableDataItem>{item.className}</TableDataItem>
                <TableDataItem>
                  {item.teacher.firstname + " " + item.teacher.lastname}
                </TableDataItem>
                <TableDataItem>{item.courses.length}</TableDataItem>
                <TableDataItem>{formatDate(item.createdAt)}</TableDataItem>
              </>
            )}
          />
        </div>

        <div className="col-span-1 flex flex-col gap-3 bg-background rounded-xl w-full p-3">
          <div className="py-2 border-b border-b-neutral-500">
            <span>Quick Stats</span>
          </div>

          <div className="flex flex-col gap-4 w-full">
            {quickStats.map((stat) => (
              <div key={stat.label} className="flex flex-col gap-1 w-full">
                <div className="flex flex-row items-center gap-2">
                  <>{stat.icon}</>
                  <span className="text-sm text-neutral-600">{stat.label}</span>
                </div>
                <span className="text-base font-medium">{stat.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdminClasses;
