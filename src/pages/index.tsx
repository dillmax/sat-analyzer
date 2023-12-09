import { useState, useRef, useEffect } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import { QueryClient, QueryClientProvider } from 'react-query';
import MessageBox from "../components/message_box";
import WindowBar from "../components/menu";
import PwrChart from "../components/pwr_chart";

const queryClient = new QueryClient()

export default function Home() {
  const [isDropped, setIsDropped] = useState(true);

  async function hanndleSetup() {
    await invoke("make_window", {});
  }

  return (
    <QueryClientProvider client={queryClient}>
    <main className="flex flex-col justify-between w-screen h-screen min-h-screen gap-0 overflow-hidden bg-black">
      <WindowBar />
      <MessageBox isDropped={isDropped} />
      <PwrChart />
    </main>
    </QueryClientProvider>
  );
}
