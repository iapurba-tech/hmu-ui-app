export interface UnitAddress {
  addressLine1: string;
  addressLine2?: string;
  city?: string;
  district?: string;
  state?: string;
  postalCode?: string;
}

export interface Unit {
  id: string;
  name: string;
  code: string;
  address: UnitAddress;
  active: boolean;
  type?: string;
}