"use client";

import type { ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CAMP_EVENT_NAME, CAMP_PRIVACY, CAMP_RULES } from "@/features/camp/constants";

function DocumentDialog({
  trigger,
  title,
  description,
  items,
  ordered,
}: {
  trigger: ReactNode;
  title: string;
  description: string;
  items: readonly string[];
  ordered?: boolean;
}) {
  const List = ordered ? "ol" : "ul";
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-h-[85vh] max-w-lg overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <List
          className={`space-y-2.5 pl-5 text-sm leading-relaxed text-gray-700 ${
            ordered ? "list-decimal" : "list-disc"
          }`}
        >
          {items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </List>
      </DialogContent>
    </Dialog>
  );
}

export function CampRulesDialog({ trigger }: { trigger: ReactNode }) {
  return (
    <DocumentDialog
      trigger={trigger}
      title="Règlement du camp"
      description={`Règles applicables à tous les participants du ${CAMP_EVENT_NAME}.`}
      items={CAMP_RULES}
      ordered
    />
  );
}

export function CampPrivacyDialog({ trigger }: { trigger: ReactNode }) {
  return (
    <DocumentDialog
      trigger={trigger}
      title="Protection de vos données"
      description="Comment nous utilisons les informations de votre inscription."
      items={CAMP_PRIVACY}
    />
  );
}
