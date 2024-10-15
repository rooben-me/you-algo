import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/Form"
import { Input } from "@/components/ui/Input"
import { zodResolver } from "@hookform/resolvers/zod"
import { Upload, X } from "lucide-react"
import React from "react"
import { useDropzone } from "react-dropzone"
import { useForm } from "react-hook-form"
import { cn } from "utils/cn"
import { z } from "zod"

import { Button } from "../ui/Button"

interface ImageUploaderProps {
  label?: string
  description?: string
  className?: string
  onImageUpload: (image: { src: string }) => void
  onCancel: () => void
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  label,
  description,
  className,
  onImageUpload,
  onCancel
}) => {
  const [preview, setPreview] = React.useState<string | ArrayBuffer | null>("")

  const formSchema = z.object({
    image: z
      .instanceof(File)
      .refine((file) => file.size !== 0, "Please upload an image")
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onBlur",
    defaultValues: { image: new File([""], "filename") }
  })

  const onDrop = React.useCallback(
    (acceptedFiles: File[]) => {
      const reader = new FileReader()
      try {
        reader.onload = () => {
          setPreview(reader.result)
          onImageUpload({ src: reader.result as string })
        }
        reader.readAsDataURL(acceptedFiles[0])
        form.setValue("image", acceptedFiles[0])
        form.clearErrors("image")
      } catch (error) {
        setPreview(null)
        form.resetField("image")
      }
    },
    [form, onImageUpload]
  )

  const { getRootProps, getInputProps, isDragActive, fileRejections } =
    useDropzone({
      onDrop,
      maxFiles: 1,
      maxSize: 4000000,
      accept: {
        "image/png": [],
        "image/jpg": [],
        "image/jpeg": []
      }
    })

  return (
    <Form {...form}>
      <FormField
        control={form.control}
        name="image"
        render={() => (
          <FormItem>
            <FormLabel
              className={`${
                fileRejections.length !== 0 && "text-destructive"
              }`}>
              <CustomFormLabel description={description} label={label} />
              <span
                className={
                  form.formState.errors.image || fileRejections.length !== 0
                    ? "text-destructive"
                    : "text-muted-foreground"
                }></span>
            </FormLabel>
            <FormControl>
              <div
                {...getRootProps()}
                className={cn(
                  "min-h-[120px] mx-auto flex cursor-pointer flex-col items-center justify-center gap-y-2 rounded-md border border-gray-200 p-4 shadow-sm text-sm text-gray-600 text-center hover:bg-gray-50 relative h-[180px]",
                  isDragActive
                    ? "border border-green-200 outline outline-4 outline-green-100"
                    : "",
                  className
                )}>
                {preview ? (
                  <div>
                    <PreviewImageRenderer src={preview as string} />
                    <Button
                      onClick={(e) => {
                        e.stopPropagation()
                        onCancel()
                        setPreview(null)
                      }}
                      variant="outline"
                      size="icon"
                      className="absolute top-2 right-2">
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <Upload className="w-4 h-4" />
                )}
                <Input {...getInputProps()} type="file" />
                {isDragActive ? (
                  <p className="text-green-800 font-medium">Drop the image!</p>
                ) : (
                  <p>
                    {preview
                      ? "Click or drag a new image to replace"
                      : "Click here or drag a image to upload it"}
                  </p>
                )}
              </div>
            </FormControl>
            <FormMessage>
              {fileRejections.length !== 0 && (
                <p>Image must be less than 4MB and of type png, jpg, or jpeg</p>
              )}
            </FormMessage>
          </FormItem>
        )}
      />
    </Form>
  )
}

export const CustomFormLabel = ({
  label,
  description
}: {
  label?: string
  description?: string
}) => {
  return (
    <>
      <p className="text-base font-medium text-gray-800">
        {label ? label : null}
      </p>
      <p className="text-sm font-normal text-gray-600">
        {description ? description : null}
      </p>
    </>
  )
}

export const PreviewImageRenderer = ({ src }: { src: string }) => {
  return (
    <img src={src} className="h-[130px] w-full object-contain rounded-md" />
  )
}

export default ImageUploader
