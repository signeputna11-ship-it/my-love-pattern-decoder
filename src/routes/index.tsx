import { createFileRoute } from "@tanstack/react-router";
import { HomePage, buildHomeHead } from "./home";

export const Route = createFileRoute("/")({
  component: HomePage,
  head: () => buildHomeHead("https://mylovepattern.com/"),
});
