import { ImageBackground } from 'react-native'
import { styled } from 'nativewind';

import blurBg from '../src/assets/luz.png'
import Stripes from '../src/assets/stripe.svg'

import { useFonts, Roboto_400Regular, Roboto_700Bold } from '@expo-google-fonts/roboto'
import { BaiJamjuree_700Bold } from '@expo-google-fonts/bai-jamjuree'
import { SplashScreen, Stack, Tabs } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';

import * as SecureStore from 'expo-secure-store';
import AuthProvider from '../src/hooks/authContenxt';

const StyledStripes = styled(Stripes);

export default function Layout() {
    const [isUserAuthenticated, setIsUserAuthenticated] = useState<null | boolean>(null);

    const [hasLoadedFonts] = useFonts({
        BaiJamjuree_700Bold,
        Roboto_400Regular,
        Roboto_700Bold
    });

    useEffect(() => {
        SecureStore.getItemAsync('token').then(token => {
            setIsUserAuthenticated(!!token)
        })
    }, [])

    if (!hasLoadedFonts) {
        return <SplashScreen />;
    }

    return (
        <AuthProvider>
            <ImageBackground
                imageStyle={{ position: 'absolute', left: '-100%' }}
                source={blurBg}
                className='flex-1 relative bg-gray-900'
            >
                <StyledStripes className='absolute left-2' />
                <StatusBar translucent style='light' />

                <Stack
                    initialRouteName='index'
                    screenOptions={{
                        headerShown: false,
                        contentStyle: {
                            backgroundColor: 'transparent',
                        },
                        animation: 'none'
                    }}>
                    <Stack.Screen name='index' redirect={isUserAuthenticated} />
                    <Stack.Screen name='memories' />
                    <Stack.Screen name='new' />
                </Stack>
            </ImageBackground>
        </AuthProvider>
    )
}
