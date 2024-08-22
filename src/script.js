import { getAccessToken, redirectToAuthCodeFlow } from './auth.js'

const clientId = '7987eef3a4174c7b985aa4e090c20c03';
const params = new URLSearchParams(window.location.search);
const code = params.get('code');
let token = null;

if (!code) {
	try {
		redirectToAuthCodeFlow(clientId);
	} catch (e) {
		console.error('redirectToAuthCodeFlow failed with error: ', e);
	}
} else {
	try {
		token = await getAccessToken(clientId, code);
	} catch (e) {
		console.error('getAccessToken failed with error: ', e);
	}

	const profile = await fetchProfile();
	console.log('got profile: ', profile);
	const topTracks = await fetchTopTracks();
	console.log('got top tracks: ', topTracks);
	const trackFeatures = (await fetchManyTracksFeatures(topTracks.items.map(track => track.id))).audio_features;
	console.log('got track features in a bundle: ', trackFeatures);
	populateUI(profile, topTracks);

	const trackAnalysis = analyzeTrackFeatures(trackFeatures);
	console.log('full analysys: ', trackAnalysis);
	for (const dimension of Object.keys(trackAnalysis).sort((dim1, dim2) => trackAnalysis[dim2].mean - trackAnalysis[dim1].mean)) {
		const bar = drawBar(dimension, trackAnalysis[dimension].mean);
		document.getElementById('bar-graph').appendChild(bar);
	}
}

async function fetchUrl(url) {
	try {
		const result = await fetch(url, {
			method: 'GET', headers: { Authorization: `Bearer ${token}` }
		});
		console.log('fetch result: ', result);
		return await result.json();
	} catch (e) {
		console.error('fetch failed with: ', e);
	}
}
async function fetchProfile() {
	return await fetchUrl('https://api.spotify.com/v1/me');
}

async function fetchTopTracks() {
	return await fetchUrl('https://api.spotify.com/v1/me/top/tracks');
}

async function fetchManyTracksFeatures(trackIds) {
	return await fetchUrl(`https://api.spotify.com/v1/audio-features?ids=${trackIds.join(',')}`);
}

// sample track features:
// {
//     'danceability': 0.531,
//     'energy': 0.363,
//     'speechiness': 0.0608,
//     'acousticness': 0.749,
//     'liveness': 0.112,
//     'valence': 0.259,
//     'instrumentalness': 0,
//     'key': 10,
//     'loudness': -7.672,
//     'mode': 1,
//     'tempo': 121.412,
//     'type': 'audio_features',
//     'id': '5TgEJ62DOzBpGxZ7WRsrqb',
//     'uri': 'spotify:track:5TgEJ62DOzBpGxZ7WRsrqb',
//     'track_href': 'https://api.spotify.com/v1/tracks/5TgEJ62DOzBpGxZ7WRsrqb',
//     'analysis_url': 'https://api.spotify.com/v1/audio-analysis/5TgEJ62DOzBpGxZ7WRsrqb',
//     'duration_ms': 229720,
//     'time_signature': 4
// }

function analyzeTrackFeatures(trackFeatures) {
	const dimensions = ['danceability', 'energy', 'speechiness', 'acousticness', 'liveness', 'valence', 'instrumentalness'];
	const analysis = {};
	for (const dimension of dimensions) {
			const rawData = trackFeatures.map(track => track[dimension]);
		const mean = getMean(rawData);
		const deviation = getStandardDeviation(rawData);
		analysis[dimension] = {mean, deviation};
		console.log(`tracks have an average ${dimension} of ${mean.toFixed(3)} with a deviation of ${deviation.toFixed(3)}`);
	}
	return analysis;
}

function getMean(arr) {
	return arr.reduce((accumulator, current) => accumulator + current, 0) / arr.length;
}

function getStandardDeviation(arr) {
	const mean = getMean(arr);
	return Math.sqrt(arr.reduce((accumulator, current) => accumulator + Math.pow((current - mean), 2), 0) / arr.length);
}

function drawBar(dimension, width) {
	const outerDiv = document.createElement('div');

	const titleSpan = document.createElement('span');
	titleSpan.setAttribute('class', 'song-dimension');
	titleSpan.innerText = dimension;

	const barDiv = document.createElement('div');
	barDiv.setAttribute('class', 'bar');
	barDiv.setAttribute('id', `${dimension}-percentage`);
	barDiv.setAttribute('style', `width: ${10 + width * 90}%`);
	barDiv.setAttribute('data-percentage', `${width.toFixed(2) * 100}%`);
	outerDiv.appendChild(titleSpan);
	outerDiv.appendChild(barDiv);
	return outerDiv;
}

// todo: replace this UI with something reactive
function populateUI(profile, topTracks) {
	document.getElementById('displayName').innerText = profile.display_name;
	document.getElementById('id').innerText = profile.id;
	document.getElementById('email').innerText = profile.email;
	document.getElementById('uri').innerText = profile.uri;
	document.getElementById('uri').setAttribute('href', profile.external_urls.spotify);
	document.getElementById('url').innerText = profile.href;
	document.getElementById('url').setAttribute('href', profile.href);
	document.getElementById('topTrack').innerText = `${topTracks.items[0].name} by ${topTracks.items[0].artists[0].name}`;
}