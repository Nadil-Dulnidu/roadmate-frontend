export type PaymentInput = {
  amount: number;
};

export type FormData = {
  customerName: string;
  customerEmail: string;
};

export interface Payment {
  readonly payment_id?: number,
  stripe_id: string,
  booking_id: number,
  user_id: string,
  amount: number,
  status: string,
  date: string
}
