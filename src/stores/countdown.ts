import { readable } from 'svelte/store';
import duration from 'dayjs/plugin/duration';
import dayjs from 'dayjs';
import { tomorrow } from '$lib/words';
dayjs.extend(duration);

const addLeadingZero = (time: number) => {
	if (time < 10) {
		return `0${time}`;
	}
	return time;
};

const formatTimeFrame = () => {
	const diff = dayjs.duration(tomorrow - new Date().getTime());
	return `${addLeadingZero(diff.hours())}:${addLeadingZero(diff.minutes())}:${addLeadingZero(
		diff.seconds()
	)}`;
};

export const countdownClock = readable(formatTimeFrame(), (set) => {
	const interval = setInterval(() => {
		set(formatTimeFrame());
	}, 1000);

	return function stop() {
		clearInterval(interval);
	};
});
