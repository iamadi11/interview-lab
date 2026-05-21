import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "@/components/ui/Button";

const meta: Meta<typeof Button> = {
  title: "UI/Button",
  component: Button,
  tags: ["autodocs"],
  argTypes: {
    variant: { control: "select", options: ["primary", "secondary", "ghost", "danger", "outline"] },
    size: { control: "select", options: ["sm", "md", "lg"] },
    loading: { control: "boolean" },
    disabled: { control: "boolean" },
  },
};
export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = { args: { children: "Primary", variant: "primary" } };
export const Secondary: Story = { args: { children: "Secondary", variant: "secondary" } };
export const Ghost: Story = { args: { children: "Ghost", variant: "ghost" } };
export const Danger: Story = { args: { children: "Danger", variant: "danger" } };
export const Loading: Story = { args: { children: "Loading", loading: true } };
export const Disabled: Story = { args: { children: "Disabled", disabled: true } };

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3 p-4 bg-slate-950">
      {(["primary", "secondary", "ghost", "danger", "outline"] as const).map((v) => (
        <Button key={v} variant={v}>{v}</Button>
      ))}
    </div>
  ),
};
