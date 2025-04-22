import { FaBell, FaChevronRight } from "react-icons/fa"
import type { Request } from "@/app/types/schedule"

interface RequestsPanelProps {
  requests: Request[]
}

export default function RequestsPanel({ requests }: RequestsPanelProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-4 border-b">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <FaBell className="h-5 w-5 text-cyan-600" /> Incoming Requests
        </h2>
      </div>
      <div className="p-4">
        {requests.length > 0 ? (
          <div className="divide-y">
            {requests.map((req) => (
              <div key={req.id} className="py-3 first:pt-0 last:pb-0">
                <p className="font-medium text-slate-800">{req.name}</p>
                <p className="text-sm text-slate-500 mt-1">{req.type}</p>
                <p className="text-xs text-slate-400 mt-1">{new Date(req.date).toDateString()}</p>
                <button className="mt-2 px-3 py-1 text-sm border border-slate-300 rounded-lg hover:bg-slate-50 flex items-center gap-1">
                  Respond <FaChevronRight className="ml-1 h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-slate-500 text-center py-8">No incoming requests</p>
        )}
      </div>
    </div>
  )
}
