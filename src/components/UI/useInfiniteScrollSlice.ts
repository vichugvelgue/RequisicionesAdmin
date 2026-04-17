import {
	useState,
	useRef,
	useEffect,
	useCallback,
	type RefObject,
} from "react";

const BOTTOM_THRESHOLD_PX = 40;
const LOAD_THROTTLE_MS = 400;

export interface UseInfiniteScrollSliceParams {
	dataLength: number;
	pageSize: number;
	/** When this changes, visible count resets (filters, sort, search) */
	resetKey?: string;
}

export interface UseInfiniteScrollSliceResult {
	scrollContainerRef: RefObject<HTMLDivElement | null>;
	sentinelRef: RefObject<HTMLDivElement | null>;
	/** Number of items to show from the start of `data` */
	visibleCount: number;
}

/**
 * Sentinel + scroll listener + throttle; parent slices `data.slice(0, visibleCount)`.
 */
export function useInfiniteScrollSlice({
	dataLength,
	pageSize,
	resetKey,
}: UseInfiniteScrollSliceParams): UseInfiniteScrollSliceResult {
	const scrollContainerRef = useRef<HTMLDivElement>(null);
	const sentinelRef = useRef<HTMLDivElement>(null);
	const totalItemsRef = useRef(dataLength);
	const hasSkippedInitialRef = useRef(false);
	const lastLoadAtBottomRef = useRef(0);

	const [visibleCount, setVisibleCount] = useState(() =>
		Math.min(pageSize, dataLength)
	);

	totalItemsRef.current = dataLength;

	useEffect(() => {
		hasSkippedInitialRef.current = false;
		setVisibleCount(Math.min(pageSize, dataLength));
	}, [resetKey, pageSize, dataLength]);

	const loadMore = useCallback(() => {
		setVisibleCount((prev) =>
			Math.min(prev + pageSize, totalItemsRef.current)
		);
	}, [pageSize]);

	useEffect(() => {
		if (visibleCount >= totalItemsRef.current) return;

		const root = scrollContainerRef.current;
		if (!root) return;

		const handleScroll = () => {
			const rootEl = scrollContainerRef.current;
			if (!rootEl) return;
			const { scrollTop, scrollHeight, clientHeight } = rootEl;
			const hasScroll = scrollHeight > clientHeight;
			const atTop = scrollTop === 0;
			const atBottom =
				scrollHeight - clientHeight <= scrollTop + BOTTOM_THRESHOLD_PX;

			if (!hasSkippedInitialRef.current && (!hasScroll || atTop)) {
				hasSkippedInitialRef.current = true;
				return;
			}

			if (!atBottom) return;

			const now = Date.now();
			if (now - lastLoadAtBottomRef.current < LOAD_THROTTLE_MS) return;
			if (visibleCount >= totalItemsRef.current) return;

			lastLoadAtBottomRef.current = now;
			loadMore();
		};

		root.addEventListener("scroll", handleScroll);
		return () => root.removeEventListener("scroll", handleScroll);
	}, [loadMore, visibleCount, dataLength]);

	return {
		scrollContainerRef,
		sentinelRef,
		visibleCount,
	};
}
