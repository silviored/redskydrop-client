export const DEFAULT_GENDER = {
  masculine: 'Masculino',
  feminine: 'Feminino',
};

export const ORDER_SITUATIONS: Record<string, string> = {
  paid: 'Pago',
  awaiting_payment: 'Aguardando pagamento',
  canceled: 'Cancelado',
};

export const GENDER_OPTIONS: { label: string; value: string }[] =
  Object.entries(DEFAULT_GENDER).map(([key, value]) => ({
    label: value,
    value: key,
  }));

export const TYPES_ACTIVITY_MINOR = ['school', 'nr graduation'];
export const ACTIVITY_STATUS = ['opened', 'confirmed', 'cancelled'];
export const ACTIVITY_STATUS_TRANSLATED = {
  opened: 'Em Aberto',
  confirmed: 'Confirmada',
  cancelled: 'Cancelada',
};
export const SUBSCRIPTION_STATUS_TRANSLATED: Record<SubscriptionStatus, string> = {
  'ativo': 'Ativo',
  'cancelado': 'Cancelado',
  'expirado': 'Expirado',
  'em_aberto': 'Em aberto'
}