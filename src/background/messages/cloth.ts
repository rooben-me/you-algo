// import * as fal from "@fal-ai/serverless-client"
// import { Image } from "image-js"

// import type { PlasmoMessaging } from "@plasmohq/messaging"

// type RequestBody = {
//   userPicture: string
//   clothImage: string
// }

// const resizeAndCropImage = async (imageUrl: string): Promise<string> => {
//   const response = await fetch(imageUrl)
//   const arrayBuffer = await response.arrayBuffer()
//   const image = await Image.load(arrayBuffer)

//   const aspectRatio = 3 / 4
//   let width, height

//   if (image.width / image.height > aspectRatio) {
//     height = image.height
//     width = Math.round(height * aspectRatio)
//   } else {
//     width = image.width
//     height = Math.round(width / aspectRatio)
//   }

//   const left = Math.round((image.width - width) / 2)
//   const top = Math.round((image.height - height) / 2)

//   const croppedImage = image.crop({ x: left, y: top, width, height })
//   const imgBuffer = croppedImage.toBuffer({ format: "jpeg" })
//   return Buffer.from(imgBuffer).toString("base64")
// }

// const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
//   const { userPicture, clothImage } = req.body as RequestBody

//   fal.config({
//     credentials: process.env.PLASMO_PUBLIC_FAL_KEY
//   })

//   try {
//     const [userPictureBase64, clothImageBase64] = await Promise.all([
//       resizeAndCropImage(userPicture),
//       resizeAndCropImage(clothImage)
//     ])

//     const result = await fal.subscribe("fal-ai/idm-vton", {
//       input: {
//         human_image_url: `data:image/jpeg;base64,${userPictureBase64}`,
//         garment_image_url: `data:image/jpeg;base64,${clothImageBase64}`,
//         description: "jacket"
//       },
//       logs: true,
//       onQueueUpdate: (update) => {
//         if (update.status === "IN_PROGRESS") {
//           update.logs.map((log) => log.message).forEach(console.log)
//         }
//       }
//     })

//     const finalResult = {
//       // @ts-ignore
//       responseImage: result.image.url,
//       userImage: `data:image/jpeg;base64,${userPictureBase64}`
//     }

//     res.send({
//       message: finalResult,
//       success: true
//     })
//   } catch (error) {
//     console.error("Error in API call:", error)
//     res.send({
//       message: error.message,
//       success: false
//     })
//   }
// }

// export default handler
