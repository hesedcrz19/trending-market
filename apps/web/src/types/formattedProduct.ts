import type { ShorterText } from '@/utils/shortenText';
import type { PROMOTIONS } from '@trending-market/shared';

export interface FormattedProduct {
  id: string;
  title: ShorterText;
  slug: string;
  description: ShorterText;
  numericPrice: number;
  price: string;
  originalPrice: string;
  discountPercentage: number;
  shippingCost: { cost: string; text: string };
  promotion: (typeof PROMOTIONS)[number] | null;
  principalImage: string | null;
  images: string[];
  category: {
    id: string;
    name: ShorterText;
    slug: string;
    image: string;
  };
  rating: number;
}
