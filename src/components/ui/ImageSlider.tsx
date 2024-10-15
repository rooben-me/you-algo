import { useState } from "react"

// If you are looking for mobile support, please refer to the
// following implementation by @daviddecorso
// https://github.com/unhingedmagikarp/comparison-slider/tree/mobile-support

interface IImageSlider {
  firstImage?: string
  secondImage?: string
}

export const ImageSlider = ({ firstImage, secondImage }: IImageSlider) => {
  const [sliderPosition, setSliderPosition] = useState(50)
  const [isDragging, setIsDragging] = useState(false)

  const handleMove = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!isDragging) return

    const rect = event.currentTarget.getBoundingClientRect()
    const x = Math.max(0, Math.min(event.clientX - rect.left, rect.width))
    const percent = Math.max(0, Math.min((x / rect.width) * 100, 100))

    setSliderPosition(percent)
  }

  const handleMouseDown = () => {
    setIsDragging(true)
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  return (
    <div
      className="w-full relative overflow-hidden rounded-md border border-gray-200 shadow-sm bg-gray-50"
      onMouseUp={handleMouseUp}>
      <div
        className="relative w-full max-w-[700px] aspect-[4/5] m-auto overflow-hidden select-none"
        onMouseMove={handleMove}
        onMouseDown={handleMouseDown}>
        <img
          className="object-cover h-full w-full"
          alt="First Image"
          src={
            firstImage ||
            "https://static.vecteezy.com/system/resources/previews/018/938/902/original/still-empty-page-with-cute-ghost-concept-illustration-flat-design-icon-vector.jpg"
          }
        />

        <div
          className="absolute top-0 left-0 right-0 w-full max-w-[700px] aspect-[4/5] m-auto overflow-hidden select-none"
          style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}>
          <img
            className="object-cover h-full w-full"
            alt="Second Image"
            src={
              secondImage ||
              "https://static.vecteezy.com/system/resources/previews/018/938/902/original/still-empty-page-with-cute-ghost-concept-illustration-flat-design-icon-vector.jpg"
            }
          />
        </div>
        <div
          className="group px-8 absolute top-0 bottom-0 cursor-ew-resize"
          style={{
            left: `calc(${sliderPosition}% - 34px)`
          }}>
          <div className="w-0.5 bg-gray-200 opacity-30 group-hover:opacity-100 ease-in-out transition-opacity h-full">
            <div className="bg-white ring-4 relative ring-gray-200 rounded-full h-3 w-3 -left-[5px] top-[calc(50%-5px)]" />
          </div>
        </div>
      </div>
    </div>
  )
}
