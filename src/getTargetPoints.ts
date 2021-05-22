import { Client } from "@notionhq/client";
import addDays from "date-fns/addDays";

export interface Point {
  name: string;
  expiredAt: string;
}

export default async function getTargetPoints(): Promise<Point[]> {
  const notion = new Client({
    auth: process.env.NOTION_TOKEN,
  });

  const now = new Date();
  const reminderPeriod = addDays(now, 3);

  const response = await notion.databases.query({
    database_id: process.env.DATABASE_ID ?? "",
    filter: {
      and: [
        {
          property: "ExpiredAt",
          date: {
            on_or_after: now.toISOString(),
            next_month: {},
            next_week: {},
            next_year: {},
            past_month: {},
            past_week: {},
            past_year: {},
          },
        },
        {
          property: "ExpiredAt",
          date: {
            on_or_after: now.toISOString(),
            on_or_before: reminderPeriod.toISOString(),
            next_month: {},
            next_week: {},
            next_year: {},
            past_month: {},
            past_week: {},
            past_year: {},
          },
        },
      ],
    },
  });

  return response.results
    .map((v) => {
      const expiredPropertyValue = v.properties["ExpiredAt"];
      const pointNamePropertyValue = v.properties["Name"];
      if (
        expiredPropertyValue?.type === "date" &&
        pointNamePropertyValue?.type === "title"
      ) {
        const expiredAt = expiredPropertyValue.date.start;
        const name =
          pointNamePropertyValue.title.length > 0
            ? pointNamePropertyValue.title[0].plain_text
            : "";

        return {
          name,
          expiredAt,
        };
      }
      return null;
    })
    .filter((v): v is Point => v != null);
}
