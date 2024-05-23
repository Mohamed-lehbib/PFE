import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      home Page
      <span className="bg-green-400 text-white hover:bg-white hover:text-green-400 ">
        hello world
      </span>
    </main>
  );
}
