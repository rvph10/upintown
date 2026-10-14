/** Shared by Button and Badge so a badge lines up with the button of the same size.
 *  --h: control height, --dot: icon circle. `start` and `end` pad the text side when an icon sits on the other. */
export const controlSizes = {
  sm: { root: "[--h:2.75rem] [--dot:2.125rem] text-ui", padding: "px-5", start: "pl-5", end: "pr-5", icon: "size-3.5" },
  md: { root: "[--h:3rem] [--dot:2.25rem] text-base", padding: "px-7", start: "pl-7", end: "pr-7", icon: "size-4" },
  lg: {
    root: "[--h:3.5rem] [--dot:2.75rem] text-ui-lg",
    padding: "px-8",
    start: "pl-8",
    end: "pr-8",
    icon: "size-4.5",
  },
} as const;

export type ControlSize = keyof typeof controlSizes;
