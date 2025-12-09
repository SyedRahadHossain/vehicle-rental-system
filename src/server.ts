import app from "./app";
import config from "./config";

async function main() {
  try {
    app.listen(config.port, () => {
      console.log(`Server is running on port ${config.port}`);
    });
  } catch (err) {
    console.error(err);
  }
}

main();
