import { FlatList, Image, ScrollView, Switch, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Link, useRouter } from "expo-router";
import Logo from '../src/assets/logo.svg'
import Icon from '@expo/vector-icons/Feather'
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import * as SecureStore from 'expo-secure-store'
import { useEffect, useState } from "react";
import { api } from "../src/lib/api";

import dayjs from 'dayjs'
import ptBr from 'dayjs/locale/pt-br'

import { useIsFocused } from '@react-navigation/native';



interface MemoryProps {
  covertUrl: string
  excerpt: string
  createdAt: string
  id: string
}

export default function Memories() {
  const { bottom, top } = useSafeAreaInsets()
  const router = useRouter()
  const isFocused = useIsFocused();
  const [memories, setMemories] = useState<MemoryProps[]>([])

  async function signout() {
    await SecureStore.deleteItemAsync('token');
    router.push('/')
  }

  async function getMemories() {
    const token = await SecureStore.getItemAsync('token')
    const response = await api.get('/memories', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    setMemories(response.data)
  }

  useEffect(() => {
    if (isFocused) {
      getMemories()
    }
  }, [isFocused])

  return (
    <View className="flex-1 " style={{ paddingBottom: bottom, paddingTop: top }}>
      <View className="mt-4 flex-row items-center justify-between px-8">
        <Logo />

        <View className="flex-row gap-2">

          <TouchableOpacity onPress={signout} className="h-10 w-10 items-center justify-center rounded-full bg-red-500">
            <Icon name="log-out" size={16} color='#000' />
          </TouchableOpacity>

          <Link href='/new' asChild>
            <TouchableOpacity className="h-10 w-10 items-center justify-center rounded-full bg-green-500">
              <Icon name="plus" size={16} color='#000' />
            </TouchableOpacity>
          </Link>
        </View>
      </View>

      <SafeAreaView className="space-y-10 pt-[-40px] pb-8">
        <FlatList
          ItemSeparatorComponent={() => (
            <View className="m-2" />
          )}
          keyExtractor={(item) => item.id}
          data={memories}
          renderItem={({ item }) => (
            <View className="space-y-4">
              <View className="flex-row items-center gap-2">
                <View className="h-px w-5 bg-gray-50" />
                <Text className="font-body text-gray-100 text-base">
                  {dayjs(item.createdAt).format("D[ de ]MMMM[, ]YYYY'")}
                </Text>
              </View>

              <View className="space-y-4 px-8">
                <Image source={{ uri: item.covertUrl }} className="aspect-video w-full rounded-lg" alt="" />
                <Text className="font-body text-base leading-relaxed text-gray-100">
                  {item.excerpt}
                </Text>


                <Link href={{pathname: `/seememory/${item.id}`}} asChild >
                  <TouchableOpacity className="items-center flex-row gap-2">
                    <Text className="font-body text-sm text-gray-200">Ler mais</Text>
                    <Icon name="arrow-right" size={16} color='#9e9ea8' />
                  </TouchableOpacity>
                </Link>
              </View>

            </View>
          )}

        />

        {/* {
          memories.map(memory => (
            <View className="space-y-4" key={memory.id}>
              <View className="flex-row items-center gap-2">
                <View className="h-px w-5 bg-gray-50" />
                <Text className="font-body text-xs text-gray-100">
                  {dayjs(memory.createdAt).format("D[ de ]MMMM[, ]YYYY'")}
                </Text>
              </View>

              <View className="space-y-4 px-8">
                <Image source={{ uri: memory.covertUrl }} className="aspect-video w-full rounded-lg" alt="" />
                <Text className="font-body text-base leading-relaxed text-gray-100">
                  {memory.excerpt}
                </Text>
                <Link href={`/memories/id`} asChild >
                  <TouchableOpacity className="items-center flex-row gap-2">
                    <Text className="font-body text-sm text-gray-200">Ler mais</Text>
                    <Icon name="arrow-right" size={16} color='#9e9ea8' />
                  </TouchableOpacity>
                </Link>
              </View>
            </View>
          ))
        } */}
      </SafeAreaView>
    </View>
  )
}
