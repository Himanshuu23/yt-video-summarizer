interface LoadingProps {
  message?: string;
}

export default function Loading({
  message = "Summarizing…",
}: LoadingProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-white">
      <div className="w-12 h-12 border-4 border-gray-600 border-t-violet-400 rounded-full animate-spin mb-5" />
      <p className="text-base font-medium text-gray-100">{message}</p>
      <p className="mt-2 text-sm text-gray-400 text-center max-w-sm">
        You can still browse the rest of the page while this finishes.
      </p>
    </div>
  );
}
