import nextSession from "next-session";

export const config = {
  api: {
    externalResolver: true,
  },
};

export const getSession = nextSession();
