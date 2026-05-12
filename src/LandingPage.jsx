import React from "react";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();
  return (
    <div>
      {/* header */}
      <div class="flex items-center justify-between w-full p-4 bg-[#fdfdfe] mt-4">
        <div class="flex items-center gap-4">
          <img
            src="/mercova.png"
            alt="Logo"
            width={30}
            class="rounded-[2rem]"
          />
          <h1 class="text-[#003ec7] font-bold text-2xl">Mercova</h1>
        </div>
        <div class="flex gap-4">
          <button onClick={() => navigate("/login")} class="bg-[#ffc32a] py-2 px-5 rounded-xl">Log in</button>
          <button
            onClick={() => navigate("/getstarted")}
            class="bg-[#003ec7] text-white py-3 px-5 rounded-xl"
          >
            Get Started
          </button>
        </div>
      </div>

      <div class="bg-[#f8f9fa] w-full  p-20 flex flex-col items-start justify-center text-left">
        <h2 class="text-[#6f5100] bg-[#ffc31a] rounded-[0.25rem] px-3 py-1 font-medium">
          The Creator Economy Authority
        </h2>

        <h1 class="text-5xl font-bold mt-4">Monetize Your Skills</h1>
        <h1 class="text-5xl font-bold text-[#003ec7] mb-4">Without Limits.</h1>

        <p class="max-w-2xl text-gray-600 text-lg leading-relaxed">
          Mercova provides the infrastructure for high-energy creators to build,
          scale and automate their digital empire with professional-grade tools.
        </p>

        <div class="flex flex-row gap-4 mt-6">
          <button onClick={() => navigate("/getstarted")} class="bg-[#003ec7] text-white py-3 px-6 rounded-xl font-semibold">
            Start Selling Now
          </button>
          {/* <button class="bg-[#e2e3e4] text-black py-3 px-6 rounded-xl font-semibold">
            Explore Marketplace
          </button> */}
        </div>
      </div>

      <div class="bg-[#f0f3ff] py-10 px-20">
        <h2 class="text-[#745d04] font-bold text-l">THE ECOSYSYTEM</h2>
        <h1 class="text-3xl font-bolder mt-4">
          Elevate your Professional Reach
        </h1>
        <div class="flex flex-row  gap-6 p-3 ">
          
          <div class="bg-white p-8 rounded-xl">
            <img
              src="/digitalproducts.png"
              alt=""
              width={60}
              class=" bg-[#8aceff]  p-4 mb-5 rounded-[0.85rem]"
            />
            <h1 class="text-2xl font-bolder">Sell Digital Products</h1>
            <h1>
              Turn your knowledge into <br />
              revenue. Host Courses, sell <br /> ebooks and distribute assets in
              a <br />
              high fidelity-store environment
            </h1>
          </div>
          <div class="bg-white p-8 rounded-xl">
            <img
              src="/livemeeting.png"
              alt=""
              width={60}
              class=" bg-[#8aceff]  p-4 mb-5 rounded-[0.85rem]"
            />
            <h1 class="text-2xl font-bolder">Host Webinars</h1>
            <h1>
              Build community in real-time.
              <br />
              Professional grade streaming <br />
              tools integrated directly into your <br />
              creator dashboard
            </h1>
          </div>
          <div class="bg-white p-7 rounded-xl">
            <img
              src="/onlinecourses.png"
              alt=""
              width={60}
              class=" bg-[#8aceff] mt-1 p-2 mb-5 rounded-[0.85rem]"
            />
            <h1 class="text-2xl font-bolder">Online courses</h1>
            <h1>
              Build structured learning paths
              <br />
              with tiered access controls. <br />
              Teach your students online <br />
              and offer certificates.
            </h1>
          </div>
        </div>
      </div>

      <div class="bg-[#d8e3fb] flex flex-col gap-4 justify-center items-center p-7">
        <img class="text-[#745c01]" src="/apostt.png" width={50} />
        <h1 class="text-[#111c2d]">
          "Mercova completely changed how I look at my <br />
          business. I stoppeed fighting with complex plugins <br />
          and started ocuing on my students.My revenue tripled <br /> in six
          months"
        </h1>
        <img src="/mypic.jpeg" alt="" width={70} class="rounded-[0.6rem]" />
        <h1>
          Funmilayo Adeniji <br />
          Marketing Strategist
        </h1>
      </div>

      <div class="bg-[#1a54d5] mx-6 my-22 rounded-[1rem] flex flex-col items-center text-center py-10 gap-8">
        <h1 class="text-[#ffffff] text-6xl font-bold">
          Ready to curate your future?
        </h1>
        <h2 class="text-[#d1dfe9] text-xl font-bolder">
          Join 25,000+ creators who have built their own premium <br />
          digital empires on Mercova.
        </h2>
        <button class="bg-[#fed65b] text-[#745c01] p-3 rounded-[0.75rem] mt-1">
          Join Mercova Today
        </button>
      </div>

      {/* footer */}
      <div class="bg-[#f1f5f9] p-10 ">
        <div class="flex flex-row items-center justify-between">
          <h1 class="text-xl font-bold text-[#0369a1]">Mercova</h1>
          <div class="flex flex-row gap-5 items-end justify-end text-[#a3adbc]">
            <h1 class="cursor-pointer transition-colors duration-200 hover:text-[#0369a1]">
              Explore
            </h1>
            <h1 class="cursor-pointer transition-colors duration-200 hover:text-[#0369a1]">
              Sell
            </h1>
            <h1 class="cursor-pointer transition-colors duration-200 hover:text-[#0369a1]">
              Learn
            </h1>
            <h1 class="cursor-pointer transition-colors duration-200 hover:text-[#0369a1]">
              Privacy
            </h1>
          </div>
        </div>

        <h1 class="text-[#64748b] mt-2">
          © 2026 Mercova. Built for the Digital Curator.
        </h1>
      </div>
    </div>
  );
};

export default LandingPage;
