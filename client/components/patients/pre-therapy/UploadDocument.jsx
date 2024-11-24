import { useLanguage } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";
import { Upload, Check } from "lucide-react";
import { useState, useRef } from "react";

const UploadDocument = () => {
  const { dict } = useLanguage();

  const [documentFile, setDocumentFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    setDocumentFile(file);
  };

  const triggerFileInput = () => fileInputRef.current.click();

  const handleSubmit = () => {
    console.log("Form Data:", formData);
    console.log("Uploaded File:", documentFile);
  };

  return (
    <div className="flex flex-col items-start">
      <h1 className="text-xl font-semibold">
        1. {dict?.pre_therapy?.document}
      </h1>

      <div className="mt-5 w-full border-2 border-dashed rounded-lg p-6 text-center hover:bg-gray-100">
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileUpload}
        />
        <Button
          variant="outline"
          onClick={triggerFileInput}
          className="flex items-center justify-center w-full space-x-2"
        >
          <Upload className="mr-2" />
          {documentFile ? (
            <>
              <Check className="text-green-500 mr-2" />
              {documentFile.name}
            </>
          ) : (
            "Upload Document"
          )}
        </Button>
        <p className="mt-2 text-sm text-gray-500">
          {documentFile
            ? "Document uploaded successfully!"
            : "Drag & drop or click to upload a document"}
        </p>
      </div>
    </div>
  );
};

export default UploadDocument;
