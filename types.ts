
export enum Page {
  OfferSelection = 'offer-selection',
  CreateInquiry = 'create-inquiry',
  Quotation = 'quotation',
  RFQProcessing = 'rfq-processing'
}

export interface Offer {
  id: string;
  name: string;
  description: string;
  category: string;
  otc: number;
  rc: number;
  rcUnit: string;
  icon: string;
  badge?: string;
  type: 'standard' | 'partner' | 'addon';
}

export interface CartItem {
  offer: Offer;
  quantity: number;
}

export interface InquiryForm {
  customerName: string;
  buyingCompany: string;
  subunit: string;
  productHouse: string;
  contactPerson: string;
  techContact: string;
  coveringOfficer: string;
  quoteDueDate: string;
  rfpRef: string;
  projectName: string;
  description: string;
}
