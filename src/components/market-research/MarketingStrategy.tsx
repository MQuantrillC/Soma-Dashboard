"use client";

import React from 'react';
import { BookOpen, FileText, Users, Activity } from 'lucide-react';

const strategies = [
    {
        icon: BookOpen,
        title: 'A Day with SOMA',
        summary: 'Real-life use case storytelling to illustrate the user experience.',
        content: [
            'Starts the day with a sleep score and readiness insight.',
            'Receives calming feedback after a high-stress HRV spike at work.',
            'Sees trends building in the app over time (no screen-checking).',
            'Feels less digitally overloaded than with a smartwatch.',
            'Ends the day with a clear rest prep routine and no buzzing distractions.'
        ],
        emphasis: [
            'Mental clarity from fewer notifications.',
            'Physical comfort and passive insight.',
            'Integrates into a modern day without being disruptive.'
        ]
    },
    {
        icon: FileText,
        title: 'The SOMA Insights Blog',
        summary: 'Science-driven content to establish thought leadership and drive organic traffic.',
        content: [
            'Targeted blog posts on HRV, sleep, temperature tracking, recovery, and stress.',
            'SEO-targeted keywords in both Spanish and English.',
            'Use expert voices when possible.'
        ],
        examples: [
            '¿Qué es el HRV y por qué importa para tu salud?',
            'Cómo dormir mejor sin usar un smartwatch',
            'Temperatura corporal y señales de fatiga'
        ]
    },
    {
        icon: Users,
        title: 'Strategic Health Partnerships',
        summary: 'Collaborate with trusted Peruvian health professionals to build credibility.',
        content: [
            'Collaborate with trusted health professionals (nutritionists, psychologists, sleep specialists).',
            'Use quotes, guest blogs, or in-app insights.',
            'Offer early access to partners to build trust and word-of-mouth.',
            'Include in content and referrals: "Data reviewed by Dr. …"'
        ]
    },
    {
        icon: Activity,
        title: 'Community Activation: Wellness Events',
        summary: 'Sponsor small-scale wellness events to build hyper-local trust.',
        content: [
            'Sponsor events for running clubs, yoga/meditation collectives, etc.',
            'Provide SOMA demos, discount codes, or HRV workshops.'
        ],
        outcome: [
            'Targeted engagement with high-fit users.',
            'Authentic exposure in real environments.',
            'Ideal for brand association with daily wellness.'
        ]
    }
];

const StrategyCard = ({ card }: { card: (typeof strategies)[0] }) => (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col h-full">
        <div className="flex items-center mb-4">
            <card.icon className="w-8 h-8 mr-4 text-soma-aquamarina" />
            <h3 className="text-xl font-bold font-saira">{card.title}</h3>
        </div>
        <p className="text-gray-400 italic mb-4">{card.summary}</p>
        <div className="space-y-2 text-gray-300 flex-grow">
            <ul className="list-disc list-inside space-y-1">
                {card.content.map(item => <li key={item}>{item}</li>)}
            </ul>
            {card.emphasis && (
                <div className="pt-2">
                    <h4 className="font-bold text-soma-aquamarina/90 mb-2">Emphasis</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                         {card.emphasis.map(item => <li key={item}>{item}</li>)}
                    </ul>
                </div>
            )}
            {card.examples && (
                <div className="pt-2">
                    <h4 className="font-bold text-soma-aquamarina/90 mb-2">Example Titles</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm italic">
                         {card.examples.map(item => <li key={item}>"{item}"</li>)}
                    </ul>
                </div>
            )}
            {card.outcome && (
                <div className="pt-2">
                    <h4 className="font-bold text-soma-aquamarina/90 mb-2">Outcome</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                         {card.outcome.map(item => <li key={item}>{item}</li>)}
                    </ul>
                </div>
            )}
        </div>
    </div>
);


const MarketingStrategy = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {strategies.map((strategy) => (
                <StrategyCard key={strategy.title} card={strategy} />
            ))}
        </div>
    );
};

export default MarketingStrategy; 