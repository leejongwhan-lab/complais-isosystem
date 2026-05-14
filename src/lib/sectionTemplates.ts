import type { Section } from "@/types/sections";
import { createDefaultSection, DOCUMENT_SECTION_TEMPLATES } from "@/types/sections";

export function getDefaultSections(docType: string): Section[] {
  const configs = DOCUMENT_SECTION_TEMPLATES[docType] ?? DOCUMENT_SECTION_TEMPLATES["P"] ?? [];
  return configs.map((t, i) => createDefaultSection(t.type, t.title, i + 1));
}
