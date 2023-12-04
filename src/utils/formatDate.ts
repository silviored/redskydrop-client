export default function formatDate(date: string): string {
    date = date.replace(/[^0-9-]/g, "");
  
    const day = date.substring(0, 2);
    const month = date.substring(2, 4);
    const year = date.substring(4);
  
    return `${day}/${month}/${year}`;
  }
  