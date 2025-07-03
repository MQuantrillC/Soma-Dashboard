import React from 'react';
import Image from 'next/image';
import { Users, Bot, Megaphone } from 'lucide-react';
import CompetitorTable from '@/components/market-research/CompetitorTable';
import CustomerSegments from '@/components/market-research/CustomerSegments';
import MarketingStrategy from '@/components/market-research/MarketingStrategy';

const MarketResearchPage = () => {
    return (
        <div className="bg-gray-900 text-white min-h-screen p-4 md:p-6 lg:p-8">
            <header className="flex items-center mb-8">
                <Image src="/Assets/Soma_Logo.png" alt="Soma Logo" width={40} height={40} className="h-10 w-auto mr-4" />
                <h1 className="text-2xl sm:text-3xl font-bold font-saira">Market Research</h1>
            </header>

            <main className="space-y-12">
                <section>
                    <div className="flex items-center mb-4">
                        <Users className="w-6 h-6 mr-3 text-soma-aquamarina" />
                        <h2 className="text-xl font-bold font-saira">Customer Segments & Messaging</h2>
                    </div>
                    <CustomerSegments />
                </section>

                <section>
                    <div className="flex items-center mb-4">
                        <Megaphone className="w-6 h-6 mr-3 text-soma-aquamarina" />
                        <h2 className="text-xl font-bold font-saira">Marketing Strategy & Brand Positioning</h2>
                    </div>
                    <MarketingStrategy />
                </section>

                <section>
                    <div className="flex items-center mb-4">
                        <Bot className="w-6 h-6 mr-3 text-soma-aquamarina" />
                        <h2 className="text-xl font-bold font-saira">Competitor Overview</h2>
                    </div>
                    <CompetitorTable />
                </section>
            </main>
        </div>
    );
};

export default MarketResearchPage; 