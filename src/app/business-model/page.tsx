import React from 'react';
import Image from 'next/image';
import { 
    Users, 
    Target, 
    Megaphone, 
    Heart, 
    DollarSign, 
    Activity, 
    Package, 
    Handshake, 
    Receipt 
} from 'lucide-react';

const BusinessModelPage = () => {
    const canvasBlocks = [
        {
            id: 'key-partnerships',
            title: 'Key Partnerships',
            icon: Handshake,
            content: [
                'Health organizations',
                'Fitness influencers & groups',
                'Health experts (nutritionists, physiologists, sleep coaches)',
                'Hardware supplier/manufacturer'
            ]
        },
        {
            id: 'key-activities',
            title: 'Key Activities',
            icon: Activity,
            content: [
                'Product development (hardware + firmware)',
                'App development',
                'Content + Marketing',
                'Delivery / Logistics',
                'Business intelligence and metrics',
                'Post-sale support and customer experience'
            ]
        },
        {
            id: 'key-resources',
            title: 'Key Resources',
            icon: Package,
            content: [
                'Soma mobile app',
                'Smart ring hardware',
                'Internal core team',
                'Supplier / Manufacturer relationships',
                'Payment platform: Mercado Pago',
                'Internal data for health metrics'
            ]
        },
        {
            id: 'value-propositions',
            title: 'Value Propositions',
            icon: Target,
            content: [
                'Discreet, screenless smart ring',
                'Tracks sleep, stress, HRV, and recovery',
                'No subscription required',
                'Competitively priced vs. other rings',
                'Personalized health insights',
                'Elegant, minimalist design'
            ]
        },
        {
            id: 'customer-relationships',
            title: 'Customer Relationships',
            icon: Heart,
            content: [
                'App-based engagement',
                'Personalized recommendations based on tracked data',
                'Clear performance-based feedback (HRV, sleep, readiness scores)',
                'Support through onboarding',
                'After-sale customer support'
            ]
        },
        {
            id: 'channels',
            title: 'Channels',
            icon: Megaphone,
            content: [
                'Awareness: Instagram, TikTok, SEO-optimized webpage, health influencers & organizations',
                'Purchase: Shopify site',
                'After-sale: Customer support'
            ]
        },
        {
            id: 'cost-structure',
            title: 'Cost Structure',
            icon: Receipt,
            content: [
                'Product manufacturing, shipping & customs (~S/ 215 or ~$60 per unit)',
                'Web hosting & Shopify commissions',
                'Paid marketing (ads, influencer fees)',
                'Taxes and legal fees',
                'App development & maintenance'
            ]
        },
        {
            id: 'customer-segments',
            title: 'Customer Segments',
            icon: Users,
            content: [
                'Executives: Stay sharp and perform under pressure',
                'Athletes: Improve recovery, optimize performance',
                'Health-conscious individuals: Daily health tracking and lifestyle optimization'
            ]
        },
        {
            id: 'revenue-streams',
            title: 'Revenue Streams',
            icon: DollarSign,
            content: [
                'One-time ring sale at S/ 549 (~$150 USD)'
            ]
        }
    ];

    const BlockCard = ({ block }: { block: typeof canvasBlocks[0] }) => (
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col h-full">
            <div className="flex items-center mb-4">
                <block.icon className="w-6 h-6 mr-3 text-soma-aquamarina" />
                <h3 className="text-lg font-bold font-saira">{block.title}</h3>
            </div>
            <div className="flex-grow">
                <ul className="list-disc list-inside text-gray-300 space-y-2">
                    {block.content.map((item, index) => (
                        <li key={index} className="text-sm leading-relaxed">{item}</li>
                    ))}
                </ul>
            </div>
        </div>
    );

    return (
        <div className="bg-gray-900 text-white min-h-screen p-4 md:p-6 lg:p-8">
            <header className="flex items-center mb-8">
                <Image src="/Assets/Soma_Logo.png" alt="Soma Logo" width={40} height={40} className="h-10 w-auto mr-4" />
                <h1 className="text-2xl sm:text-3xl font-bold font-saira">Business Model</h1>
            </header>

            <main>
                <div className="mb-6">
                    <h2 className="text-xl font-bold font-saira mb-2">Soma Business Model Canvas</h2>
                    <p className="text-gray-400">A strategic overview of how Soma creates, delivers, and captures value</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {canvasBlocks.map((block) => (
                        <BlockCard key={block.id} block={block} />
                    ))}
                </div>
            </main>
        </div>
    );
};

export default BusinessModelPage; 