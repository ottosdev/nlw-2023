import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import Logo from '../src/assets/logo.svg'
import { makeRedirectUri, useAuthRequest } from 'expo-auth-session';
import { useEffect, useState } from 'react';
import { api } from '../src/lib/api';
import { Tabs, useRouter } from "expo-router";
import AuthProvider, { useAuth } from '../src/hooks/authContenxt';

// Endpoint
const discovery = {
  authorizationEndpoint: 'https://github.com/login/oauth/authorize',
  tokenEndpoint: 'https://github.com/login/oauth/access_token',
  revocationEndpoint: 'https://github.com/settings/connections/applications/34d4a3ff9e596cea576f',
};

export default function App() {
  const router = useRouter()
  const { token } = useAuth();

  console.log(token)
  const [loading, setLoading] = useState<boolean>(false)
  const [_, response, signInGithub] = useAuthRequest(
    {
      clientId: '34d4a3ff9e596cea576f',
      scopes: ['identity'],
      redirectUri: makeRedirectUri({
        scheme: 'nwlspacetime'
      }),
    },
    discovery
  );


  async function handleGitHubAuthCode(code: string) {
    const response = await api.post('/register', { code });
    const { token } = response.data
    await SecureStore.setItemAsync('token', token)

    router.push('/memories')
    setLoading(false)
  }
  useEffect(() => {
    //   console.log(makeRedirectUri({
    //     scheme: 'nwlspacetime'
    // }))

    if (response?.type === 'success') {
      setLoading(true)
      const { code } = response.params;
      handleGitHubAuthCode(code);
    }
  }, [response]);


  return (

    <View
      className='flex-1 px-8 py-10 items-center' >
      <View className='flex-1 items-center justify-center gap-6'>
        <Logo />
        <View className='space-y-2'>
          <Text className='text-center font-title text-2xl leading-tight text-gray-50'>Sua capstula do tempo</Text>
          <Text className='text-center font-body text-base leading-relaxed text-gray-100'>Colecione momentos marcantes da sua jornada e compartilhe (se quiser) com o mundo!</Text>
        </View>
        {
          loading ? (
            <ActivityIndicator />
          )
            :
            (<TouchableOpacity onPress={() => signInGithub()} activeOpacity={0.7} className='rounded-full bg-green-500 px-5 py-2'>
              <Text className='font-alt text-sm uppercase text-black'>Cadastrar lembrança</Text>
            </TouchableOpacity>)
        }
      </View>
      <Text className='text-gray-200 text-center font-body leading-relaxed'>
        Feito com 💜 no NLW da Rocketseat
      </Text>
    </View>

  );
}
