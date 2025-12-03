export default function Topbar() {
  return (
    <div className="h-16 bg-slate-900 border-b border-slate-800 flex items-center px-6 justify-between text-slate-300">
      <h2 className="text-lg font-medium text-white">ArioAI Builder</h2>
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-3">
          <span className="text-sm">user@example.com</span>
          <div className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center text-xs font-medium text-white">
            US
          </div>
        </div>
      </div>
    </div>
  );
}
