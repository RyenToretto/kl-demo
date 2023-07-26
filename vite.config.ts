/// <reference types="vitest" />
import { getBabelOutputPlugin } from '@rollup/plugin-babel';
import path from "path";
import { defineConfig } from "vite";
import packageJson from "./package.json";

const getPackageName = () => {
  return packageJson.name;
};

const getPackageNameCamelCase = () => {
  try {
    return getPackageName().replace(/-./g, (char) => char[1].toUpperCase());
  } catch (err) {
    throw new Error("Name property in package.json is missing.");
  }
};

const fileName = {
  iife: `${getPackageName()}.js`,
};

const formats = Object.keys(fileName) as Array<keyof typeof fileName>;

module.exports = defineConfig({
  base: "./",
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      name: getPackageNameCamelCase(),
      formats,
      fileName: (format) => fileName[format],
    },
    target: 'ie11',
    rollupOptions: {
      plugins: [
        getBabelOutputPlugin({
          allowAllFormats: true,
          presets: ['@babel/preset-env']
        }),
      ]
    }
  }
});
