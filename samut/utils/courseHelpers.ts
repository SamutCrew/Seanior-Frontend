export function getLevelColor(level: string) {
  switch (level.toLowerCase()) {
    case "beginner":
      return "bg-emerald-100 text-emerald-800 border-emerald-200"
    case "intermediate":
      return "bg-blue-100 text-blue-800 border-blue-200"
    case "advanced":
      return "bg-purple-100 text-purple-800 border-purple-200"
    default:
      return "bg-gray-100 text-gray-800 border-gray-200"
  }
}
