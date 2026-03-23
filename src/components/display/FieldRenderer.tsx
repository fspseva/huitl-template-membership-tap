import { TextField } from "./TextField";
import { NumberField } from "./NumberField";
import { ImageGallery } from "./ImageGallery";
import { BadgeList } from "./BadgeList";
import { KeyValue } from "./KeyValue";
import { ProgressBar } from "./ProgressBar";

interface Field {
  id: string;
  name: string;
  display_type: string;
  value: unknown;
}

export function FieldRenderer({ field }: { field: Field }) {
  if (field.value === undefined || field.value === null) return null;

  switch (field.display_type) {
    case "text":
      return <TextField name={field.name} value={String(field.value)} />;
    case "number":
      return <NumberField name={field.name} value={Number(field.value)} />;
    case "image-gallery":
      return <ImageGallery name={field.name} value={field.value as any[]} />;
    case "badge-list":
      return <BadgeList name={field.name} value={field.value as string[]} />;
    case "key-value":
      return <KeyValue name={field.name} value={field.value as any[]} />;
    case "progress-bar":
      return <ProgressBar name={field.name} value={field.value as any} />;
    default:
      return <TextField name={field.name} value={String(field.value)} />;
  }
}
