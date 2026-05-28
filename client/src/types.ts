export interface INavLink {
  name: string;
  href: string;
  isScroll?: boolean;
}

export interface SectionTitleProps {
  text1: string;
  text2: string;
  text3: string;
}

export interface ITestimonial {
  image: string;
  name: string;
  handle: string;
  date: string;
  quote: string;
}

export interface TestimonialCardProps {
  testimonial: ITestimonial;
  index: number;
}

export interface IFeature {
  icon: string;
  title: string;
  description: string;
}

export interface IFooterLink {
  name: string;
  href: string;
}

export interface IFooter {
  title: string;
  links: IFooterLink[];
}

export interface NavbarProps {
  navlinks: INavLink[];
}

export interface IPricing {
  name: string;
  price: number;
  period: string;
  features: string[];
  mostPopular: boolean;
}

export interface PricingCardProps {
  pricing: IPricing;
  index: number;
}

export interface SectionProps {
  title: string;
  description: string;
  buttonText: string;
  buttonHref: string;
}
