import SectionTitle from "../components/SectionTitle";
import TestimonialCard from "../components/TestimonialCard";
import { testimonialsData } from "../data/testimonial";
import type { ITestimonial } from "../types";
import Marquee from "react-fast-marquee";

export default function TestimonialSection() {
  return (
    <div id="testimonials" className="px-4 md:px-16 lg:px-24 xl:px-32">
      <SectionTitle
        text1="Testimonials"
        text2="Loved by creators"
        text3="See how our AI thumbnails are helping channels explode their views."
      />

      <Marquee
        className="mx-auto mt-11 max-w-5xl"
        gradient={true}
        speed={25}
        gradientColor="#000"
      >
        <div className="flex items-center justify-center overflow-hidden py-5">
          {[...(testimonialsData || []), ...(testimonialsData || [])].map(
            (testimonial: ITestimonial, index: number) => (
              <TestimonialCard
                key={`${testimonial.name}-${index}`}
                index={index}
                testimonial={testimonial}
              />
            ),
          )}
        </div>
      </Marquee>

      <Marquee
        className="mx-auto max-w-5xl"
        gradient={true}
        speed={25}
        direction="right"
        gradientColor="#000"
      >
        <div className="flex items-center justify-center overflow-hidden py-5">
          {[...(testimonialsData || []), ...(testimonialsData || [])].map(
            (testimonial: ITestimonial, index: number) => (
              <TestimonialCard
                key={`${testimonial.name}-${index}-2`}
                index={index}
                testimonial={testimonial}
              />
            ),
          )}
        </div>
      </Marquee>
    </div>
  );
}
