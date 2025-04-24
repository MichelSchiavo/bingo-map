"use client";

import { Fragment, useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';

type StateInfo = {
  stateCode: string;
  viewers: Array<{ id: string, viewerName: string }> ;
};

type ViewerModalProps = {
  isOpen: boolean;
  stateInfo: StateInfo;
  onClose: () => void;
  onAddViewer: (stateCode: string, viewerName: string) => Promise<boolean>;
  onRemoveViewer: (viewerId: string) => Promise<boolean>;
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
  
  return stateNames[stateCode] || stateCode;
};

export default function ViewerModal({ 
  isOpen, 
  stateInfo, 
  onClose,
  onAddViewer,
  onRemoveViewer
}: ViewerModalProps) {
  const [newViewer, setNewViewer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [localViewers, setLocalViewers] = useState<Array<{ id: string, viewerName: string }>>(stateInfo.viewers);
  const stateName = getStateName(stateInfo.stateCode);
  const stateCode = stateInfo.stateCode.toUpperCase();

  useEffect(() => {
    setLocalViewers(stateInfo.viewers);
  }, [stateInfo.viewers]);

  const handleAddViewer = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newViewer.trim()) {
      setError('O nome do viewer não pode estar vazio');
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    const tempId = `temp-${Date.now()}`;
    const optimisticViewer = { id: tempId, viewerName: newViewer.trim() };
    setLocalViewers(prev => [...prev, optimisticViewer]);
    setNewViewer('');
    
    try {
      const success = await onAddViewer(stateInfo.stateCode, optimisticViewer.viewerName);
      
      if (!success) {
        setLocalViewers(prev => prev.filter(v => v.id !== tempId));
        setError('Não foi possível adicionar o viewer');
        setNewViewer(optimisticViewer.viewerName);
      }
    } catch (err) {
      setLocalViewers(prev => prev.filter(v => v.id !== tempId));
      setError('Ocorreu um erro ao adicionar o viewer');
      setNewViewer(optimisticViewer.viewerName);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveViewer = async (id: string, viewerName: string) => {
    const previousViewers = [...localViewers];
    
    setLocalViewers(prev => prev.filter(v => v.id !== id));
    
    setIsSubmitting(true);
    try {
      const success = await onRemoveViewer(id);
      
      if (!success) {
        setLocalViewers(previousViewers);
        setError(`Não foi possível remover "${viewerName}"`);
      }
    } catch (err) {
      setLocalViewers(previousViewers);
      console.error('Error removing viewer:', err);
      setError(`Erro ao remover "${viewerName}"`);
    } finally {
      setIsSubmitting(false);
      
      if (error) {
        setTimeout(() => setError(''), 3000);
      }
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 text-left align-middle shadow-xl transition-all border border-gray-200 dark:border-gray-700">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-bold leading-6 text-gray-900 dark:text-white flex items-center"
                >
                  <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 mr-2 flex-shrink-0 flex items-center justify-center text-blue-800 dark:text-blue-200">
                    {stateCode}
                  </div>
                  <span>{stateName}</span>
                </Dialog.Title>
                
                <div className="mt-4">
                  <form onSubmit={handleAddViewer} className="space-y-4">
                    {error && (
                      <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-200 p-3 rounded-md text-sm flex items-start animate-fadeIn">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {error}
                      </div>
                    )}
                    
                    <div>
                      <label htmlFor="viewerName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Nome do Viewer
                      </label>
                      <div className="mt-1 flex rounded-md shadow-sm">
                        <input
                          type="text"
                          name="viewerName"
                          id="viewerName"
                          className="block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:bg-gray-700 dark:text-white px-3 py-2"
                          placeholder="Digite o nome do viewer"
                          value={newViewer}
                          onChange={(e) => setNewViewer(e.target.value)}
                          disabled={isSubmitting}
                        />
                        <button
                          type="submit"
                          className="ml-3 inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? 
                            <div className="flex items-center">
                              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Adicionando...
                            </div>
                           : 'Adicionar'}
                        </button>
                      </div>
                    </div>
                  </form>
                  
                  <div className="mt-6">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Viewers neste estado
                      </h4>
                      <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 rounded-full">
                        {localViewers.length} {localViewers.length === 1 ? 'viewer' : 'viewers'}
                      </span>
                    </div>
                    
                    {localViewers.length > 0 ? (
                      <ul className="divide-y divide-gray-200 dark:divide-gray-700 max-h-72 overflow-y-auto bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        {localViewers.map((viewer) => (
                          <li key={viewer.id} className={`py-3 px-3 flex justify-between items-center group hover:bg-gray-100 dark:hover:bg-gray-700 ${viewer.id.startsWith('temp-') ? 'animate-pulse opacity-60' : ''}`}>
                            <span className="text-sm text-gray-800 dark:text-gray-200">{viewer.viewerName}</span>
                            <button
                              onClick={() => handleRemoveViewer(viewer.id, viewer.viewerName)}
                              disabled={isSubmitting || viewer.id.startsWith('temp-')}
                              className="text-xs text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 disabled:opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center cursor-pointer"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                              Remover
                            </button>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="text-sm text-gray-500 dark:text-gray-400 py-8 text-center bg-gray-50 dark:bg-gray-700/50 rounded-lg border-2 border-dashed border-gray-200 dark:border-gray-600">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mx-auto mb-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <p>Nenhum viewer adicionado a este estado</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent bg-gray-100 dark:bg-gray-700 px-4 py-2 text-sm font-medium text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 transition-colors cursor-pointer"
                    onClick={onClose}
                  >
                    Fechar
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
