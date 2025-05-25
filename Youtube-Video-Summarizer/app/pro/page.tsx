'use client';

import React from 'react';
import { CheckIcon } from '@heroicons/react/20/solid';
import Link from 'next/link';
import Modal from '../components/Modal';

const tiers = [
  {
    name: 'Free',
    id: 'tier-free',
    href: '/',
    priceMonthly: 'Free',
    description: 'A great starting point with essential features.',
    features: [
      'Basic video summary',
      'Limited text length for summarization',
      'Single language support',
      'Text narration available',
      'Basic PDF download options',
      'Limited Video and File Uploads Lengths'
    ],
    featured: false,
  },
  {
    name: 'Pro',
    id: 'tier-pro-1',
    href: '#',
    priceMonthly: '$5',
    description: 'Unlock premium features for an enhanced experience.',
    features: [
      'Enhanced and detailed summaries + Questions',
      'Support for multiple languages',
      'Increased text length limit',
      'Increased file upload limit',
      'Advanced narration options',
      'Customizable PDF downloads (multiple themes)',
    ],
    featured: true,
  },
  {
    name: 'Premium',
    id: 'tier-pro-2',
    href: '#',
    priceMonthly: '$12',
    description: 'Unlock premium features for an enhanced experience.',
    features: [
      'Best Quality Summary and Questions',
      'Support for multiple languages',
      'Increased text length limit',
      'Much higher file upload limit',
      'Advanced narration options',
      'Customizable PDF downloads (multiple themes)',
    ],
    featured: true,
  },
];

function classNames(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

export default function Pricing() {
  return (
    <div className="relative isolate min-h-screen px-6 py-24 sm:py-32 lg:px-8">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 -top-3 -z-10 transform-gpu overflow-hidden px-36 blur-3xl"
      >
        <div
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
          className="mx-auto aspect-[1155/678] w-[72.1875rem] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30"
        />
      </div>
      <div className="mx-auto max-w-4xl text-center">
        <p className="mt-2 text-balance text-5xl font-semibold tracking-tight sm:text-6xl">
          Choose the right plan for you
        </p>
      </div>
      <p className="mx-auto mt-6 max-w-2xl text-pretty text-center text-lg font-medium text-gray-400 sm:text-xl/8">
        Choose an affordable plan that’s packed with the best features for enhancing your work, knowledge and boosting fun.
      </p>
      <div className="mx-auto mt-16 grid max-w-[80rem] grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {tiers.map((tier) => (
          <div
            key={tier.id}
            className={classNames(
              tier.featured ? 'relative bg-gray-900 shadow-2xl' : 'bg-white',
              'rounded-3xl p-8 ring-1 ring-gray-900/10 sm:p-10 flex flex-col justify-between'
            )}
          >
            <div>
              <h3
                id={tier.id}
                className={classNames(
                  tier.featured ? 'text-indigo-400' : 'text-indigo-600',
                  'text-base/7 font-semibold'
                )}
              >
                {tier.name}
                {tier.name === 'Free' && (
                  <span className="text-xs text-gray-400 ml-2">(current plan)</span>
                )}
              </h3>
              <p className="mt-4 flex items-baseline gap-x-2">
                <span
                  className={classNames(
                    tier.featured ? 'text-white' : 'text-gray-900',
                    'text-5xl font-semibold tracking-tight'
                  )}
                >
                  {tier.priceMonthly}
                </span>
                <span
                  className={classNames(
                    tier.featured ? 'text-gray-400' : 'text-gray-500',
                    'text-base'
                  )}
                >
                  /month
                </span>
              </p>
              <p
                className={classNames(
                  tier.featured ? 'text-gray-300' : 'text-gray-600',
                  'mt-6 text-base/7'
                )}
              >
                {tier.description}
              </p>
              <ul
                role="list"
                className={classNames(
                  tier.featured ? 'text-gray-300' : 'text-gray-600',
                  'mt-8 space-y-3 text-sm/6 sm:mt-10'
                )}
              >
                {tier.features.map((feature) => (
                  <li key={feature} className="flex gap-x-3">
                    <CheckIcon
                      aria-hidden="true"
                      className={classNames(
                        tier.featured ? 'text-indigo-400' : 'text-indigo-600',
                        'h-6 w-5 flex-none'
                      )}
                    />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-8 sm:mt-10">
              {tier.featured ? (
                <Modal />
              ) : (
                <Link
                  href={tier.href}
                  aria-describedby={tier.id}
                  className="text-indigo-600 ring-1 ring-inset ring-indigo-200 hover:ring-indigo-300 focus-visible:outline-indigo-600 block rounded-md px-3.5 py-2.5 text-center text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                >
                  Go back
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
