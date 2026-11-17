import { Hero } from "@/components/sections/Hero";
import { Problems } from "@/components/sections/Problems";
import { Services } from "@/components/sections/Services";
import { WhyUs } from "@/components/sections/WhyUs";
import { Process } from "@/components/sections/Process";
import { Testimonials } from "@/components/sections/Testimonials";
import { Pricing } from "@/components/sections/Pricing";
import { Faq } from "@/components/sections/Faq";
import { CtaBand } from "@/components/sections/CtaBand";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Problems />
      <Services />
      <WhyUs />
      <Process />
      <Testimonials />
      <Pricing />
      <Faq />
      <CtaBand />
    </>
  );
}
