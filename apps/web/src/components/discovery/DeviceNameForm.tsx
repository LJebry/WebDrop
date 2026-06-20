"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

type DeviceNameFormProps = {
  initialName: string;
  onSave: (deviceName: string) => void;
};

export function DeviceNameForm({ initialName, onSave }: DeviceNameFormProps) {
  const [value, setValue] = useState(initialName);

  useEffect(() => {
    setValue(initialName);
  }, [initialName]);

  return (
    <form
      className="flex flex-col gap-3 sm:flex-row"
      onSubmit={(event) => {
        event.preventDefault();
        onSave(value.trim() || initialName);
      }}
    >
      <Input aria-label="Device name" value={value} onChange={(event) => setValue(event.target.value)} />
      <Button type="submit" className="sm:w-28">
        Save
      </Button>
    </form>
  );
}
