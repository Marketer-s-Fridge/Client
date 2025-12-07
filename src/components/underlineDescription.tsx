"use client";

type Props = {
  lines: string[];
};

export default function UnderlinedDescription({ lines }: Props) {
  return (
    <div
      className="
        lined-description        /* 줄 배경 */
        w-full
        text-[13.5px]
        font-light
        leading-[1.8rem]        /* 위 CSS의 1.8rem이랑 맞추기 */
        text-black
      "
    >
      {lines.map((line, i) => (
        <p key={i} className="">
          {line}
        </p>
      ))}
    </div>
  );
}
