import React from "react";
import { Counter } from "@/components/site/Counter";
import { Reveal } from "@/components/site/Reveal";

import aboutBanner from "@/assets/about-image.png";

const stats = [
  { value: "50", label: "Years in Business" },
  { value: "65", label: "Countries" },
  { value: "10,000+", label: "Instrument types" },
  { value: "500+", label: "Employees." },
] as const;

const About = () => {
  return (
    <div>
      <section className="relative">
        <img
          src="https://placehold.co/1600x520/16303d/16303d?text=+"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-primary-dark" />

        <div className="relative mx-auto flex max-w-5xl flex-col lg:h-[360px] lg:flex-row">
          <div className="relative flex text-center w-full h-[440px] flex-col justify-center bg-[#02ac75] px-8 py-14 lg:shrink-0 lg:px-16 lg:py-0">
            <p className="mb-5 text-lg font-medium tracking-[0.4em] text-white">
              INTRODUCTION
            </p>
            <h1 className="font-serif text-7xl font-semibold text-white lg:text-7xl">
              Motah Surgical
            </h1>
            <p className="mt-6 text-2xl font-light leading-snug text-white lg:text-3xl">
              Built for Precision. Driven by Purpose.
              <br />
              Secured for KSA.
            </p>
          </div>
        </div>
      </section>

      {/* Feature image */}
      <section className="mx-auto max-w-5xl px-6 py-12 lg:pt-40 lg:pb:20">
        <img
          src={aboutBanner.src}
          alt="Surgeons handing over a surgical instrument"
          className="h-[420px] w-full object-cover"
        />
      </section>

      {/* Letter */}
      <section className="mx-auto max-w-5xl px-6 pb-20">
        <div className="space-y-5 text-sm leading-relaxed text-slate-700">
          <p>To Our Partners in Healthcare,</p>

          <p>
            Welcome to Motah Surgical—where quality manufacturing meets
            dependable surgical performance. Built in alignment with Saudi
            Vision 2030, we produce high-precision surgical instruments designed
            to support surgeons, improve patient care, and secure complete
            supply independence directly within the Kingdom.
          </p>

          <p>
            Our approach is simple: continuous innovation and strict quality
            control. By carrying out specialized processing, rigorous material
            testing, and full SFDA compliance inside Saudi Arabia, we eliminate
            reliance on foreign supply chains—delivering lifetime-guaranteed
            instruments directly to healthcare institutions when they need them
            most.We focus on precision because we know what hospitals and
            surgical teams require. Every instrument we produce—including
            specialized microsurgery tools—is designed for superior grip, ideal
            balance, and reliable accuracy in the operating room.
          </p>

          <p>
            Efficiency and reliability drive our operations. Through localized
            processing and streamlined distribution, we ensure hospitals,
            medical centers, and healthcare systems maintain uninterrupted
            access to world-class instruments without supply delays.
            <br />
            Building national supply security also drives our growth across
            regional and global markets. As we strengthen Saudi Arabia&#39;s
            healthcare infrastructure, Motah Surgical presents Made-in-KSA
            quality on the international stage, showing what modern healthcare
            systems can expect from a trusted supply partner.
          </p>

          <p>
            At Motah Surgical, we offer more than medical tools; we provide
            reliable supply partnerships for modern healthcare systems. Partner
            with us to strengthen your supply chain, elevate surgical standards,
            and support the future of sovereign healthcare.
          </p>

          <p>
            Thank you for choosing Motah Surgical. Let’s build a stronger, more
            reliable healthcare supply chain together.
          </p>

          <p>Sincerely,</p>
        </div>

        <div className="mt-8 flex flex-col gap-8 sm:flex-row sm:gap-24">
          <div>
            {/* <p className="font-bold text-slate-900">Waseem Abbas</p> */}
            <p className="italic text-slate-600">Managing Director</p>
          </div>
          <div>
            {/* <p className="font-bold text-slate-900">Aqeel Abbas</p> */}
            <p className="italic text-slate-600">Marketing Director</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
