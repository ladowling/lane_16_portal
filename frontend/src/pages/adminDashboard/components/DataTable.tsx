import { Input, Table } from 'antd';
import type { TableColumnsType, TableProps } from 'antd';
import { useMemo, useState } from 'react';

type DataTableProps<T extends object> = {
  columns: TableColumnsType<T>;
  dataSource: T[];
  loading?: boolean;
  searchable?: boolean;
  rowKey?: TableProps<T>['rowKey'];
  searchPlaceholder?: string;
};

const getValueByDataIndex = <T extends object>(record: T, dataIndex: unknown) => {
  if (Array.isArray(dataIndex)) {
    return dataIndex.reduce<unknown>((value, key) => {
      if (value && typeof value === 'object') {
        return (value as Record<string, unknown>)[String(key)];
      }
      return undefined;
    }, record);
  }

  if (typeof dataIndex === 'string' || typeof dataIndex === 'number') {
    return (record as Record<string, unknown>)[String(dataIndex)];
  }

  return undefined;
};

const getSearchableValues = <T extends object>(columns: TableColumnsType<T>, record: T): string =>
  columns
    .flatMap((column): string[] => {
      if ('children' in column && column.children) {
        return [getSearchableValues(column.children, record)];
      }

      if (!('dataIndex' in column)) {
        return [];
      }

      const value = getValueByDataIndex(record, column.dataIndex);
      if (value === null || value === undefined) {
        return [];
      }

      if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
        return [String(value)];
      }

      return [];
    })
    .join(' ');

export function DataTable<T extends object>({
  columns,
  dataSource,
  loading = false,
  searchable = false,
  rowKey,
  searchPlaceholder = 'Search table',
}: DataTableProps<T>) {
  const [searchText, setSearchText] = useState('');

  const filteredData = useMemo(() => {
    const normalizedSearch = searchText.trim().toLowerCase();

    if (!normalizedSearch) {
      return dataSource;
    }

    return dataSource.filter((record) =>
      getSearchableValues(columns, record).toLowerCase().includes(normalizedSearch)
    );
  }, [columns, dataSource, searchText]);

  return (
    <section className="rounded-lg border border-[#555555] bg-[#0c0c0c] p-4">
      {searchable && (
        <Input.Search
          allowClear
          className="mb-4 max-w-md [&_.ant-input]:!border-[#575757] [&_.ant-input]:!bg-white [&_.ant-input]:!text-black [&_.ant-input::placeholder]:!text-gray-300 [&_.ant-input-clear-icon]:!text-black [&_.ant-input-group-addon_button]:!border-[#3ba321] [&_.ant-input-group-addon_button]:!bg-[#3ba321]"
          onChange={(event) => setSearchText(event.target.value)}
          placeholder={searchPlaceholder}
          value={searchText}
        />
      )}
      <Table
        columns={columns}
        dataSource={filteredData}
        loading={loading}
        rowKey={rowKey}
        scroll={{ x: true }}
        className="[&_.ant-empty-description]:!text-[#c8c8c8] [&_.ant-pagination-item-active]:!border-[#3ba321] [&_.ant-pagination-item-active_a]:!text-[#3ba321] [&_.ant-pagination-item_a]:!text-black [&_.ant-pagination-item-link]:!text-white [&_.ant-pagination-item-link_span]:!text-white [&_.ant-pagination-item-ellipsis]:!text-white [&_.ant-table]:!bg-[#0c0c0c] [&_.ant-table-cell]:!border-[#555555] [&_.ant-table-cell]:!bg-[#0c0c0c] [&_.ant-table-cell]:!text-white [&_.ant-table-column-sorter]:!text-[#c8c8c8] [&_.ant-table-filter-trigger]:!text-[#c8c8c8] [&_.ant-table-thead_.ant-table-cell]:!bg-[#111111] [&_.ant-table-thead_.ant-table-cell]:!font-bold [&_.ant-table-thead_.ant-table-cell]:!text-white"
        pagination={{ pageSize: 5, showSizeChanger: false }}
      />
    </section>
  );
}

