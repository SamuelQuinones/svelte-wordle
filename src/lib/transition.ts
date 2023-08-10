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
		css: (t: number) => {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
			const eased = linear(t);
			if (!changeBg) return `transform: ${transform} rotateX(${eased * degrees}deg);`;
			if (t >= 0.5) {
				return `transform: ${transform} rotateX(${eased * degrees}deg); color: white;`;
			} else {
				return `transform: ${transform} rotateX(${
					eased * degrees
				}deg); background-color: transparent;`;
			}
		}
	};
};
