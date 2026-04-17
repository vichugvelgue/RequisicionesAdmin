import React, { useMemo } from "react";
import { SimpleTable } from "../SimpleTable";
import { GlobalSearchBar } from "../GlobalSearchBar";
import { TableResultsInfo } from "../TableResultsInfo/TableResultsInfo";
import { useInfiniteScrollSlice } from "../useInfiniteScrollSlice";
import type { SortConfig } from "../types";
import type { OptionItem, SearchDateRangeValue } from "../types";
import type { SimpleTableColumn } from "../SimpleTable/SimpleTable";
import type { SimpleTableCustomAction } from "../SimpleTable/SimpleTable";

export interface InfiniteScrollTableSearchBarProps {
	searchCriteria: string;
	onSearchCriteriaChange: (value: string) => void;
	criteriaOptions: OptionItem[];
	searchText: string;
	onSearchTextChange: (value: string) => void;
	onSearch: () => void;
	searchPlaceholder?: string;
	blockLabel?: string;
	dateRangeCriteria?: string;
	dateRangeValue?: SearchDateRangeValue | undefined;
	onDateRangeChange?: (value: SearchDateRangeValue | undefined) => void;
}

export interface InfiniteScrollTableProps<T extends Record<string, unknown>> {
	/** Full list (already filtered/sorted by parent or raw for internal use) */
	data: T[];
	pageSize: number;
	/** When this changes, visibleCount resets to pageSize (e.g. search + sort + filters) */
	resetKey?: string;

	/** Optional global search bar above the table */
	searchBar?: InfiniteScrollTableSearchBarProps;

	/** Table props (passed through to SimpleTable) */
	columns: SimpleTableColumn<T>[];
	getRowKey?: (row: T) => string | number;
	sortConfig?: SortConfig | null;
	onSort?: (key: string) => void;
	showInlineFilters?: boolean;
	onToggleInlineFilters?: () => void;
	inlineFilters?: Record<string, string>;
	onInlineFilterChange?: (key: string, value: string) => void;
	onClearInlineFilters?: () => void;
	onView?: (row: T) => void;
	onPrint?: (row: T) => void;
	onEdit?: (row: T) => void;
	onCancel?: (row: T) => void;
	onDelete?: (row: T) => void;
	customActions?: SimpleTableCustomAction<T>[];
	actionsColumnLabel?: string;
	tableClassName?: string;
	wrapperClassName?: string;

	showResultsInfo?: boolean;
}

export function InfiniteScrollTable<T extends Record<string, unknown>>({
	data,
	pageSize,
	resetKey,
	searchBar,
	columns,
	getRowKey,
	sortConfig,
	onSort,
	showInlineFilters = true,
	onToggleInlineFilters,
	inlineFilters = {},
	onInlineFilterChange,
	onClearInlineFilters,
	onView,
	onPrint,
	onEdit,
	onCancel,
	onDelete,
	customActions = [],
	actionsColumnLabel = "",
	tableClassName = "",
	wrapperClassName = "",
	showResultsInfo = true,
}: InfiniteScrollTableProps<T>) {
	const totalItems = data.length;
	const { scrollContainerRef, sentinelRef, visibleCount } =
		useInfiniteScrollSlice({
			dataLength: totalItems,
			pageSize,
			resetKey,
		});

	const visibleData = useMemo(
		() => data.slice(0, visibleCount),
		[data, visibleCount]
	);

	return (
		<div className="flex flex-col flex-1 min-h-0 min-w-0 w-full">
			{searchBar && (
				<div className="px-5 py-4 border-b border-slate-200 shrink-0 bg-white">
					<GlobalSearchBar
						searchCriteria={searchBar.searchCriteria}
						onSearchCriteriaChange={searchBar.onSearchCriteriaChange}
						criteriaOptions={searchBar.criteriaOptions}
						searchText={searchBar.searchText}
						onSearchTextChange={searchBar.onSearchTextChange}
						onSearch={searchBar.onSearch}
						searchPlaceholder={searchBar.searchPlaceholder}
						blockLabel={searchBar.blockLabel}
						dateRangeCriteria={searchBar.dateRangeCriteria}
						dateRangeValue={searchBar.dateRangeValue}
						onDateRangeChange={searchBar.onDateRangeChange}
					/>
				</div>
			)}

			<div className="flex flex-col flex-1 min-h-0 min-w-0 w-full">
				<div
					ref={scrollContainerRef}
					className="flex flex-col flex-1 min-h-0 min-w-0 overflow-auto"
				>
					<>
						<SimpleTable<T>
							columns={columns}
							data={visibleData}
							getRowKey={getRowKey}
							sortConfig={sortConfig}
							onSort={onSort}
							showInlineFilters={showInlineFilters}
							onToggleInlineFilters={onToggleInlineFilters}
							inlineFilters={inlineFilters}
							onInlineFilterChange={onInlineFilterChange}
							onClearInlineFilters={onClearInlineFilters}
							onView={onView}
							onPrint={onPrint}
							onEdit={onEdit}
							onCancel={onCancel}
							onDelete={onDelete}
							customActions={customActions}
							actionsColumnLabel={actionsColumnLabel}
							wrapperClassName={wrapperClassName}
							tableClassName={tableClassName}
							scrollContainer="parent"
						/>
						<div
							ref={sentinelRef}
							className="h-1 w-full shrink-0"
							aria-hidden
						/>
					</>
				</div>

				{showResultsInfo && (
					<TableResultsInfo
						visibleCount={visibleData.length}
						totalCount={totalItems}
					/>
				)}
			</div>
		</div>
	);
}
