export default function formatCnpj(cnpj: string): string {
    cnpj = cnpj.replace(/[^0-9]/g, "");
  
    return cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
}
  