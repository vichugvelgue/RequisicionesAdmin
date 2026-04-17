import React, { useEffect, useRef } from "react";

export interface InfiniteScrollSentinelProps {
	onLoadMore: () => void;
	disabled?: boolean;
	rootRef?: React.RefObject<HTMLElement | null>;
	rootMargin?: string;
}

export function InfiniteScrollSentinel({
	onLoadMore,
	disabled = false,
	rootRef,
	rootMargin = "0px",
}: InfiniteScrollSentinelProps) {
	const sentinelRef = useRef<HTMLDivElement>(null);
	const hasSkippedInitialRef = useRef(false);
	const lastLoadAtBottomRef = useRef<number>(0);
	const BOTTOM_THRESHOLD_PX = 40;
	const LOAD_THROTTLE_MS = 400;

	useEffect(() => {
		if (disabled) return;

		const root = rootRef?.current ?? null;
		const sentinel = sentinelRef.current;
		if (!sentinel) return;

		const observer = new IntersectionObserver(
			(entries) => {
				const [entry] = entries;
				const rootEl = rootRef?.current as HTMLElement | null;
				if (!rootEl) return;
				const { scrollTop, scrollHeight, clientHeight } = rootEl;
				const hasScroll = scrollHeight > clientHeight;
				const atTop = scrollTop === 0;
				const atBottom =
					scrollHeight - clientHeight <= scrollTop + BOTTOM_THRESHOLD_PX;

				const isIntersecting = !!entry?.isIntersecting;

				// Primera vez: sentinel visible arriba o sin scroll → no cargar (evitar 60 al inicio).
				if (!hasSkippedInitialRef.current && (!hasScroll || atTop)) {
					hasSkippedInitialRef.current = true;
					return;
				}

				if (!isIntersecting) return;

				// Solo cargar cuando el usuario tiene el scroll al fondo (llegó al final), no cuando está arriba con poco contenido.
				if (!atBottom) return;

				const now = Date.now();
				if (now - lastLoadAtBottomRef.current < LOAD_THROTTLE_MS) return;
				lastLoadAtBottomRef.current = now;

				onLoadMore();
			},
			{ root, rootMargin, threshold: 0 }
		);

		observer.observe(sentinel);
		return () => {
			observer.disconnect();
		};
	}, [onLoadMore, disabled, rootRef, rootMargin]);

	return <div ref={sentinelRef} className="h-1 w-full shrink-0" aria-hidden />;
}
