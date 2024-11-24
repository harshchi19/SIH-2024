"use client";

import { useLanguage } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";
import { Upload, Check, X, Eye, Trash2, FileText } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const UploadDocument = () => {
  const { dict } = useLanguage();
  const [documentFiles, setDocumentFiles] = useState([]);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    const filesWithPreviews = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      id: Math.random().toString(36).substring(7),
    }));
    setDocumentFiles((prev) => [...prev, ...filesWithPreviews]);
  };

  const triggerFileInput = () => fileInputRef.current.click();

  const handleRemoveFile = (idToRemove) => {
    setDocumentFiles((prev) => {
      const newFiles = prev.filter(({ id }) => id !== idToRemove);
      // Clean up the URL object
      const removedFile = prev.find(({ id }) => id === idToRemove);
      if (removedFile) {
        URL.revokeObjectURL(removedFile.preview);
      }
      return newFiles;
    });
    // Close preview if the removed file was being previewed
    if (previewUrl) {
      setPreviewUrl(null);
    }
  };

  const handlePreview = (preview) => {
    setPreviewUrl(previewUrl === preview ? null : preview);
  };

  // Clean up URLs when component unmounts
  useEffect(() => {
    return () => {
      documentFiles.forEach(({ preview }) => URL.revokeObjectURL(preview));
    };
  }, []);

  return (
    <div className="flex flex-col items-start w-full">
      <h1 className="text-xl font-semibold">
        1. {dict?.pre_therapy?.document}
      </h1>

      <div className="mt-5 w-full border-2 border-dashed rounded-lg p-6 text-center hover:bg-gray-100">
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileUpload}
          multiple
          accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
        />
        <Button
          variant="outline"
          onClick={triggerFileInput}
          className="flex items-center justify-center w-full space-x-2"
        >
          <Upload className="mr-2" />
          {dict?.pre_therapy?.upload_doc}
        </Button>
        <p className="mt-2 text-sm text-gray-500">
          {dict?.pre_therapy?.drag_n_drop}
        </p>
      </div>

      {documentFiles.length > 0 && (
        <div className="mt-6 w-full">
          <h2 className="text-lg font-medium mb-3">
            {dict?.pre_therapy?.uploaded_docs}
          </h2>
          <div className="space-y-3">
            {documentFiles.map(({ file, preview, id }) => (
              <div
                key={id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border"
              >
                <div className="flex items-center space-x-3">
                  <Check className="text-green-500 w-5 h-5" />
                  <span className="text-sm font-medium">{file.name}</span>
                  <span className="text-xs text-gray-500">
                    ({(file.size / 1024 / 1024).toFixed(2)} MB)
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handlePreview({ file, preview })}
                    className="p-2"
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveFile(id)}
                    className="p-2 text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {previewUrl && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg max-w-3xl max-h-[90vh]">
            <div className="flex items-center justify-between mb-2 mt-1 px-1">
              <div className="flex-row-center gap-x-2">
                <FileText />
                <h2 className="text-lg font-semibold text-black">
                  {previewUrl.file.name}
                </h2>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setPreviewUrl(null)}
                className="p-2"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex-1 min-h-0 p-4">
              {previewUrl.file.type.startsWith("image") ||
              previewUrl.file.type.match(/\.(jpg|jpeg|png|gif)$/i) ? (
                <img
                  src={previewUrl.preview}
                  alt="Preview"
                  className="max-w-full h-auto rounded-md"
                />
              ) : (
                <iframe
                  src={previewUrl.preview}
                  className="w-full h-[80vh]"
                  title="File preview"
                />
              )}
            </div>
          </div>
        </div>
      )}

      {documentFiles.length > 0 && (
        <Alert className="mt-4">
          <AlertDescription>
            {documentFiles.length} {dict?.pre_therapy?.files_proc}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default UploadDocument;
