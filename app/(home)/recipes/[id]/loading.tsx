export default function Loading() {
  return (
    <div className="mx-auto max-w-4xl p-4">
      <div className="animate-pulse">
        <div className="mb-4 h-8 w-3/4 rounded bg-gray-200"></div>
        <div className="mb-8 h-96 rounded bg-gray-200"></div>
        <div className="mb-8 grid grid-cols-2 gap-4">
          <div className="h-24 rounded bg-gray-200"></div>
          <div className="h-24 rounded bg-gray-200"></div>
        </div>
      </div>
    </div>
  );
}
