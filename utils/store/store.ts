import { create } from "zustand"

interface ImageHighlightController {
  showHighlightImage: boolean
}

const useStore = create<ImageHighlightController>()((set) => ({
  showHighlightImage: false
}))

export default useStore
