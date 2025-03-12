export default function Loading() {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex flex-col justify-center items-center z-50 text-white">
            <div className="w-16 h-16 border-4 border-gray-300 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-lg font-semibold animate-pulse">Summarizing...</p>
        </div>
    );
}