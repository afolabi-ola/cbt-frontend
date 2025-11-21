"use client";

import { SpinnerMini } from "@/components/ui";
import { useGetQuestionsInBank } from "@/features/dashboard/queries/useDashboard";
import { errorLogger } from "@/lib/axios";
import { useParams } from "next/navigation";

const Questions = () => {
  const { id } = useParams();
  const { data, isLoading, error } = useGetQuestionsInBank(`${id}`);

  if (error) {
    errorLogger(error);
  }

  return (
    <section className="flex flex-col gap-4 w-full">
      <h1 className="text-2xl font-semibold">Questions</h1>

      {isLoading ? <SpinnerMini color="#0c4a6e" /> : "Fetched"}
    </section>
  );
};

export default Questions;
