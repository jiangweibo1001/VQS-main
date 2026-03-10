
import { Offer } from './types';

export const OFFERS: Offer[] = [
  {
    id: '1',
    name: 'Direct Internet Access',
    description: 'High-speed dedicated fiber connectivity with 99.99% uptime guarantee and symmetrical bandwidth options up to 10Gbps.',
    category: 'Connectivity',
    otc: 500,
    rc: 1200,
    rcUnit: '/mo',
    icon: 'router',
    type: 'partner',
    badge: 'Partner Offer'
  },
  {
    id: '2',
    name: 'Azure ExpressRoute',
    description: 'A dedicated private connection between your on-premises infrastructure and Microsoft Azure data centers.',
    category: 'Connectivity',
    otc: 0,
    rc: 850,
    rcUnit: '/mo',
    icon: 'cloud_sync',
    type: 'partner',
    badge: 'Partner Offer'
  },
  {
    id: '3',
    name: 'Endpoint Security Suite',
    description: 'Advanced threat protection with AI-driven analytics, encompassing antivirus, EDR, and mobile device security.',
    category: 'Security',
    otc: 200,
    rc: 45,
    rcUnit: '/user',
    icon: 'verified_user',
    type: 'standard',
    badge: 'Best Seller'
  },
  {
    id: '4',
    name: 'SD-WAN Pro',
    description: 'Software-defined networking for enterprise-wide control, visibility, and enhanced performance across multi-cloud.',
    category: 'Connectivity',
    otc: 750,
    rc: 325,
    rcUnit: '/site',
    icon: 'settings_input_antenna',
    type: 'standard'
  },
  {
    id: '5',
    name: 'Global SIP Trunking',
    description: 'Scalable VoIP infrastructure for global businesses, supporting hundreds of concurrent channels and HD voice.',
    category: 'Voice',
    otc: 150,
    rc: 12,
    rcUnit: '/channel',
    icon: 'settings_phone',
    type: 'partner',
    badge: 'Partner Offer'
  },
  {
    id: '6',
    name: '24/7 Premium Support',
    description: 'Dedicated account manager and round-the-clock technical assistance with 15-minute response SLA.',
    category: 'Service',
    otc: 0,
    rc: 300,
    rcUnit: '/mo',
    icon: 'support_agent',
    type: 'addon'
  },
  {
    id: '7',
    name: 'Cloud Security Suite',
    description: 'Comprehensive cloud-native security offering advanced protection for your distributed workloads.',
    category: 'Security',
    otc: 0,
    rc: 299,
    rcUnit: '/mo',
    icon: 'lock',
    type: 'partner',
    badge: 'Partner Offer'
  }
];
