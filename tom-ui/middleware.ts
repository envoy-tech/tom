export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/home",
    "/created",
    "/details/1",
    "/details/2",
    "/details/3",
    "/finalize",
    "/itinerary",
    "/optimize",
    "/travelers",
  ],
};
