import { version } from "mongoose";
import swaggerAutogen from "swagger-autogen";

const doc = {
  info: {
    version: "v0.0.1",
    title: "Dokumentasi API ACARA",
    description: "Dokumentasi API ACARA",
  },
  servers: [
    {
      url: "http://localhost:3000/api",
      description: "Local Server",
    },
    {
      url: "https://back-end-acara-peach.vercel.app/api",
      description: "Deployed Server",
    },
  ],
  components: {
    securitySchemes: {
      baererAuth: {
        type: "http",
        scheme: "bearer",
      },
    },
    schemas: {
      loginRequest: {
        identifier: "crylsywl",
        password: "admin123",
      },
      ActivationRequest: {
        code: "abcdef",
      },
    },
  },
};

const outputFile = "./swagger_output.json";
const endpointFiles = ["../routes/api.ts"];

swaggerAutogen({ openapi: "3.0.0" })(outputFile, endpointFiles, doc);
