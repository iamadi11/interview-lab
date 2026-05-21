import type { Meta, StoryObj } from "@storybook/react";
import { Card } from "@/components/ui/Card";

const meta: Meta<typeof Card> = {
  title: "UI/Card",
  component: Card,
  tags: ["autodocs"],
  decorators: [(Story) => <div className="bg-slate-950 p-6"><Story /></div>],
};
export default meta;
type Story = StoryObj<typeof Card>;

export const Default: Story = {
  args: { children: <p className="text-slate-300">Default card content</p> },
};

export const Glass: Story = {
  args: { glass: true, children: <p className="text-slate-300">Glassmorphism card</p> },
};

export const Hoverable: Story = {
  args: { hoverable: true, children: <p className="text-slate-300">Hover me!</p> },
};
