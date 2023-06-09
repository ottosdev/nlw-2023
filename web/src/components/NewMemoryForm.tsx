'use client'
import { Camera } from 'lucide-react'
import React, { FormEvent } from 'react'
import MediaPicker from './MediaPicker'
import { api } from '@/lib/api'

import Cookie from 'js-cookie'
import { useRouter } from 'next/navigation'

export default function NewMemoryForm() {
  const router = useRouter()
  async function handleCreateMemory(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)

    const fileToUpload = formData.get('coverUrl')

    let coverUrl = ''

    if (fileToUpload) {
      const uploadFormData = new FormData()
      uploadFormData.set('file', fileToUpload)

      const uploadResponse = await api.post('/upload', uploadFormData)
      console.log(uploadResponse.data)

      coverUrl = uploadResponse.data.fileUrl
    }
    const token = Cookie.get('token')

    await api.post(
      '/memories',
      {
        coverUrl,
        content: formData.get('content'),
        isPublic: formData.get('isPublic'),
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )
    router.push('/')
  }
  return (
    <form
      className="flex flex-1 flex-col gap-2 p-16"
      onSubmit={handleCreateMemory}
    >
      <div className="flex items-center gap-4">
        <label
          htmlFor="media"
          className="flex cursor-pointer items-center gap-1.5 text-sm text-gray-200 hover:text-gray-100"
        >
          <Camera className="h-4 w-4" />
          Anexar midia
        </label>

        <label
          htmlFor="isPublic"
          className="flex items-center gap-1.5 text-sm text-gray-200 hover:text-gray-100"
        >
          <input type="checkbox" name="isPublic" id="isPublic" value="true" />
          Tornar memoria publica
        </label>
      </div>

      <MediaPicker />
      <textarea
        name="content"
        spellCheck={false}
        className=" w-full flex-1 resize-none rounded border-0 bg-transparent p-0 leading-relaxed text-gray-100 placeholder:text-gray-400 focus:ring-0"
        placeholder="Fique livre para adicionar fotos, videos e relatos sobre essa experiencia que voce quer lembrar para sempre."
      />

      <button className="inline-block self-end rounded-full bg-green-500 px-5 py-5 font-alt uppercase leading-none text-black hover:bg-green-600">
        Salvar
      </button>
    </form>
  )
}
