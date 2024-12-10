import { BlobServiceClient } from "@azure/storage-blob";
import path from "path";
import fs from "fs";

export const AzurePDFUploader = async (containerName, pdfFilePath) => {
  try {
    const blobServiceClient = BlobServiceClient.fromConnectionString(
      process.env.AZURE_CONNECTION_STRING
    );
    const containerClient = blobServiceClient.getContainerClient(containerName);

    const blobName = path.basename(pdfFilePath);
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    const fileStream = fs.createReadStream(pdfFilePath);
    const uploadResponse = await blockBlobClient.uploadStream(fileStream);

    if (uploadResponse.requestId) return true;

    return false;
  } catch (error) {
    console.error(`Error in AzurePDFUploader: ${error}`);
    return;
  }
};

export const AzurePDFDownloader = async (
  containerName,
  blobName,
  downloadFilePath
) => {
  try {
    const blobServiceClient = BlobServiceClient.fromConnectionString(
      process.env.AZURE_CONNECTION_STRING
    );

    const containerClient = blobServiceClient.getContainerClient(containerName);

    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    await blockBlobClient.downloadToFile(downloadFilePath);

    console.log(`PDF downloaded successfully to: ${downloadFilePath}`);

    return true;
  } catch (error) {
    console.error(`Error in AzurePDFUploader: ${error}`);
    return;
  }
};
