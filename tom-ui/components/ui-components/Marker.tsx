import { motion } from "framer-motion";

type MarkerProps = {
  selected: boolean;
};

export default function Marker(props: MarkerProps) {
  const { selected } = props;
  return (
    <motion.svg
      width="22"
      height="30"
      viewBox="0 0 30 41"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="transition-colors hover:-translate-y-1 active:translate-y-0.5 drop-shadow-lg"
      initial={{ opacity: 1, y: -100 }}
      animate={{ opacity: 1, y: [null, 0, -12, 0, -6, 0, -3, 0, 0] }}
      transition={{
        delay: Math.random() * 0.3,
        duration: 1.5,
        times: [0, 0.1, 0.15, 0.2, 0.25, 0.3, 0.35, 0.4, 1],
      }}
      exit={{ opacity: 0 }}
      whileHover={{
        translateY: -3,
        transition: { duration: 0.2 },
      }}
      whileTap={{
        translateY: 0.5,
        transition: { duration: 0.2 },
      }}
    >
      <path
        d="M13.125 39.0625C9.0625 33.9844 0 21.875 0 15C0 6.71875 6.64062 0 15 0C23.2812 0 30 6.71875 30 15C30 21.875 20.8594 33.9844 16.7969 39.0625C15.8594 40.2344 14.0625 40.2344 13.125 39.0625ZM15 20C17.7344 20 20 17.8125 20 15C20 12.2656 17.7344 10 15 10C12.1875 10 10 12.2656 10 15C10 17.8125 12.1875 20 15 20Z"
        className="transition-colors"
        fill={selected ? "#214D63" : "#1A9FD3"}
      />
    </motion.svg>
  );
}
