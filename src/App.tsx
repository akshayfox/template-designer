import React, { useEffect, useState } from "react";
import { useEditorStore } from "./store/editorStore";
import Canvas from "./components/Canvas";
import Toolbar from "./components/Toolbar";
import PropertyPanel from "./components/PropertyPanel";
import {
  Menu,
  Search,
  Download,
  Share2,
  Undo,
  Redo,
  Plus,
  ChevronDown,
  Home,
} from "lucide-react";
import ZoomableCanvas from "./components/ZoomableCanvas ";

const App = () => {
  const { setActiveTemplate } = useEditorStore();
  const [isZoomed, setIsZoomed] = useState(false);

  useEffect(() => {
    setActiveTemplate({
      id: "1",
      name: "Untitled Design",
      elements: [],
      canvasSize: { width: 400, height: 500 },
    });
  }, [setActiveTemplate]);

  return (
    <div className="min-h-screen bg-white">
      {/* Top Navigation Bar */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="flex items-center h-14 px-4">
          {/* Left Section */}
          <div className="flex items-center space-x-3 flex-1">
            <button className="p-2 hover:bg-purple-50 rounded-lg">
              <Home className="w-5 h-5 text-purple-700" />
            </button>
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-gray-700">
                Untitled Design
              </span>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </div>
          </div>

          {/* Center Section */}
          <div className="flex items-center space-x-2 flex-1 justify-center">
            <button className="p-2 hover:bg-gray-100 rounded-lg" title="Undo">
              <Undo className="w-4 h-4 text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg" title="Redo">
              <Redo className="w-4 h-4 text-gray-600" />
            </button>
            <div className="mx-4">
              <select className="bg-white border border-gray-200 rounded-md px-2 py-1 text-sm">
                <option>100%</option>
                <option>75%</option>
                <option>50%</option>
              </select>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-3 flex-1 justify-end">
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <Share2 className="w-5 h-5 text-gray-600" />
            </button>
            <button className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors">
              Download
            </button>
          </div>
        </div>

        {/* Secondary Navigation */}
        <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <button className="px-3 py-1 text-sm text-gray-700 hover:bg-white rounded-md transition-colors">
              File
            </button>
            <button className="px-3 py-1 text-sm text-gray-700 hover:bg-white rounded-md transition-colors">
              Edit
            </button>
            <button className="px-3 py-1 text-sm text-gray-700 hover:bg-white rounded-md transition-colors">
              View
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex h-[calc(100vh-104px)]">
        {/* Left Sidebar */}
        <div className="w-[300px] bg-white border-r border-gray-200 flex flex-col">
          {/* Search Bar */}
          <div className="p-4 border-b border-gray-200">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search elements..."
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Toolbar Content */}
          <div className="flex-1 overflow-y-auto">
            <Toolbar />
          </div>
        </div>

        {/* Canvas Area */}
        {/* <ZoomableCanvas>
        <div className="flex-1 bg-gray-100 overflow-auto">
          <div className="h-full w-full flex items-center justify-center p-8">
              <div
                className={`bg-white rounded-lg shadow-xl transition-transform duration-200 ${
                  isZoomed ? "scale-90" : "scale-100"
                }`}>
                <Canvas />
              </div>
          </div>
        </div>
        </ZoomableCanvas> */}
         <div className="flex-1 bg-gray-100 ">
          <ZoomableCanvas>
            <div className="bg-white rounded-lg shadow-xl ">
              <Canvas />
            </div>
          </ZoomableCanvas>
        </div>

     

        {/* Right Sidebar */}
        <div className="w-[300px] bg-white border-l border-gray-200">
          <PropertyPanel />
        </div>
      </main>
    </div>
  );
};

export default App;
