import { linear } from 'svelte/easing';

export const rotateX = (
	node: HTMLElement,
	{ degrees = 180, duration = 400, delay = 0, changeBg = true }
) => {
	const style = getComputedStyle(node);
	const transform = style.transform === 'none' ? '' : style.transform;
	return {
		duration,
		delay,
		css: (t: any) => {
			const eased = linear(t);
			if (!changeBg) return `transform: ${transform} rotateX(${eased * degrees}deg);`;
			if (t >= 0.5) {
				return `transform: ${transform} rotateX(${eased * degrees}deg); --tw-bg-opacity: ${
					t * 1
				}; color: white;`;
			} else {
				return `transform: ${transform} rotateX(${eased * degrees}deg); --tw-bg-opacity: 0`;
			}
		}
	};
};

/**
 * a dummy transition, doesn't actually change the element but will still 'animate' it with timing
 */
export const dummy = (_node: HTMLElement, { duration = 400, delay = 0 }) => {
	return {
		duration,
		delay,
		css: (_t: any) => {
			return ``;
		}
	};
};
