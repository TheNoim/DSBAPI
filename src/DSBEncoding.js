import pako from 'pako';
import { btoa } from './base64';

/**
 *
 * @private
 * @param {*} ObjectToEncode
 */
export default function(ObjectToEncode) {
	let b = pako.deflate(JSON.stringify(ObjectToEncode), {
		to: 'string',
		gzip: !0
	});
	return (b = btoa(b));
}
