interface FarmerIdCardProps {
  farmerId: string
  farmerName: string
  county?: string
}

export default function FarmerIdCard({ farmerId, farmerName, county }: FarmerIdCardProps) {
  return (
    <div className="rounded-xl border border-gold/40 bg-white p-6 shadow-sm motion-safe:animate-roll-in">
      <p className="text-xs font-medium tracking-widest text-gray-400 uppercase mb-3">
        Farmer ID
      </p>

      <p className="font-mono text-2xl font-medium text-gold tracking-wider mb-4">
        {farmerId}
      </p>

      <div className="border-t border-gray-100 pt-4 space-y-1">
        <p className="text-sm font-semibold text-black">{farmerName}</p>
        {county && (
          <p className="text-sm text-gray-500">{county}</p>
        )}
      </div>
    </div>
  )
}
