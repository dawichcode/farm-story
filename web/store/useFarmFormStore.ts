import { create } from 'zustand'

interface FarmInfo {
  farm_name: string
  location: string
  size_acres: string
  primary_crop: string
}

interface CoffeeInfo {
  coffee_varieties: string
  coffee_tree_count: string
  estimated_annual_production: string
  last_harvest_date: string
}

interface Coordinates {
  latitude: string
  longitude: string
}

interface FarmFormState {
  step: number
  farmInfo: FarmInfo
  coffeeInfo: CoffeeInfo
  challenges: string[]
  coordinates: Coordinates

  setStep: (step: number) => void
  setFarmInfo: (data: Partial<FarmInfo>) => void
  setCoffeeInfo: (data: Partial<CoffeeInfo>) => void
  setChallenges: (challenges: string[]) => void
  setCoordinates: (coords: Partial<Coordinates>) => void
  reset: () => void
}

const defaultFarmInfo: FarmInfo = {
  farm_name:    '',
  location:     '',
  size_acres:   '',
  primary_crop: '',
}

const defaultCoffeeInfo: CoffeeInfo = {
  coffee_varieties:             '',
  coffee_tree_count:            '',
  estimated_annual_production:  '',
  last_harvest_date:            '',
}

export const useFarmFormStore = create<FarmFormState>((set) => ({
  step:        1,
  farmInfo:    { ...defaultFarmInfo },
  coffeeInfo:  { ...defaultCoffeeInfo },
  challenges:  [],
  coordinates: { latitude: '', longitude: '' },

  setStep: (step) => set({ step }),

  setFarmInfo: (data) =>
    set((s) => ({ farmInfo: { ...s.farmInfo, ...data } })),

  setCoffeeInfo: (data) =>
    set((s) => ({ coffeeInfo: { ...s.coffeeInfo, ...data } })),

  setChallenges: (challenges) => set({ challenges }),

  setCoordinates: (coords) =>
    set((s) => ({ coordinates: { ...s.coordinates, ...coords } })),

  reset: () =>
    set({
      step:        1,
      farmInfo:    { ...defaultFarmInfo },
      coffeeInfo:  { ...defaultCoffeeInfo },
      challenges:  [],
      coordinates: { latitude: '', longitude: '' },
    }),
}))
