"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import BrazilMap from '@/components/BrazilMap';
import ViewerModal from '@/components/ViewerModal';
import Link from 'next/link';

type StateInfo = {
  stateCode: string;
  viewers: Array<{ id: string, viewerName: string }> ;
};

const getStateName = (stateCode: string): string => {
  const stateNames: Record<string, string> = {
    AC: 'Acre',
    AL: 'Alagoas',
    AP: 'Amapá',
    AM: 'Amazonas',
    BA: 'Bahia',
    CE: 'Ceará',
    DF: 'Distrito Federal',
    ES: 'Espírito Santo',
    GO: 'Goiás',
    MA: 'Maranhão',
    MT: 'Mato Grosso',
    MS: 'Mato Grosso do Sul',
    MG: 'Minas Gerais',
    PA: 'Pará',
    PB: 'Paraíba',
    PR: 'Paraná',
    PE: 'Pernambuco',
    PI: 'Piauí',
    RJ: 'Rio de Janeiro',
    RN: 'Rio Grande do Norte',
    RS: 'Rio Grande do Sul',
    RO: 'Rondônia',
    RR: 'Roraima',
    SC: 'Santa Catarina',
    SP: 'São Paulo',
    SE: 'Sergipe',
    TO: 'Tocantins'
  };
  
  return stateNames[stateCode.toUpperCase()] || stateCode;
};

export default function MapPage() {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();
  const [states, setStates] = useState<StateInfo[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedState, setSelectedState] = useState<StateInfo | null>(null);
  const [mapLoading, setMapLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
      return;
    }

    if (user) {
      fetchStates();
    }
  }, [user, isLoading, router]);

  const fetchStates = async () => {
    try {
      setMapLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('/api/viewers', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setStates(data);
    } catch (error) {
      console.error('Failed to fetch states data:', error);
    } finally {
      setMapLoading(false);
    }
  };

  const handleStateClick = (stateCode: string) => {
    const stateInfo = states.find(s => s.stateCode === stateCode) || {
      stateCode,
      viewers: []
    };
    setSelectedState(stateInfo);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedState(null);
  };

  const addViewer = async (stateCode: string, viewerName: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/viewers', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ stateCode, viewerName })
      });

      if (response.ok) {
        fetchStates();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to add viewer:', error);
      return false;
    }
  };

  const removeViewer = async (viewerId: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/viewers/${viewerId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        fetchStates();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to remove viewer:', error);
      return false;
    }
  };

  const rankedStates = [...states].sort((a, b) => 
    b.viewers.length - a.viewers.length
  ).slice(0, 10);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-gray-900 dark:text-white hover:opacity-90 transition-opacity">
            BingoMap Brasil
          </Link>
          
          <div className="flex items-center gap-6">
            <span className="text-sm text-gray-600 dark:text-gray-300">
              {user?.email}
            </span>
            <button 
              onClick={logout}
              className="text-sm font-medium text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
            >
              Sair
            </button>
          </div>
        </div>
      </header>
      
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col xl:flex-row gap-6">
          <div className="xl:w-3/4">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
              <h2 className="text-xl font-bold mb-3 text-gray-900 dark:text-white flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                Mapa Interativo do Brasil
              </h2>
              
              {mapLoading ? (
                <div className="h-[550px] md:h-[650px] flex items-center justify-center">
                  <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : (
                <div className="h-[550px] md:h-[650px] relative">
                  <BrazilMap states={states} onStateClick={handleStateClick} />
                  
                  <div className="absolute bottom-4 right-4 bg-white dark:bg-gray-700 p-2 rounded-md shadow-md">
                    <div className="flex flex-col gap-1 text-xs">
                      <div className="flex items-center">
                        <div className="w-4 h-4 rounded mr-1" style={{backgroundColor: '#E5E7EB'}}></div>
                        <span>0 viewers</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-4 h-4 rounded mr-1" style={{backgroundColor: '#DBEAFE'}}></div>
                        <span>1-2 viewers</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-4 h-4 rounded mr-1" style={{backgroundColor: '#93C5FD'}}></div>
                        <span>3-5 viewers</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-4 h-4 rounded mr-1" style={{backgroundColor: '#60A5FA'}}></div>
                        <span>6-9 viewers</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-4 h-4 rounded mr-1" style={{backgroundColor: '#3B82F6'}}></div>
                        <span>10-14 viewers</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-4 h-4 rounded mr-1" style={{backgroundColor: '#2563EB'}}></div>
                        <span>15+ viewers</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-4 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                Clique em um estado para adicionar ou remover viewers
              </p>
            </div>
          </div>
          
          <div className="xl:w-1/4">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
              <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                Ranking dos Estados
              </h2>
              
              {mapLoading ? (
                <div className="h-72 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : (
                <ul className="space-y-3">
                  {rankedStates.length > 0 ? (
                    rankedStates.map((state, index) => (
                      <li 
                        key={state.stateCode}
                        onClick={() => handleStateClick(state.stateCode)}
                        className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <span className={`w-6 h-6 flex items-center justify-center rounded-full ${
                            index === 0
                              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100' 
                              : index === 1
                                ? 'bg-gray-200 text-gray-800 dark:bg-gray-500 dark:text-gray-100'
                                : index === 2
                                  ? 'bg-amber-100 text-amber-800 dark:bg-amber-800 dark:text-amber-100'
                                  : 'bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-100'
                          } font-medium text-sm shadow-sm`}>
                            {index + 1}
                          </span>
                          <div>
                            <p className="font-medium">{getStateName(state.stateCode)}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{state.stateCode.toUpperCase()}</p>
                          </div>
                        </div>
                        <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 text-xs px-2 py-1 rounded-full font-semibold">
                          {state.viewers.length} viewer{state.viewers.length !== 1 ? 's' : ''}
                        </span>
                      </li>
                    ))
                  ) : (
                    <div className="text-gray-500 dark:text-gray-400 text-center py-12 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto mb-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      <p>Nenhum viewer adicionado ainda</p>
                    </div>
                  )}
                </ul>
              )}
            </div>
          </div>
        </div>
      </main>

      {selectedState && (
        <ViewerModal
          isOpen={isModalOpen}
          stateInfo={selectedState}
          onClose={closeModal}
          onAddViewer={addViewer}
          onRemoveViewer={removeViewer}
        />
      )}
    </div>
  );
}
