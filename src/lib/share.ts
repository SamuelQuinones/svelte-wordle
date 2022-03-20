import { get } from 'svelte/store';
import { guessStore, type Guess } from '$stores/guess';
import { darkModeStore, highContrastStore } from '$stores/theme';
import { GAME_TITLE } from '$constants/strings';
import { solutionIndex } from './words';
import { MAX_CHALLENGES } from '$constants/settings';
import { UAParser } from 'ua-parser-js';

const webShareApiDeviceTypes: string[] = ['mobile', 'smarttv', 'wearable'];
const parser = new UAParser();
const browser = parser.getBrowser();
const device = parser.getDevice();

const canShare = (shareData: ShareData) => {
  return !!(
    // Webshare does not currently work on firefox mobile
    (
      browser.name?.toUpperCase().indexOf('FIREFOX') === -1 &&
      webShareApiDeviceTypes.indexOf(device.type ?? '') !== -1 &&
      navigator.canShare &&
      navigator.canShare(shareData) &&
      navigator.share
    )
  );
};

const generateTiles = () => {
  const isHighContrast = get(highContrastStore);
  const isDarkMode = get(darkModeStore);
  const tiles: string[] = [];
  tiles.push(isHighContrast ? '🟧' : '🟩');
  tiles.push(isHighContrast ? '🟦' : '🟨');
  tiles.push(isDarkMode ? '⬛' : '⬜');
  return tiles;
};

export const generateEmojiGrid = (tiles: string[], store: Guess[]) => {
  const results = store
    .map(({ statuses }) => {
      return statuses
        .map((status) => {
          switch (status) {
            case 'correct':
              return tiles[0];
            case 'present':
              return tiles[1];
            default:
              return tiles[2];
          }
        })
        .join('');
    })
    .join('\n');
  return results;
};

export const shareStatus = async (lost: boolean) => {
  let shareSuccess = false;
  const store = get(guessStore);

  const dataToShare: ShareData = {
    title: `${GAME_TITLE} Score`,
    text: `${GAME_TITLE} ${solutionIndex + 1} ${
      lost ? 'X' : store.length
    }/${MAX_CHALLENGES}\n\n${generateEmojiGrid(generateTiles(), store)}\n\nhttps://word.samtheq.com`
  };

  try {
    if (canShare(dataToShare)) {
      await navigator.share(dataToShare);
      shareSuccess = true;
    }
  } catch (error) {
    shareSuccess = false;
  }

  if (!shareSuccess) {
    await navigator.clipboard.writeText(dataToShare.text);
  }
  return shareSuccess;
};
