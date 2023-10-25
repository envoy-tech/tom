import { MouseEventHandler } from "react";
import "./button.css";
import Btn from "@/components/ui-components/Btn";

interface BtnProps {
  onClickHandler?: MouseEventHandler<HTMLElement>;
  href?: string;
  buttonType: string;
  type: "button" | "submit" | "reset" | undefined;
  disabled?: boolean;
}

/**
 * Primary UI component for user interaction
 */
export const Button = (props: BtnProps) => {
  return <Btn {...props}>Click me!</Btn>;
};
