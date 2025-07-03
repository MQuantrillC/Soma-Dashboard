"use client";

import React from 'react';
import { Target, MessageCircle, BarChart2 } from 'lucide-react';

const segments = [
    {
        icon: Target,
        title: 'Tech-Savvy Professionals',
        description: 'Early adopters aged 25-40 who value premium, innovative products. They are active on LinkedIn and follow tech influencers.',
        messaging: 'Highlight cutting-edge features, performance, and design. Use a sophisticated and professional tone.',
    },
    {
        icon: MessageCircle,
        title: 'Students & Young Adults',
        description: 'Ages 18-24 looking for trendy, affordable, and multi-functional devices. Active on Instagram and TikTok.',
        messaging: 'Focus on style, portability, and value. Use vibrant visuals and influencer collaborations.',
    },
    {
        icon: BarChart2,
        title: 'Small Business Owners',
        description: 'Pragmatic buyers who need reliable, long-lasting equipment for their operations. They read industry blogs and forums.',
        messaging: 'Emphasize durability, ROI, and customer support. Use case studies and testimonials.',
    },
];

const SegmentCard = ({ icon: Icon, title, description, messaging }: (typeof segments)[0]) => (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
        <div className="flex items-center mb-4">
            <Icon className="w-8 h-8 mr-4 text-soma-aquamarina" />
            <h3 className="text-lg font-bold font-saira">{title}</h3>
        </div>
        <p className="text-gray-300 mb-4">{description}</p>
        <div className="border-t border-gray-700 pt-4">
            <h4 className="font-semibold text-soma-aquamarina mb-2">Key Messaging</h4>
            <p className="text-gray-400 text-sm">{messaging}</p>
        </div>
    </div>
);

const CustomerSegments = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {segments.map((segment) => (
                <SegmentCard key={segment.title} {...segment} />
            ))}
        </div>
    );
};

export default CustomerSegments; 