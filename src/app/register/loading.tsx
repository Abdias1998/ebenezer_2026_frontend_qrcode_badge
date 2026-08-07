import { LoadingState } from "@/components/shared/LoadingState";

export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <LoadingState message="Chargement..." size="lg" />
    </div>
  );
}
