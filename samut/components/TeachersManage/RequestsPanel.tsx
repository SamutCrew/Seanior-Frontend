import { FaBell, FaChevronRight } from "react-icons/fa"
import type { Request } from "@/types/schedule"
import { useAppSelector } from "@/app/redux"

interface RequestsPanelProps {
  requests: Request[]
}

export default function RequestsPanel({ requests }: RequestsPanelProps) {
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode)

  return (
    <div className={`${isDarkMode ? "bg-slate-800 border border-slate-700" : "bg-white"} rounded-lg shadow-sm`}>
      <div className={`p-4 ${isDarkMode ? "border-slate-700" : "border-b"}`}>
        <h2 className={`text-xl font-bold ${isDarkMode ? "text-white" : "text-slate-800"} flex items-center gap-2`}>
          <FaBell className={`h-5 w-5 ${isDarkMode ? "text-cyan-400" : "text-cyan-600"}`} /> Incoming Requests
        </h2>
      </div>
      <div className="p-4">
        {requests.length > 0 ? (
          <div className={`divide-y ${isDarkMode ? "divide-slate-700" : ""}`}>
            {requests.map((req) => (
              <div key={req.id} className="py-3 first:pt-0 last:pb-0">
                <p className={`font-medium ${isDarkMode ? "text-white" : "text-slate-800"}`}>{req.name}</p>
                <p className={`text-sm ${isDarkMode ? "text-gray-300" : "text-slate-500"} mt-1`}>{req.type}</p>
                <p className={`text-xs ${isDarkMode ? "text-gray-400" : "text-slate-400"} mt-1`}>
                  {new Date(req.date).toDateString()}
                </p>
                <button
                  className={`mt-2 px-3 py-1 text-sm ${
                    isDarkMode ? "border-slate-600 hover:bg-slate-700" : "border-slate-300 hover:bg-slate-50"
                  } border rounded-lg flex items-center gap-1`}
                >
                  Respond <FaChevronRight className="ml-1 h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className={`${isDarkMode ? "text-gray-400" : "text-slate-500"} text-center py-8`}>No incoming requests</p>
        )}
      </div>
    </div>
  )
}
