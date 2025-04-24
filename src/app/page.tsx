import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="grid grid-rows-[auto_1fr_auto] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <header className="w-full flex justify-between items-center">
        <h1 className="font-bold text-2xl">BingoMap Brasil</h1>
        <div className="flex gap-4">
          <Link 
            href="/login"
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 px-4"
          >
            Login
          </Link>
          <Link 
            href="/register"
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 px-4"
          >
            Cadastro
          </Link>
        </div>
      </header>
      
      <main className="flex flex-col gap-[32px] items-center text-center max-w-3xl">
        <Image
          src="/map-icon.svg"
          alt="Brazil Map Icon"
          width={180}
          height={180}
          priority
          className="dark:invert"
        />
        <h2 className="text-4xl font-bold">Mapa Interativo do Brasil</h2>
        <p className="text-lg">
          Uma aplicação interativa onde você pode adicionar e gerenciar viewers por estado brasileiro.
          Acompanhe o ranking dos estados mais populares e personalize seu mapa.
        </p>
        
        <div className="flex gap-4 items-center flex-col sm:flex-row mt-6">
          <Link
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
            href="/register"
          >
            Comece Agora
          </Link>
          <Link
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto"
            href="/mapa"
          >
            Ver Mapa
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 w-full">
          <div className="border border-black/10 dark:border-white/10 rounded-xl p-6 flex flex-col items-center">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="18" height="18" x="3" y="3" rx="2" />
                <path d="M9 17v-4" />
                <path d="m12 17-3-4 3-4 3 4-3 4Z" />
                <path d="M15 17v-4" />
                <path d="M9 9v1" />
                <path d="M15 9v1" />
              </svg>
            </div>
            <h3 className="font-semibold text-lg">Autenticação Segura</h3>
            <p className="text-sm mt-2 text-gray-600 dark:text-gray-300">
              Sistema de login e cadastro com proteção de senhas e tokens JWT.
            </p>
          </div>
          <div className="border border-black/10 dark:border-white/10 rounded-xl p-6 flex flex-col items-center">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
                <path d="M2 12h20" />
              </svg>
            </div>
            <h3 className="font-semibold text-lg">Mapa Interativo</h3>
            <p className="text-sm mt-2 text-gray-600 dark:text-gray-300">
              Visualize todos os estados do Brasil e adicione viewers com apenas um clique.
            </p>
          </div>
          <div className="border border-black/10 dark:border-white/10 rounded-xl p-6 flex flex-col items-center">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
              </svg>
            </div>
            <h3 className="font-semibold text-lg">Ranking em Tempo Real</h3>
            <p className="text-sm mt-2 text-gray-600 dark:text-gray-300">
              Acompanhe os estados com mais viewers em um ranking atualizado automaticamente.
            </p>
          </div>
        </div>
      </main>
      
      <footer className="flex gap-[24px] flex-wrap items-center justify-center mt-12 text-sm text-gray-500">
        <p>© {new Date().getFullYear()} BingoMap Brasil</p>
        <span>•</span>
        <a href="#" className="hover:text-gray-700 dark:hover:text-gray-300">Termos de Uso</a>
        <span>•</span>
        <a href="#" className="hover:text-gray-700 dark:hover:text-gray-300">Política de Privacidade</a>
      </footer>
    </div>
  );
}
