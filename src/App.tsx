import React, { useEffect } from 'react';
import { useEditorStore } from './store/editorStore';
import Canvas from './components/Canvas';
import Toolbar from './components/Toolbar';
import PropertyPanel from './components/PropertyPanel';

const App: React.FC = () => {
  const { setActiveTemplate } = useEditorStore();

  useEffect(() => {
    setActiveTemplate({
      id: '1',
      name: 'Untitled Design',
      elements: [],
      canvasSize: {
        width: 400,
        height: 500,
      },
    });
  }, [setActiveTemplate]);

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-[1920px] mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-900">Template Designer</h1>
        </div>
      </header>

      <main className="max-w-[1920px] mx-auto p-4">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="w-full  lg:w-64 order-1 lg:order-none">
            <Toolbar />
          </div>
          
          <div className="flex-1 order-3 lg:order-none flex justify-center items-center overflow-auto">
            <div className="bg-gray-50 p-4 lg:p-8 rounded-lg shadow-inner min-w-full h-full flex justify-center items-center">
              <Canvas />
            </div>
          </div>
          
          <div className="w-full lg:w-64 order-2 lg:order-none">
            <PropertyPanel />
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;