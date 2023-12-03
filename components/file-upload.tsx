'use client';

import { UploadDropzone } from '@/lib/uploadthing';
import '@uploadthing/react/styles.css';
import Image from 'next/image';

interface FileUploadProps {
  endpoint: 'messageFile' | 'serverImage';
  value: string;
  onChange: (url?: string) => void;
}

const FileUpload = ({ endpoint, value, onChange }: FileUploadProps) => {
  const fileType = value?.split('.').pop();

  if (value && fileType != 'pdf') {
    return (
      <div className="relative h-20 w-20">
        <Image src={value} fill className="rounded-full" alt="Upload" />
      </div>
    );
  }

  return (
    <UploadDropzone
      endpoint={endpoint}
      onClientUploadComplete={(response) => {
        onChange(response?.[0].url);
      }}
      onUploadError={(error: Error) => {
        console.error(error);
      }}
    />
  );
};

export default FileUpload;
