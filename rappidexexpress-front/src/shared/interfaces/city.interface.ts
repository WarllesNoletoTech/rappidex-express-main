export interface City {
  id?: string;
  name: string;
  createdAt?: string;
  state?: string;
  clientWhatsappMessage?: string;
  deliveryValue?: string;
  deliveryFeeValue?: number;
  feeMode?: 'fixed' | 'neighborhood';
  neighborhoodCount?: number;
  monthlyFeeValue?: number;
  pixKey?: string;
}
