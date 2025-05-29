import {Appbar} from "@/components/Appbar";
import BaseCard from "@/components/BaseCard";
import Markets from "@/components/Markets";

export default function Home() {
  return (
    <div className="flex flex-col bg-base-background-dark gap-4">
      <div className="h-full w-full flex justify-center">
          <Markets></Markets>
      </div>
      <BaseCard></BaseCard>
    </div>
  );
}
