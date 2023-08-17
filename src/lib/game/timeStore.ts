import { intervalToDuration } from 'date-fns';
import { readable } from 'svelte/store';
import { tomorrow } from './helpers';

function addLeadingZero(time = 0) {
	if (time < 10) {
		return `0${time}`;
	}
	return time;
}

function formatTimeFrame() {
	const diff = intervalToDuration({ start: new Date(), end: tomorrow });
	return `${addLeadingZero(diff.hours)}:${addLeadingZero(diff.minutes)}:${addLeadingZero(
		diff.seconds
	)}`;
}

export const countdownClock = readable(formatTimeFrame(), (set) => {
	const interval = setInterval(() => {
		set(formatTimeFrame());
	}, 1000);

	return function stop() {
		clearInterval(interval);
	};
});
