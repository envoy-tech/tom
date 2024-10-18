import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        "advus-navyblue": {
          500: "#214D63",
          300: "#214D6340",
        },
        "advus-lightblue": {
          500: "#1A9FD3",
          300: "#1A9FD34d",
          100: "#1A9FD314",
        },
        "advus-brown": {
          500: "#8D4E31",
        },
        "advus-gray": {
          500: "#707070",
          300: "#E1E1E1",
        },
        "advus-red": {
          500: "#E00101",
        },
      },

      zIndex: {
        "-1": "-1",
      },
      fontSize: {
        "2xs": ".5rem",
      },
    },
  },
  plugins: [],
};
export default config;
