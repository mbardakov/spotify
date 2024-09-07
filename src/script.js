import { getAccessToken, redirectToAuthCodeFlow } from './auth.js'
import { fetchProfile, fetchTopTracks, fetchManyTracksFeatures } from './fetch.js'
import { analyzeTrackFeatures } from './analyze.js';

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

	const profile = await fetchProfile(token);
	console.log('got profile: ', profile);
	const topTracks = await fetchTopTracks(token);
	console.log('got top tracks: ', topTracks);
	const trackFeatures = (await fetchManyTracksFeatures(topTracks.items.map(track => track.id), token)).audio_features;
	console.log('got track features in a bundle: ', trackFeatures);
	populateUI(profile, topTracks);

	const trackAnalysis = analyzeTrackFeatures(trackFeatures);
	console.log('full analysys: ', trackAnalysis);
	for (const dimension of Object.keys(trackAnalysis).sort((dim1, dim2) => trackAnalysis[dim2].mean - trackAnalysis[dim1].mean)) {
		const bar = drawBar(dimension, trackAnalysis[dimension].mean);
		document.getElementById('bar-graph').appendChild(bar);
	}
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