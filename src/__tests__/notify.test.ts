import { Point } from "../getTargetPoints";
import { createMessage } from "../notify";

test("1 item(last 2 days)", () => {
  const points: Point[] = [
    {
      name: "test01",
      expiredAt: "2021-05-22",
    },
  ];
  const referenceDate = new Date("2021-05-20");
  const message = `
もうすぐ期限切れのポイントがあります

## あと2日
- test01
`;
  expect(createMessage(points, referenceDate)).toBe(message);
});

test("no target", () => {
  const points: Point[] = [];
  expect(createMessage(points, new Date())).toBe("");
});

test("2 item (last 2 & 3 days)", () => {
  const points: Point[] = [
    {
      name: "test01",
      expiredAt: "2021-05-23",
    },
    {
      name: "test02",
      expiredAt: "2021-05-22",
    },
  ];
  const referenceDate = new Date("2021-05-20");
  const message = `
もうすぐ期限切れのポイントがあります

## あと2日
- test02

## あと3日
- test01
`;
  expect(createMessage(points, referenceDate)).toBe(message);
});
