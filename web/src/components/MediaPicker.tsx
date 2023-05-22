'use client'

import { ChangeEvent, useState } from 'react'

export default function MediaPicker() {
  const [preview, setPreview] = useState<string | null>('')

  function handleOnFileSelected(event: ChangeEvent<HTMLInputElement>) {
    const { files } = event.target
    console.log(files)
    if (!files) {
      // eslint-disable-next-line no-useless-return
      return
    }
    const previewUrl = URL.createObjectURL(files[0])
    setPreview(previewUrl)
  }
  return (
    <>
      <input
        onChange={handleOnFileSelected}
        name="coverUrl"
        type="file"
        id="media"
        className="invisible h-0 w-0"
      />
      {preview && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={preview}
          alt=""
          className="aspect-video w-full rounded-lg object-cover"
        />
      )}
    </>
  )
}
