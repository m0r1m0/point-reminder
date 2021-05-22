import getTargetPoints from "./getTargetPoints";
import notify from "./notify";
import dotenv from "dotenv";
dotenv.config();

async function main() {
  const points = await getTargetPoints();
  await notify(points);
}

main();
