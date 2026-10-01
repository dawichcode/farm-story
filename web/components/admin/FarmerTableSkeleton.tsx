export default function FarmerTableSkeleton() {
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm animate-pulse">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100 bg-gray-50">
            {['Farmer', 'County', 'Farm', 'Acres'].map((h) => (
              <th key={h} className="px-4 py-3">
                <div className="h-3 bg-gray-200 rounded w-16" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {Array.from({ length: 5 }, (_, i) => (
            <tr key={i}>
              <td className="px-4 py-4">
                <div className="h-3.5 bg-gray-200 rounded w-32 mb-1.5" />
                <div className="h-2.5 bg-gray-100 rounded w-24" />
              </td>
              <td className="px-4 py-4 hidden sm:table-cell">
                <div className="h-3 bg-gray-200 rounded w-20" />
              </td>
              <td className="px-4 py-4 hidden md:table-cell">
                <div className="h-3 bg-gray-200 rounded w-28" />
              </td>
              <td className="px-4 py-4 hidden md:table-cell text-right">
                <div className="h-3 bg-gray-100 rounded w-10 ml-auto" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
