import Image from 'next/image'

type CanchaProps = {
  esMiCancha: boolean
  jugador: { nickname: string, avatar: string }
}

export default function Cancha({ esMiCancha, jugador }: CanchaProps) {
  const posiciones = [
    { top: '10%', left: '45%' }, // Portero
    { top: '25%', left: '20%' },
    { top: '25%', left: '70%' },
    { top: '40%', left: '30%' },
    { top: '40%', left: '60%' },
    { top: '55%', left: '20%' },
    { top: '55%', left: '70%' },
    { top: '70%', left: '30%' },
    { top: '70%', left: '60%' },
    { top: '85%', left: '40%' },
    { top: '85%', left: '50%' },
  ]

  return (
    <div className="relative w-[300px] h-[500px] bg-green-700 rounded-xl bg-[url('/cancha.svg')] bg-cover bg-center  border-white overflow-hidden">
      <p className="absolute top-2 left-2 text-white font-bold">{jugador.nickname}</p>
      <Image src={jugador.avatar} width={40} height={40} alt="avatar" className="absolute top-2 right-2 rounded-full border border-white" />

      {posiciones.map((pos, index) => (
        <button
          key={index}
          style={{ top: pos.top, left: pos.left }}
          className="absolute w-10 h-10 rounded-full bg-white bg-opacity-80 hover:bg-yellow-400"
        >
          {index + 1}
        </button>
      ))}
    </div>
  )
}
