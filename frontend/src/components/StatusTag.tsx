import { Tag } from 'antd';
import React from 'react';

export const STATUS_COLORS: Record<string, string> = {
  // Listing statuses
  pending:          '#f5a623',
  approved:         '#3ba321',
  rejected:         '#e53935',
  bidding_active:   '#1890ff',
  bidding_ended:    '#6b7280',
  sold:             '#7c3aed',
  available:        '#24d725',

  // Bid statuses
  outbid:           '#f97316',
  current_high_bid: '#06b6d4',
  won:              '#eab308',

  // General statuses
  active:           '#10b981',
  inactive:         '#4b5563',
  ended:            '#64748b',
  closed:           '#64748b',
};

export const STATUS_LABELS: Record<string, string> = {
  pending:          'Pending',
  approved:         'Approved',
  rejected:         'Rejected',
  bidding_active:   'Bidding Active',
  bidding_ended:    'Bidding Ended',
  sold:             'Sold',
  available:        'Available',
  outbid:           'Outbid',
  current_high_bid: 'Current High Bid',
  won:              'Won',
  active:           'Active',
  inactive:         'Inactive',
  ended:            'Ended',
  closed:           'Closed',
};

export function StatusTag({ status }: { status: string }) {
  const key = status.toLowerCase().replace(/\s+/g, '_');

  return (
    <Tag
      color={STATUS_COLORS[key] ?? '#6b7280'}
      className="!rounded-full !px-3 !font-semibold"
    >
      {STATUS_LABELS[key] ?? status}
    </Tag>
  );
}
