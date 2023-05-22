import { Link, useLocalSearchParams, } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native'
import { api } from '../../src/lib/api'
import * as SecureStore from 'expo-secure-store'
import Logo from '../../src/assets/logo.svg'
import dayjs from 'dayjs'
import ptBr from 'dayjs/locale/pt-br'
import Icon from '@expo/vector-icons/Feather'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
dayjs.locale(ptBr)
interface MemoryProps {
  coverUrl: string
  content: string
  createdAt: string
  id: string
}

export default function SeeMemory() {
  const [memory, setMemory] = useState({} as MemoryProps)
  const params = useLocalSearchParams()
  const { id } = params;
  const { bottom, top } = useSafeAreaInsets()

  async function getMemoryById() {
    const token = await SecureStore.getItemAsync('token')
    const response = await api.get(`/memories/${id}`, { headers: { Authorization: `Bearer ${token}` } })
    setMemory(response.data)
  }

  useEffect(() => {
    getMemoryById()
  }, [])

  return (
    <ScrollView className="flex-1 " contentContainerStyle={{ paddingBottom: bottom, paddingTop: top }}>
       <View className="mt-4 flex-row items-center justify-between px-8">
        <Logo />

        <View className="flex-row gap-2">

          <Link href='/memories' asChild>
            <TouchableOpacity className="h-10 w-10 items-center justify-center rounded-full bg-purple-500">
              <Icon name="arrow-left" size={16} color='#fff' />
            </TouchableOpacity>
          </Link>
        </View>
      </View>

   
        <View className='flex-1 px-8 py-8 items-start '>
          <Image source={{ uri: memory.coverUrl }} className="aspect-video w-full mb-3 rounded-lg" alt="" />
          <View className='gap-2'>
            <Text className='text-gray-50 font-bold'>
              Data criação {dayjs(memory.createdAt).format("D[ de ]MMMM[, ]YYYY")}
            </Text>
            <Text className='text-gray-50'>
              Sobre: {memory.content}
            </Text>
          </View>
        </View >
    </ScrollView>
  )
}
