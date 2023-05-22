import Image from 'next/image'
import logo from '../assets/logo-space.svg'
import Link from 'next/link'
export default function Hero() {
  return (
    <div>
      <div className="space-y-5">
        <Image src={logo} alt="logo" />

        <div className="max-w-[420px] space-y-1">
          <h1 className="mt-5 text-4xl font-bold leading-tight text-gray-50">
            Sua capsula do tempo
          </h1>
          <p className="text-lg leading-relaxed">
            Colecione momentos marcantes da sua jornada e compartilhe (se
            quiser) com o mundo!
          </p>
          <Link
            href="/memories/new"
            className="inline-block rounded-full bg-green-500 px-5 py-5 font-alt uppercase leading-none text-black hover:bg-green-600"
          >
            CADASTRAR LEMBRANçA
          </Link>
        </div>
      </div>
    </div>
  )
}
