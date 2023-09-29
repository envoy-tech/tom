import type { Meta, StoryObj } from "@storybook/react";
import Btn from "@/components/ui-components/Btn";

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
  title: "Button",
  component: Btn,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/react/configure/story-layout
    layout: "centered",
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
  tags: ["autodocs"],
} satisfies Meta<typeof Btn>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const PrimaryButton: Story = {
  args: {
    buttonType: "primary",
    type: "button",
  },
};

export const SecondaryButton: Story = {
  args: {
    buttonType: "secondary",
    type: "button",
  },
};

export const PrimaryButtonDisabled: Story = {
  args: {
    buttonType: "primary",
    type: "button",
    disabled: true,
  },
};
