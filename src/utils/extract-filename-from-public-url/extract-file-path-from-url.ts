export function extractFilePathFromUrl(url: string): { bucketName: string; path: string } {
  const urlObj = new URL(url);
  const path = urlObj.pathname;

  // Extract the path after '/public/'
  const publicIndex = path.indexOf("/public/") + 8;
  const restOfPath = path.substring(publicIndex);

  // Find the first '/' after '/public/' to get the bucket name end position
  const bucketEndIndex = restOfPath.indexOf("/");

  // Extract the bucket name and path
  const bucketName = restOfPath.substring(0, bucketEndIndex);
  const filePath = restOfPath.substring(bucketEndIndex + 1);

  // Return an object with bucketName and path
  return { bucketName, path: filePath };
}