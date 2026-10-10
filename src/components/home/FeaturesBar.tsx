import { Truck, RotateCcw, ShieldCheck, Headphones } from 'lucide-react';

interface FeatureItem {
  id: number;
  icon: React.ElementType;
  title: string;
  description: string;
}

const features: FeatureItem[] = [
  {
    id: 1,
    icon: Truck,
    title: 'Free Shipping',
    description: 'On orders over 500 EGP',
  },
  {
    id: 2,
    icon: RotateCcw,
    title: 'Easy Returns',
    description: '14-day return policy',
  },
  {
    id: 3,
    icon: ShieldCheck,
    title: 'Secure Payment',
    description: '100% secure checkout',
  },
  {
    id: 4,
    icon: Headphones,
    title: '24/7 Support',
    description: 'Contact us anytime',
  },
];

export default function FeaturesBar() {
  return (
    <section className="w-full bg-[#f0fdf4] border-y border-emerald-100/60 py-8 my-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.id}
                className="flex items-center gap-4 p-2 transition-transform hover:-translate-y-0.5 duration-200"
              >
                {/* Icon Container with soft green background */}
                <div className="w-12 h-12 rounded-2xl bg-[#dcfce7] flex items-center justify-center shrink-0">
                  <Icon className="w-6 h-6 text-[#0aad0a]" />
                </div>

                {/* Text Content */}
                <div className="flex flex-col justify-center">
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                    {feature.title}
                  </h3>
                  <p className="text-xs text-gray-500 font-normal mt-0.5">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}