<script lang="ts">
	import { statStore } from '$lib/game/statStore';
	import { gameStore } from '$lib/game/stateStore';

	$: maxValue = Math.max(...$statStore.winDistribution);
	$: shouldBeBlue = (i: number) => {
		return $gameStore.playState === 'won' && $gameStore.guesses.length === i + 1;
	};
</script>

<section class="my-2 flex justify-center">
	<div class="m-1 w-1/4 justify-center">
		<div class="text-3xl font-bold">{$statStore.totalGames}</div>
		<div class="text-xs">Total Games</div>
	</div>
	<div class="m-1 w-1/4 justify-center">
		<div class="text-3xl font-bold">{$statStore.successRate}%</div>
		<div class="text-xs">Success Rate</div>
	</div>
	<div class="m-1 w-1/4 justify-center">
		<div class="text-3xl font-bold">{$statStore.currentStreak}</div>
		<div class="text-xs">Current Streak</div>
	</div>
	<div class="m-1 w-1/4 justify-center">
		<div class="text-3xl font-bold">{$statStore.bestStreak}</div>
		<div class="text-xs">Best Streak</div>
	</div>
</section>

{#if $statStore.totalGames > 0}
	<h3 class="text-lg/6 font-medium">Guess Distribution</h3>
	<section class="m-2 text-sm">
		{#each $statStore.winDistribution as win, i}
			<div class="m-1 flex">
				<div class="w-2">{i + 1}</div>
				<div class="ml-2 grow">
					<div
						style={`width: ${isNaN(win / maxValue) ? 5 : (win / maxValue) * 90 + 5}%`}
						class:bg-sky-600={shouldBeBlue(i)}
						class:bg-gray-600={!shouldBeBlue(i)}
						class="grow text-white"
						class:rounded-md={win > 0}
						class:rounded-l-md={win === 0}
					>
						{win}
					</div>
				</div>
			</div>
		{/each}
	</section>
{/if}
