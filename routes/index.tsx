import { Head } from "fresh/runtime";
import { define } from "../utils.ts";
import Counter from "@/islands/Counter.tsx";
import { useSignal } from "@preact/signals";

export default define.page(function Home() {
  const count = useSignal(0);
  return (
    <div class="px-4 py-8 mx-auto fresh-gradient min-h-screen">
      <Head>
        <title>Webgl, hmr sucks</title>
      </Head>
      <div class="hidden">
        <Counter count={count} />
      </div>
      <div class="max-w-3xl mx-auto flex flex-col items-center justify-center">
        <canvas class="size-125 border" />
        ok, whatever I'll do it that way
      </div>
    </div>
  );
});
