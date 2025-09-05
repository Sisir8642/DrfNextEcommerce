'use client';

import { Input } from "@/components/ui/input";
import React from "react";

export function InputDemo({
  value,
  onChange,
}: {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <Input
      type="text"
      placeholder="Search ..."
      value={value}
      onChange={onChange}
      className="w-64"
    />
  );
}