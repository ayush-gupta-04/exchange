import {Appbar} from "@/components/Appbar";
import BaseCard from "@/components/BaseCard";
import Markets from "@/components/Markets";

export default function Home() {
  return (
    <div className="flex flex-col bg-base-background-dark gap-4">
      <Appbar></Appbar>
      <div className="min-h-screen w-full flex justify-center">
          <Markets></Markets>
      </div>
      <BaseCard></BaseCard>
    </div>
  );
}
