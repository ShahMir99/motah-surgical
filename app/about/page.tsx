import React from "react";
import { Counter } from "@/components/site/Counter";
import { Reveal } from "@/components/site/Reveal";

import aboutBanner from "@/assets/about-image.png"

const stats = [
  { value: "50", label: "Years in Business" },
  { value: "65", label: "Countries" },
  { value: "10,000+", label: "Instrument types" },
  { value: "500+", label: "Employees." },
] as const;

const About = () => {
  return (
    <div>
      {/* Hero / Introduction banner */}
      <section className="relative">
        <img
          src="https://placehold.co/1600x520/16303d/16303d?text=+"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-[#173B4C]/70" />

        <div className="relative mx-auto flex max-w-5xl flex-col lg:h-[360px] lg:flex-row">
          <div className="relative flex text-center w-full h-[440px] flex-col justify-center bg-[#02ac75] px-8 py-14 lg:shrink-0 lg:px-16 lg:py-0">
            <p className="mb-5 text-lg font-medium tracking-[0.4em] text-white">
              INTRODUCTION
            </p>
            <h1 className="font-serif text-7xl font-semibold text-white lg:text-7xl">
              Professional
            </h1>
            <p className="mt-6 text-2xl font-light leading-snug text-white lg:text-3xl">
              True Partner, Smart Solutions,
              <br />
              Consistent Performance
            </p>
          </div>
        </div>
      </section>

      {/* Why Professional — stats */}
      <section className="bg-white py-16 lg:pt-40 lg:pb:20">
        <div className="mx-auto max-w-5xl px-6 text-center">
          <Reveal className="max-w-xl">
            <p className="eyebrow text-left">Why Professional</p>
            <h2 className="mt-4 font-display text-left text-3xl font-bold text-ink sm:text-4xl">
              Numbers built over decades
            </h2>
          </Reveal>
          <div className="mt-14 grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
            <Counter value={50} label="Years in business" />
            <Counter value={50} suffix="+" label="Countries served" />
            <Counter value={10000} suffix="+" label="Instrument types" />
            <Counter value={800} suffix="+" label="Employees" />
          </div>
        </div>
      </section>

      {/* Feature image */}
      <section className="mx-auto max-w-5xl px-6 py-12">
        <img
          src={aboutBanner.src}
          alt="Surgeons handing over a surgical instrument"
          className="h-[420px] w-full object-cover"
        />
      </section>

      {/* Letter */}
      <section className="mx-auto max-w-5xl px-6 pb-20">
        <div className="space-y-5 text-sm leading-relaxed text-slate-700">
          <p>Dear Healthcare Professionals,</p>

          <p>
            Welcome to Professional Hospital Furnishers, your destination for
            top-quality surgical instruments and innovative solutions. With over
            50 years of experience in the healthcare industry, we are a trusted
            global leader in manufacturing and supplying high-quality surgical
            equipment.
          </p>

          <p>
            Our success is fueled by our commitment to innovation and staying at
            the forefront of emerging healthcare trends. By investing in
            cutting-edge technology and fostering a culture of innovation, we
            deliver state-of-the-art products that meet your evolving needs.
          </p>

          <p>
            We value professionalism and your satisfaction is our priority. We
            understand your unique requirements and provide tailored solutions
            that exceed expectations. Our dedicated team of professionals is
            trained to provide exceptional service and support, ensuring a
            seamless experience.
            <br />
            Efficiency is at the core of our operations. Through streamlined
            workflows and best practices, we deliver high-quality products on
            time, precisely meeting your demands.
          </p>

          <p>
            Our unwavering commitment to sustainability drives us to minimize
            our environmental impact through responsible manufacturing practices
            and eco-friendly initiatives. Together, we can contribute to a
            greener and healthier planet.
          </p>

          <p>
            At Professional Hospital Furnishers, we take pride in our legacy of
            excellence, innovation, and customer-centricity. Partner with us to
            enhance patient care and outcomes with our finest surgical
            instruments.
          </p>

          <p>
            Thank you for choosing Professional Hospital Furnishers. Let&apos;s
            revolutionize healthcare and shape the future of medicine together.
          </p>

          <p>Sincerely,</p>
        </div>

        <div className="mt-8 flex flex-col gap-8 sm:flex-row sm:gap-24">
          <div>
            <p className="font-bold text-slate-900">Waseem Abbas</p>
            <p className="italic text-slate-600">Managing Director</p>
          </div>
          <div>
            <p className="font-bold text-slate-900">Aqeel Abbas</p>
            <p className="italic text-slate-600">Marketing Director</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
