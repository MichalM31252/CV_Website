import { createApp } from "vue";

import App from "./components/App.js";
import { portfolio } from "./data.js";
import reveal from "./reveal.js";

createApp(App, { portfolio }).directive("reveal", reveal).mount("#app");
