export default function formatCpf(cpf: string): string {
    cpf = cpf.replace(/[^0-9]/g, "");
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}
  