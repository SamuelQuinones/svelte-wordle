import { Blowfish } from 'egoroof-blowfish';

const BLOWFISH_IV = '&zj%7>7e';
const BLOWFISH_KEY = '4k^]!]5+@r>>a#+<sk,hv5g.ffgdsrgr4rdg4e';

const bf = new Blowfish(BLOWFISH_KEY, Blowfish.MODE.ECB, Blowfish.PADDING.NULL);
bf.setIv(BLOWFISH_IV);

export function encrypt(data: string) {
	return btoa(bf.encode(data).reduce((data, byte) => data + String.fromCharCode(byte), ''));
}

export function decrypt(encoded: string) {
	try {
		return bf.decode(
			Uint8Array.from(atob(encoded), (c) => c.charCodeAt(0)),
			Blowfish.TYPE.STRING
		);
	} catch (error) {
		return null;
	}
}
