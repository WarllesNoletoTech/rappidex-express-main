export interface City {
  id?: string;
  name: string;
  createdAt?: string;
  state?: string;
  clientWhatsappMessage?: string;
  deliveryValue?: string;
  deliveryFeeValue?: number | null;
  monthlyFeeValue?: number | null;
  pixKey?: string;
}
