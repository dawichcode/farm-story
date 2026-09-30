import { create } from 'zustand'

interface FarmerState {
  farmerId: number | null
  farmerPublicId: string | null   // e.g. FS-KEN-000001
  farmerName: string | null
  setFarmer: (id: number, publicId: string, name: string) => void
  reset: () => void
}

export const useFarmerStore = create<FarmerState>((set) => ({
  farmerId:      null,
  farmerPublicId: null,
  farmerName:    null,

  setFarmer: (id, publicId, name) =>
    set({ farmerId: id, farmerPublicId: publicId, farmerName: name }),

  reset: () =>
    set({ farmerId: null, farmerPublicId: null, farmerName: null }),
}))
