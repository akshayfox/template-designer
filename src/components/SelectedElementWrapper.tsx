import React from 'react';
import { Element } from '../types/editor';

interface SelectedElementWrapperProps {
  element: Element;
  children: React.ReactNode;
  onResize: (elementId: string, newSize: { width: number; height: number }) => void;
}

const SelectedElementWrapper: React.FC<SelectedElementWrapperProps> = ({ 
  element, 
  children,
  onResize 
}) => {
  const handleResize = (deltaX: number, deltaY: number, corner: string) => {
    let newSize = { width: element.style.width, height: element.style.height };
    let newPosition = { x: element.style.x, y: element.style.y };
  
    switch (corner) {
      case 'nw':
        newSize.width -= deltaX;
        newSize.height -= deltaY;
        newPosition.x += deltaX;
        newPosition.y += deltaY;
        break;
      case 'ne':
        newSize.width += deltaX;
        newSize.height -= deltaY;
        newPosition.y += deltaY;
        break;
      case 'se':
        newSize.width += deltaX;
        newSize.height += deltaY;
        break;
      case 'sw':
        newSize.width -= deltaX;
        newSize.height += deltaY;
        newPosition.x += deltaX;
        break;
    }
  
    // Ensure minimum size
    newSize.width = Math.max(newSize.width, 20);
    newSize.height = Math.max(newSize.height, 20);
  
    // Update the element size and position
    onResize(element.id, { ...newSize, ...newPosition });
  };
  

  const ResizeHandle = ({ corner, position }: { corner: string; position: string }) => (
    <div
      className={`absolute w-3 h-3 bg-blue-500 rounded-full ${position} cursor-${corner}-resize`}
      onMouseDown={(e) => {
        e.stopPropagation();
        const startX = e.clientX;
        const startY = e.clientY;

        const handleMouseMove = (moveEvent: MouseEvent) => {
          const deltaX = moveEvent.clientX - startX;
          const deltaY = moveEvent.clientY - startY;
          handleResize(deltaX, deltaY, corner);
        };

        const handleMouseUp = () => {
          document.removeEventListener('mousemove', handleMouseMove);
          document.removeEventListener('mouseup', handleMouseUp);
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
      }}
    />
  );

  return (
    <div className="relative" style={{ width: element.style.width, height: element.style.height }}>
      {children}
      <ResizeHandle corner="nw" position="top-0 left-0" />
      <ResizeHandle corner="ne" position="top-0 right-0" />
      <ResizeHandle corner="se" position="bottom-0 right-0" />
      <ResizeHandle corner="sw" position="bottom-0 left-0" />
    </div>
  );
};

export default SelectedElementWrapper;