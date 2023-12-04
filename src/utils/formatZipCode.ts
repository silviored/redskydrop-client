export default function formatZipCode(zipCode: string): string {
  zipCode = zipCode.replace(/[^0-8]/g, "");
  
    return zipCode.replace(/(.{5})(.{3})/, "$1-$2");
  }