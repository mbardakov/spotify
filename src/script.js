import { getAccessToken, redirectToAuthCodeFlow } from './auth'

const clientId = "7987eef3a4174c7b985aa4e090c20c03";
const params = new URLSearchParams(window.location.search);
const code = params.get("code");
let token = null;

if (!code) {
    redirectToAuthCodeFlow(clientId);
} else {
    token = await getAccessToken(clientId, code);
    const profile = await fetchProfile();
    console.log('got profile: ', profile)
    const topTracks = await fetchTopTracks();
    console.log('got top tracks: ', topTracks);
    populateUI(profile, topTracks);
    const trackFeatures = await analyzeTracks(topTracks.items);
    console.log('track features:', trackFeatures);
    const danceabilityArray = trackFeatures.map(track => track.danceability);
    const danceabilityMean = getMean(danceabilityArray);
    const danceabilityDeviation = getStandardDeviation(danceabilityArray);
    console.log(`tracks have an average danceability of ${danceabilityMean} with a deviation of ${danceabilityDeviation}`)
}

async function fetchUrl(url) {
    const result = await fetch(url, {
        method: "GET", headers: { Authorization: `Bearer ${token}` }
    });

    return await result.json();
}
async function fetchProfile() {
    return await fetchUrl("https://api.spotify.com/v1/me");
}

async function fetchTopTracks() {
    return await fetchUrl("https://api.spotify.com/v1/me/top/tracks");
}

async function fetchTrackFeatures(trackId) {
    return await fetchUrl(`https://api.spotify.com/v1/audio-features/${trackId}`);
}

async function analyzeTracks(tracks) {
    const trackFeatures = [];
    for (let track of tracks) {
        const songInfo = await fetchTrackFeatures(track.id);
        console.log('song info:', track.name, songInfo);
        trackFeatures.push(songInfo);
    }
    return trackFeatures;
}

function getMean(arr) {
    return arr.reduce((accumulator, current) => accumulator + current, 0) / arr.length;
}

function getStandardDeviation(arr) {
    const mean = getMean(arr);
    return Math.sqrt(arr.reduce((accumulator, current) => accumulator + Math.pow((current - mean), 2), 0) / arr.length);
}

// todo: replace this UI with something reactive
function populateUI(profile, topTracks) {
    document.getElementById("displayName").innerText = profile.display_name;
    document.getElementById("id").innerText = profile.id;
    document.getElementById("email").innerText = profile.email;
    document.getElementById("uri").innerText = profile.uri;
    document.getElementById("uri").setAttribute("href", profile.external_urls.spotify);
    document.getElementById("url").innerText = profile.href;
    document.getElementById("url").setAttribute("href", profile.href);
    document.getElementById("topTrack").innerText = `${topTracks.items[0].name} by ${topTracks.items[0].artists[0].name}`;
}