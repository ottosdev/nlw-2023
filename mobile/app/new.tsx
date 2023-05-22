import { Image, ScrollView, Switch, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Link, useRouter, useNavigation } from "expo-router";
import Logo from '../src/assets/logo.svg'
import Icon from '@expo/vector-icons/Feather'
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useState } from "react";
import * as ImagePicker from 'expo-image-picker'
import { api } from "../src/lib/api";
import * as SecureStore from 'expo-secure-store'

export default function NewMemory() {

  const { bottom, top } = useSafeAreaInsets()
  const [content, setContent] = useState<string>('')
  const [preview, setPreview] = useState<string | null>(null)
  const [isPublic, setIsPublic] = useState<boolean>(false)
  const navigation = useRouter()
  async function openImagePicker() {
    try {

      // No permissions request is necessary for launching the image library
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
      });

      // const response = await api.post('', {})
      if (result.assets[0]) {
        setPreview(result.assets[0].uri);
      }
    } catch (error) {
      // error caso exista
    }
  }

  async function handleCreateMemory() {
    const token = await SecureStore.getItemAsync('token')

    let coverUrl = ''
    if (preview) {
      const uploadFormData = new FormData()

      uploadFormData.append('file', {
        name: 'image.jpg',
        type: 'image/jpge',
        uri: preview
      } as any)

      const uploadResponse = await api.post('/upload', uploadFormData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      coverUrl = uploadResponse.data.fileUrl
    }

    const data = {
      content,
      isPublic,
      coverUrl
    }

    await api.post('/memories', data, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    navigation.push('/memories')

  }

  return (
    <ScrollView className="flex-1 px-8" contentContainerStyle={{ paddingBottom: bottom, paddingTop: top }}>
      <View className="mt-4 flex-row items-center justify-between">
        <Logo />

        <Link href='/memories' asChild>
          <TouchableOpacity className="h-10 w-10 items-center justify-center rounded-full bg-purple-500">
            <Icon name="arrow-left" size={16} color='#fff' />
          </TouchableOpacity>
        </Link>
      </View>

      <View className="mt-6 space-y-6">
        <View className="flex-row items-center gap-2">
          <Switch
            thumbColor={isPublic ? "#9b79ea" : "#969ea0"}
            trackColor={{
              false: '#767577', true: '#372560'
            }}
            value={isPublic}
            onValueChange={setIsPublic} />
          <Text className="font-body text-base text-gray-200">
            Tornar memoria publica
          </Text>
        </View>

        <TouchableOpacity
          onPress={openImagePicker}
          activeOpacity={.7}
          className="
          bg-black/20 h-32 items-center justify-center rounded-lg border border-dashed
           border-gray-500">
          {
            preview ? (
              <Image className="h-full w-full rounded-lg object-cover" source={{ uri: preview }} />
            ) : (<View className="flex-row items-center gap-2">
              <Icon name="image" color='#fff' />
              <Text className="font-body text-sm text-gray-200">
                Adicionar foto ou video de capa
              </Text>
            </View>)
          }
        </TouchableOpacity>

        <TextInput multiline
          value={content}
          onChangeText={setContent}
          className="p-0 font-body text-lg text-gray-50"
          placeholderTextColor='#56565a'
          placeholder="Fique livre para adicionar fotos, vídeos e relatos sobre essa experiência que você quer lembrar para sempre."
        />

        <TouchableOpacity onPress={handleCreateMemory} activeOpacity={0.7}
          className='rounded-full self-end bg-green-500 px-5 py-2 items-center'
        >
          <Text className='font-alt text-sm uppercase text-black'>Salvar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}
