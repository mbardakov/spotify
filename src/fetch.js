async function fetchUrl(url, token) {
	try {
		const result = await fetch(url, {
			method: 'GET', headers: { Authorization: `Bearer ${token}` }
		});
		const resultJson = await result.json();
		console.log('fetch result: ', resultJson);
		return resultJson;
	} catch (e) {
		console.error('fetch failed with: ', e);
	}
}
export async function fetchProfile(token) {
	return await fetchUrl('https://api.spotify.com/v1/me', token);
}

export async function fetchTopTracks(token) {
	return await fetchUrl('https://api.spotify.com/v1/me/top/tracks', token);
}

export async function fetchManyTracksFeatures(trackIds, token) {
	return await fetchUrl(`https://api.spotify.com/v1/audio-features?ids=${trackIds.join(',')}`, token);
}