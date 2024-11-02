import "@testing-library/svelte/vitest";
import "@testing-library/jest-dom/vitest";
import { beforeAll, vi } from "vitest";

beforeAll(() => {
	/**
	 * JSDOM doesn't implement PointerEvent so we need to mock our own implementation
	 * Default to mouse left click interaction
	 * https://github.com/radix-ui/primitives/issues/1822
	 * https://github.com/jsdom/jsdom/pull/2666
	 */
	class MockPointerEvent extends Event {
		button: number;
		ctrlKey: boolean;
		pointerType: string;

		constructor(type: string, props: PointerEventInit) {
			super(type, props);
			this.button = props.button || 0;
			this.ctrlKey = props.ctrlKey || false;
			this.pointerType = props.pointerType || "mouse";
		}
	}

	// biome-ignore lint/suspicious/noExplicitAny: used for mocking only
	window.PointerEvent = MockPointerEvent as any;
	window.HTMLElement.prototype.scrollIntoView = vi.fn();
	window.HTMLElement.prototype.releasePointerCapture = vi.fn();
	window.HTMLElement.prototype.hasPointerCapture = vi.fn();

	window.ResizeObserver =
		window.ResizeObserver ||
		vi.fn().mockImplementation(() => ({
			disconnect: vi.fn(),
			observe: vi.fn(),
			unobserve: vi.fn(),
		}));

	Object.defineProperty(window, "matchMedia", {
		value: vi.fn().mockImplementation((query) => ({
			matches: false,
			media: query,
			onchange: null,
			addListener: vi.fn(), // Deprecated
			removeListener: vi.fn(), // Deprecated
			addEventListener: vi.fn(),
			removeEventListener: vi.fn(),
			dispatchEvent: vi.fn(),
		})),
	});
});
