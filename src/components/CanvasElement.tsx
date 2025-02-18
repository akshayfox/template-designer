import React, { useState, useEffect } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { Element } from '../types/editor';
import { useEditorStore } from '../store/editorStore';

interface Props {
  element: Element;
}

const CanvasElement: React.FC<Props> = ({ element }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: element.id,
  });
  const { selectedElement, setSelectedElement, updateElement } = useEditorStore();
  const [isEditing, setIsEditing] = useState(false);
  const [isResizing, setIsResizing] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isResizing) return;
      const target = event.target as HTMLElement;
      if (!target.closest(`[data-element-id="${element.id}"]`)) {
        setSelectedElement(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [element.id, setSelectedElement, isResizing]);

  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    position: 'absolute' as const,
    top: element.style.y,
    left: element.style.x,
    width: element.style.width,
    height: element.style.height,
    rotate: `${element.style.rotation}deg`,
    fontSize: `${element.style.fontSize}px`,
    color: element.style.color,
    backgroundColor: element.style.backgroundColor,
    borderRadius: element.style.borderRadius,
    // clipPath: element.style.clipPath,
  };

  const isSelected = selectedElement?.id === element.id;

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (element.type === 'text') {
      setIsEditing(true);
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateElement(element.id, { content: e.target.value });
  };

  const handleBlur = () => {
    setIsEditing(false);
  };

  const handleResize = (initialEvent: MouseEvent, corner: string) => {
    const startX = initialEvent.clientX;
    const startY = initialEvent.clientY;
    const startWidth = element.style.width;
    const startHeight = element.style.height;
    const startLeft = element.style.x;
    const startTop = element.style.y;
    
    const handleMouseMove = (moveEvent: MouseEvent) => {
      moveEvent.preventDefault();
      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;
      
      let newWidth = startWidth;
      let newHeight = startHeight;
      let newX = startLeft;
      let newY = startTop;

      // Calculate new dimensions based on which corner is being dragged
      switch (corner) {
        case 'nw':
          newWidth = Math.max(20, startWidth - deltaX);
          newHeight = Math.max(20, startHeight - deltaY);
          newX = startLeft + (startWidth - newWidth);
          newY = startTop + (startHeight - newHeight);
          break;
        case 'ne':
          newWidth = Math.max(20, startWidth + deltaX);
          newHeight = Math.max(20, startHeight - deltaY);
          newY = startTop + (startHeight - newHeight);
          break;
        case 'se':
          newWidth = Math.max(20, startWidth + deltaX);
          newHeight = Math.max(20, startHeight + deltaY);
          break;
        case 'sw':
          newWidth = Math.max(20, startWidth - deltaX);
          newHeight = Math.max(20, startHeight + deltaY);
          newX = startLeft + (startWidth - newWidth);
          break;
      }

      updateElement(element.id, {
        style: {
          ...element.style,
          width: newWidth,
          height: newHeight,
          x: newX,
          y: newY,
        },
      });
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    setIsResizing(true);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const ResizeHandle = ({ corner, position }: { corner: string; position: string }) => (
    <div
      className={`absolute w-3 h-3 bg-blue-500 rounded-full ${position} cursor-${corner}-resize z-50`}
      onMouseDown={(e) => {
        e.stopPropagation();
        handleResize(e.nativeEvent, corner);
      }}
    />
  );

  return (
    <div
      ref={setNodeRef}
      style={style}
      data-element-id={element.id}
      className={`relative ${isSelected ? 'ring-2 ring-blue-500' : ''} ${
        element.type === 'text' ? 'cursor-text' : 'cursor-move'
      }`}
      onClick={(e) => {
        e.stopPropagation();
        setSelectedElement(element);
      }}
      onDoubleClick={handleDoubleClick}
      {...(isEditing ? {} : { ...listeners, ...attributes })}
    >
      {element.type === 'text' && isEditing ? (
        <textarea
          value={element.content}
          onChange={handleTextChange}
          onBlur={handleBlur}
          className="w-full h-full p-0 border-none bg-transparent resize-none focus:outline-none"
          autoFocus
          style={{
            fontSize: `${element.style.fontSize}px`,
            color: element.style.color,
          }}
        />
      ) : element.type === 'text' ? (
        <p className="m-0 p-0 break-words">{element.content}</p>
      ) : element.type === 'image' ? (
        <img src={element.content} alt="" className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full" />
      )}

      {isSelected && (
        <>
          <ResizeHandle corner="nw" position="top-0 left-0" />
          <ResizeHandle corner="ne" position="top-0 right-0" />
          <ResizeHandle corner="se" position="bottom-0 right-0" />
          <ResizeHandle corner="sw" position="bottom-0 left-0" />
        </>
      )}
    </div>
  );
};

export default CanvasElement;