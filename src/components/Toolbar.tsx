import React, { useState } from 'react';
import { useEditorStore } from '../store/editorStore';
import { 
  Type, 
  Image, 
  Square,
  Circle,
  Triangle, 
  Trash2, 
  Grid, 
  Shapes, 
  Variable,
  FileText,
  Upload,
  Grid3x3,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { nanoid } from 'nanoid';
import { Element } from '../types/editor';

interface ToolbarItem {
  name: string;
  icon: React.ReactNode;
  onClick?: () => void;
  subItems?: ToolbarItem[];
}

interface ToolbarSection {
  title: string;
  icon: React.ReactNode;
  items: ToolbarItem[];
}

const Toolbar: React.FC = () => {
  const { addElement, selectedElement, removeElement } = useEditorStore();
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    Templates: true,
    Elements: true,
    Text: true,
    Uploads: true
  });
  const [expandedSubItems, setExpandedSubItems] = useState<Record<string, boolean>>({});

  const toggleSection = (title: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [title]: !prev[title]
    }));
  };

  const toggleSubItems = (name: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setExpandedSubItems(prev => ({
      ...prev,
      [name]: !prev[name]
    }));
  };

  const addShape = (shapeType: 'rectangle' | 'circle' | 'triangle') => {
    const baseShape: Element = {
      id: nanoid(),
      type: 'shape' as const,
      content: '',
      style: {
        x: 100,
        y: 100,
        width: 100,
        height: 100,
        rotation: 0,
        backgroundColor: '#e2e8f0',
        borderRadius: 0,
      },
    };
  
    switch (shapeType) {
      case 'circle':
        addElement({
          ...baseShape,
          style: {
            ...baseShape.style,
            borderRadius: '50%', 
          },
        });
        break;
      case 'triangle':
        addElement({
          ...baseShape,
          style: {
            ...baseShape.style,
            clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
          } as any,
        });
        break;
      default: // rectangle
        addElement(baseShape);
        break;
    }
  };
  
  const addText = (isPlaceholder = false) => {
    const element: Element = {
      id: nanoid(),
      type: 'text',
      content: isPlaceholder ? '{{columnName}}' : 'Double click to edit',
      style: {
        x: 100,
        y: 100,
        width: 200,
        height: 50,
        rotation: 0,
        fontSize: 16,
        color: isPlaceholder ? '#2563eb' : '#000000',
        backgroundColor: isPlaceholder ? '#dbeafe' : undefined,
      },
    };
    addElement(element);
  };

  const addImage = () => {
    const element: Element = {
      id: nanoid(),
      type: 'image',
      content: '/api/placeholder/400/320',
      style: {
        x: 100,
        y: 100,
        width: 200,
        height: 200,
        rotation: 0,
      },
    };
    addElement(element);
  };

  const toolbarSections: ToolbarSection[] = [
    {
      title: 'Templates',
      icon: <Grid className="w-5 h-5" />,
      items: [
        { name: 'All templates', icon: <Grid3x3 className="w-4 h-4" /> }
      ]
    },
    {
      title: 'Elements',
      icon: <Shapes className="w-5 h-5" />,
      items: [
        { 
          name: 'Shapes', 
          icon: <Square className="w-4 h-4" />,
          subItems: [
            { 
              name: 'Rectangle', 
              icon: <Square className="w-4 h-4" />,
              onClick: () => addShape('rectangle')
            },
            { 
              name: 'Circle', 
              icon: <Circle className="w-4 h-4" />,
              onClick: () => addShape('circle')
            },
            { 
              name: 'Triangle', 
              icon: <Triangle className="w-4 h-4" />,
              onClick: () => addShape('triangle')
            },
          ]
        },
        { 
          name: 'Add image', 
          icon: <Image className="w-4 h-4" />,
          onClick: addImage 
        },
      ]
    },
    {
      title: 'Text',
      icon: <Type className="w-5 h-5" />,
      items: [
        { 
          name: 'Add text', 
          icon: <FileText className="w-4 h-4" />,
          onClick: () => addText(false)
        },
        { 
          name: 'Add placeholder', 
          icon: <Variable className="w-4 h-4" />,
          onClick: () => addText(true)
        },
      ]
    },
    {
      title: 'Uploads',
      icon: <Upload className="w-5 h-5" />,
      items: []
    },
  ];

  return (
    <div className="flex flex-col h-full bg-white">
      {toolbarSections.map((section) => (
        <div key={section.title} className="border-b border-gray-200">
          <button
            onClick={() => toggleSection(section.title)}
            className="w-full p-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-2 text-gray-700">
              {section.icon}
              <span className="font-medium text-sm">{section.title}</span>
            </div>
            {expandedSections[section.title] ? (
              <ChevronDown className="w-4 h-4 text-gray-400" />
            ) : (
              <ChevronRight className="w-4 h-4 text-gray-400" />
            )}
          </button>
          {expandedSections[section.title] && (
            <div className="px-2 pb-2">
              {section.items.map((item) => (
                <div key={item.name}>
                  <button
                    onClick={item.subItems ? 
                      (e) => toggleSubItems(item.name, e) : 
                      item.onClick
                    }
                    className="w-full p-2 hover:bg-gray-50 rounded-lg flex items-center justify-between text-sm text-gray-700 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      {item.icon}
                      {item.name}
                    </div>
                    {item.subItems && (
                      expandedSubItems[item.name] ? 
                        <ChevronDown className="w-4 h-4 text-gray-400" /> :
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                    )}
                  </button>
                  {item.subItems && expandedSubItems[item.name] && (
                    <div className="ml-4">
                      {item.subItems.map((subItem) => (
                        <button
                          key={subItem.name}
                          onClick={subItem.onClick}
                          className="w-full p-2 hover:bg-gray-50 rounded-lg flex items-center gap-2 text-sm text-gray-700 transition-colors"
                        >
                          {subItem.icon}
                          {subItem.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      {selectedElement && (
        <div className="mt-auto p-2 border-t border-gray-200">
          <button
            onClick={() => removeElement(selectedElement.id)}
            className="w-full p-2 hover:bg-red-50 text-red-600 rounded-lg flex items-center gap-2 text-sm transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Delete element
          </button>
        </div>
      )}
    </div>
  );
};

export default Toolbar;