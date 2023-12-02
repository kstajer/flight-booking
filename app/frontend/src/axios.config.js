const isProduction = process.env.NODE_ENV === "production";

const config = {
  baseURL: isProduction ? "" : "http://localhost:8000",
};

export default config;
