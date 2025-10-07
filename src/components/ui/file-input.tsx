'use client';

import { useState, useRef, ChangeEvent, DragEvent, ReactNode } from 'react';
import { UploadCloud, File as FileIcon, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './button';
import { Input } from './input';

interface FileInputProps {
  onFileChange: (files: File[]) => void;
  multiple?: boolean;
  className?: string;
  children?: ReactNode;
}

export function FileInput({ onFileChange, multiple = false, className, children }: FileInputProps) {
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newFiles = Array.from(e.dataTransfer.files);
      const updatedFiles = multiple ? [...files, ...newFiles] : [newFiles[0]];
      setFiles(updatedFiles);
      onFileChange(updatedFiles);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      const updatedFiles = multiple ? [...files, ...newFiles] : [newFiles[0]];
      setFiles(updatedFiles);
      onFileChange(updatedFiles);
    }
  };
  
  const handleRemoveFile = (index: number) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);
    onFileChange(newFiles);
  };

  const onButtonClick = () => {
    inputRef.current?.click();
  };

  return (
    <div
      className={cn(
        'relative w-full h-48 border-2 border-dashed border-muted-foreground/30 rounded-lg flex flex-col justify-center items-center text-center p-4 transition-colors',
        { 'bg-accent': dragActive },
        className
      )}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <Input
        ref={inputRef}
        type="file"
        multiple={multiple}
        className="hidden"
        onChange={handleChange}
      />
      
      {files.length > 0 ? (
        <div className="w-full h-full overflow-y-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {files.map((file, i) => (
                    <div key={i} className="relative group bg-muted/50 rounded-md p-2 flex items-center gap-2 text-left">
                        <FileIcon className="h-6 w-6 text-muted-foreground flex-shrink-0" />
                        <div className="flex-grow min-w-0">
                            <p className="text-sm font-medium truncate">{file.name}</p>
                            <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</p>
                        </div>
                         <Button variant="ghost" size="icon" className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100" onClick={() => handleRemoveFile(i)}>
                            <X className="h-4 w-4"/>
                        </Button>
                    </div>
                ))}
            </div>
             <Button size="sm" variant="outline" className="mt-4" onClick={onButtonClick}>Add more files</Button>
        </div>
      ) : (
        <>
            <UploadCloud className="w-10 h-10 text-muted-foreground mb-2" />
            <p className="mb-2 text-sm text-muted-foreground">
                <span className="font-semibold">Click to upload</span> or drag and drop
            </p>
            {children}
            <Button type="button" onClick={onButtonClick} variant="outline" className="mt-4">
                Select Files
            </Button>
        </>
      )}
    </div>
  );
}
