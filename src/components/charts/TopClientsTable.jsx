import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, ArrowRight } from 'lucide-react';
import { formatCurrency, formatNumber } from '../utils/formatters';
import { createPageUrl } from '../../pages/utils';

export default function TopClientsTable({ clients, title = "Top Clients by Revenue", activeSplit }) {
  return (
    <Card className="border-0 shadow-sm border-t-4 border-t-[#F5CA23]">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-gray-900">{title}</h3>
          <Link
            to={createPageUrl('Clients')}
            className="text-xs text-gray-500 hover:text-gray-900 flex items-center gap-1"
          >
            View all <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="space-y-1">
          {clients.map((client, index) => {
            const icpShare = Math.round((client.revenue * (activeSplit.icp / 100)) * 100) / 100;
            return (
              <Link
                key={client.id}
                to={`${createPageUrl('ClientProfile')}?id=${client.id}`}
                className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors group"
              >
                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-sm font-semibold text-gray-600">
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate group-hover:text-gray-700">
                    {client.name}
                  </p>
                  <p className="text-xs text-gray-400">{client.sector}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">{formatCurrency(client.revenue)}</p>
                  <p className="text-xs text-gray-400">ICP: {formatCurrency(icpShare)}</p>
                </div>
                <TrendingUp className="w-4 h-4 text-green-500" />
              </Link>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
