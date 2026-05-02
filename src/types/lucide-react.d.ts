declare module "lucide-react" {
  import type { SVGProps, ForwardRefExoticComponent, RefAttributes } from "react";

  export type LucideProps = SVGProps<SVGSVGElement>;
  export type LucideIcon = ForwardRefExoticComponent<
    LucideProps & RefAttributes<SVGSVGElement>
  >;

  export const ArrowLeft: LucideIcon;
  export const ArrowRight: LucideIcon;
  export const Briefcase: LucideIcon;
  export const Calendar: LucideIcon;
  export const Check: LucideIcon;
  export const CheckCircle: LucideIcon;
  export const ChevronDown: LucideIcon;
  export const ChevronLeft: LucideIcon;
  export const ChevronRight: LucideIcon;
  export const ChevronUp: LucideIcon;
  export const Circle: LucideIcon;
  export const Globe: LucideIcon;
  export const Languages: LucideIcon;
  export const LogOut: LucideIcon;
  export const MessageCircle: LucideIcon;
  export const Moon: LucideIcon;
  export const PanelLeft: LucideIcon;
  export const Phone: LucideIcon;
  export const Search: LucideIcon;
  export const Sparkles: LucideIcon;
  export const Star: LucideIcon;
  export const Sun: LucideIcon;
  export const Users: LucideIcon;
  export const X: LucideIcon;
}
