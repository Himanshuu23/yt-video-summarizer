interface LoadingProps {
  progress?: number;
  message?: string;
}

export default function Loading({
  progress,
  message = "Summarizing...",
}: LoadingProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex flex-col justify-center items-center z-50 text-white px-6">
      <div className="w-16 h-16 border-4 border-gray-300 border-t-violet-400 rounded-full animate-spin mb-6" />
      <p className="text-lg font-semibold animate-pulse mb-2">{message}</p>
      {progress !== undefined && (
        <>
          <div className="w-full max-w-md h-2 bg-gray-800 rounded-full overflow-hidden mb-2">
            <div
              className="h-full bg-gradient-to-r from-violet-600 to-fuchsia-500 transition-all duration-300 ease-out"
              style={{ width: `${Math.min(100, progress)}%` }}
            />
          </div>
          <p className="text-sm text-gray-400">
            {Math.round(progress)}% — analyzing video content
          </p>
        </>
      )}
    </div>
  );
}
