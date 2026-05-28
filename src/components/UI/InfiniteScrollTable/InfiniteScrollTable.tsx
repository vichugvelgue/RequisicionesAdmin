import React, { useEffect } from "react";
import { SimpleTable } from "../SimpleTable";
import { GlobalSearchBar } from "../GlobalSearchBar";
import { TableResultsInfo } from "../TableResultsInfo/TableResultsInfo";
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

export interface InfiniteScrollTableProps<T extends object> {
	data: T[];
	pageSize: number;
	resetKey?: string;

	searchBar?: InfiniteScrollTableSearchBarProps;

	columns: SimpleTableColumn<T>[];
	getRowKey?: (row: T) => string | number;

	hasMore?: boolean;
	isLoadingMore?: boolean;
	onLoadMore?: () => void | Promise<void>;

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

export function InfiniteScrollTable<T extends object>({
	data,
	pageSize,
	resetKey,
	searchBar,
	columns,
	getRowKey,

	hasMore = false,
	isLoadingMore = false,
	onLoadMore,

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
	const scrollContainerRef = React.useRef<HTMLDivElement | null>(null);
	const sentinelRef = React.useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		if (!hasMore || isLoadingMore || !onLoadMore) return;

		const sentinel = sentinelRef.current;
		const root = scrollContainerRef.current;

		if (!sentinel || !root) return;

		const observer = new IntersectionObserver(
			(entries) => {
				const first = entries[0];

				if (first?.isIntersecting && hasMore && !isLoadingMore) {
					onLoadMore();
				}
			},
			{
				root,
				rootMargin: "120px",
				threshold: 0,
			}
		);

		observer.observe(sentinel);

		return () => {
			observer.disconnect();
		};
	}, [hasMore, isLoadingMore, onLoadMore, data.length]);

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
					<SimpleTable<T>
						columns={columns}
						data={data}
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
						className="h-8 w-full shrink-0"
						aria-hidden
					/>

					{isLoadingMore && (
						<div className="py-3 text-center text-sm text-slate-500">
							Cargando más registros...
						</div>
					)}

					{!hasMore && data.length > 0 && (
						<div className="py-3 text-center text-xs text-slate-400">
							No hay más registros
						</div>
					)}
				</div>

				{showResultsInfo && (
					<TableResultsInfo
						visibleCount={data.length}
						totalCount={hasMore ? data.length + 1 : data.length}
					/>
				)}
			</div>
		</div>
	);
}