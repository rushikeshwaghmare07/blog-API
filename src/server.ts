import express from "express";

import config from "@/config";

const app = express();
const PORT = config.PORT;

app.listen(PORT, () => {
  console.log(`Server running: http://localhost:${PORT}`);
});
