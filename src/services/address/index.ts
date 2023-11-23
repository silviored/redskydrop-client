import cep from 'cep-promise';
import type { CEP } from 'cep-promise';

export const getAddressByCEP = async (
  zipCode: string
): Promise<Omit<CEP, 'service'> | undefined> => {
  try {
    const response = await cep(zipCode);

    return response;
  } catch (error) {
    return;
  }
};

export const AddressService = {
  getAddressByCEP,
};
