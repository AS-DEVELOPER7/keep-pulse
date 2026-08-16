// Centralized UI Theme & Design Tokens Configuration
// Controls colors, typography scales, sizes, component variants, and status indicators

export const UI_THEME = {
  colors: {
    primary: {
      light: "bg-indigo-600 hover:bg-indigo-700 text-white focus:ring-indigo-500",
      outline: "border border-indigo-600 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/30",
      subtle: "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800",
    },
    neutral: {
      card: "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm",
      surface: "bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100",
      muted: "text-slate-500 dark:text-slate-400",
      border: "border-slate-200 dark:border-slate-800",
      input: "bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500",
    },
    status: {
      ACTIVE: {
        bg: "bg-emerald-50 dark:bg-emerald-950/40",
        text: "text-emerald-700 dark:text-emerald-300",
        border: "border-emerald-200 dark:border-emerald-800",
        dot: "bg-emerald-500",
        label: "Active",
      },
      PAUSED: {
        bg: "bg-amber-50 dark:bg-amber-950/40",
        text: "text-amber-700 dark:text-amber-300",
        border: "border-amber-200 dark:border-amber-800",
        dot: "bg-amber-500",
        label: "Paused",
      },
      FAILING: {
        bg: "bg-rose-50 dark:bg-rose-950/40",
        text: "text-rose-700 dark:text-rose-300",
        border: "border-rose-200 dark:border-rose-800",
        dot: "bg-rose-500",
        label: "Failing",
      },
      SUCCESS: {
        bg: "bg-emerald-50 dark:bg-emerald-950/40",
        text: "text-emerald-700 dark:text-emerald-300",
        border: "border-emerald-200 dark:border-emerald-800",
        dot: "bg-emerald-500",
        label: "Success",
      },
      FAILED: {
        bg: "bg-rose-50 dark:bg-rose-950/40",
        text: "text-rose-700 dark:text-rose-300",
        border: "border-rose-200 dark:border-rose-800",
        dot: "bg-rose-500",
        label: "Failed",
      },
      WARNING: {
        bg: "bg-amber-50 dark:bg-amber-950/40",
        text: "text-amber-700 dark:text-amber-300",
        border: "border-amber-200 dark:border-amber-800",
        dot: "bg-amber-500",
        label: "Warning",
      },
    },
  },
  sizes: {
    button: {
      sm: "px-3 py-1.5 text-xs font-medium rounded-lg",
      md: "px-4 py-2 text-sm font-medium rounded-xl",
      lg: "px-5 py-2.5 text-base font-medium rounded-xl",
    },
    input: {
      sm: "px-3 py-1.5 text-xs rounded-lg",
      md: "px-3.5 py-2 text-sm rounded-xl",
      lg: "px-4 py-2.5 text-base rounded-xl",
    },
  },
  radii: {
    card: "rounded-2xl",
    button: "rounded-xl",
    badge: "rounded-full",
    input: "rounded-xl",
  },
};
