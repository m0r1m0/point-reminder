import fetch from "node-fetch";
import { Point } from "./getTargetPoints";
import differenceInDays from "date-fns/differenceInDays";

export default async function notify(points: Point[]): Promise<void> {
  const message = createMessage(points, new Date());
  await fetch("https://notify-api.line.me/api/notify", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.LINE_TOKEN}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: `message=${message}`,
  });
}

export function createMessage(points: Point[], referenceDate: Date): string {
  if (points.length === 0) {
    return "";
  }
  const headMessage = "\nもうすぐ期限切れのポイントがあります";
  const groupedByExpired = points.reduce((acc, cur) => {
    const difference = differenceInDays(new Date(cur.expiredAt), referenceDate);
    return {
      ...acc,
      [difference]: (acc[difference] ?? []).concat(cur.name),
    };
  }, {} as { [key: number]: string[] });

  const message = Object.keys(groupedByExpired)
    .map(Number)
    .reduce((acc, cur) => {
      const head = `## あと${cur}日`;
      const list = groupedByExpired[cur].reduce((a, c) => {
        return a + `- ${c}\n`;
      }, "");
      return `${acc}\n${head}\n${list}`;
    }, "");
  return `${headMessage}\n${message}`;
}
