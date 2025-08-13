"use client";
import { RoughNotation } from "react-rough-notation";
import clsx from "clsx";

export default function LongInput({
  className,
  placeholder,
  value,
  onChange,
}: {
  className?: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}) {
  return (
    <div className={clsx("flex flex-col gap-2", className)}>
      <RoughNotation
        type="underline"
        show={true}
        animate={false}
        color="var(--color-neutral-400)"
        strokeWidth={2}
        padding={0}
        multiline={true}
      >
        <textarea
          className="w-full field-sizing-content outline-none"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
        />
      </RoughNotation>
    </div>
  );
}
