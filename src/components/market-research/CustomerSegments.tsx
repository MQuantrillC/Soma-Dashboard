"use client";

import React from 'react';
import { Briefcase, HeartPulse, ShieldCheck, Target } from 'lucide-react';

const segments = [
    {
        icon: Briefcase,
        title: 'Executives',
        coreNeeds: [
            'Stay sharp and perform under pressure',
            'Integrate seamlessly into a busy, smart-device-heavy lifestyle',
            'Reduce mental fatigue, track recovery effortlessly'
        ],
        keywords: ['Discreet', 'Efficiency', 'Non-intrusive', 'Data-driven'],
        messagingPhrases: [
            'Optimize your most valuable asset: yourself.',
            'Master your day, discreetly.',
            'Data that works behind the scenes — just like you.'
        ],
        somaFit: [
            '5–7 day battery life, no screen clutter',
            'Minimal design that fits business attire',
            'Integrates with Apple/Android ecosystems'
        ]
    },
    {
        icon: HeartPulse,
        title: 'Athletes',
        coreNeeds: [
            'Improve recovery, optimize performance',
            'Track effort, fatigue, and strain daily',
            'Make data-informed training decisions'
        ],
        keywords: ['Performance', 'Intensity', 'Progression', 'Gains'],
        messagingPhrases: [
            'Train smarter. Recover faster.',
            'Unlock your next level.',
            'Gain the competitive edge — on and off the field.'
        ],
        somaFit: [
            'Continuous tracking with no distractions',
            'Accurate HRV, RHR, and recovery insights',
            'Durable and comfortable for daily wear'
        ]
    },
    {
        icon: Target,
        title: 'Health-Conscious Individuals',
        coreNeeds: [
            'Daily health tracking and lifestyle optimization',
            'Preventative care, long-term wellness, data-driven decisions',
            'Manage sleep, stress, and chronic conditions'
        ],
        keywords: ['Personalized', 'Preventative', 'Insights'],
        messagingPhrases: [
            'Understand your body. Live better.',
            'Discover your personal balance.',
            'Effortless insights for a healthier you.'
        ],
        somaFit: [
            'HRV, sleep, temperature, stress tracking',
            'A seamless partner for long-term wellness',
            '5–7 day battery life, minimalist comfort'
        ]
    }
];

const generalAngles = [
    'Highly competitive pricing compared to leading rings and smartwatches',
    "Discreet wearables for users who don't want bulky, flashy, or screen-heavy devices",
    'Ideal for non-watch users or those tired of smartwatch distractions',
    'All-day comfort and screen-free health tracking'
];

const SegmentCard = ({ icon: Icon, title, coreNeeds, messagingPhrases, somaFit }: (typeof segments)[0]) => (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col">
        <div className="flex items-center mb-4">
            <Icon className="w-8 h-8 mr-4 text-soma-aquamarina" />
            <h3 className="text-xl font-bold font-saira">{title}</h3>
        </div>
        <div className="space-y-4 flex-grow">
            <div>
                <h4 className="font-bold text-soma-aquamarina/90 mb-2">Core Needs</h4>
                <ul className="list-disc list-inside text-gray-300 space-y-1">
                    {coreNeeds.map((need) => <li key={need}>{need}</li>)}
                </ul>
            </div>
            <div>
                <h4 className="font-bold text-soma-aquamarina/90 mb-2">Key Messaging</h4>
                <div className="space-y-2">
                    {messagingPhrases.map((phrase) => (
                        <p key={phrase} className="italic text-gray-400">"{phrase}"</p>
                    ))}
                </div>
            </div>
            <div>
                <h4 className="font-bold text-soma-aquamarina/90 mb-2">Why SOMA Fits</h4>
                <ul className="list-disc list-inside text-gray-300 space-y-1">
                    {somaFit.map((fit) => <li key={fit}>{fit}</li>)}
                </ul>
            </div>
        </div>
    </div>
);

const CustomerSegments = () => {
    return (
        <div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {segments.map((segment) => (
                    <SegmentCard key={segment.title} {...segment} />
                ))}
            </div>

            <div className="mt-12 bg-gray-800 p-6 rounded-lg shadow-lg">
                <div className="flex items-center mb-4">
                    <ShieldCheck className="w-8 h-8 mr-4 text-soma-aquamarina" />
                    <h3 className="text-xl font-bold font-saira">General Marketing Angles</h3>
                </div>
                <ul className="list-disc list-inside text-gray-300 space-y-2">
                    {generalAngles.map((angle) => (
                        <li key={angle}>{angle}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default CustomerSegments; 