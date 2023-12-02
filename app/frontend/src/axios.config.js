// const isProduction = process.env.NODE_ENV === "production";
const isProduction = true;

const config = {
  baseURL: isProduction ? "http://0.0.0.0:8000" : "http://localhost:8000",
};

export default config;
