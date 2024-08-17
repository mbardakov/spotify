import { getAccessToken, redirectToAuthCodeFlow } from './auth'

const clientId = "7987eef3a4174c7b985aa4e090c20c03";
const params = new URLSearchParams(window.location.search);
const code = params.get("code");
// token might as well go here we've established we're not above global variables

if (!code) {
    redirectToAuthCodeFlow(clientId);
} else {
    const accessToken = await getAccessToken(clientId, code);
    const profile = await fetchProfile(accessToken);
    console.log('got profile: ', profile)
    const topTracks = await fetchTopTracks(accessToken);
    console.log('got top tracks: ', topTracks);
    const trackFeatures = await analyzeTracks(topTracks.items, accessToken);
    console.log('track features:', trackFeatures);
    const danceabilityArray = trackFeatures.map(track => track.danceability);
    const danceabilityMean = getMean(danceabilityArray);
    const danceabilityDeviation = getStandardDeviation(danceabilityArray);
    console.log(`tracks have an average danceability of ${danceabilityMean} with a deviation of ${danceabilityDeviation}`)
    populateUI(profile, topTracks);
}

// todo: factor this out into a generic fetch(url) and store the token somewhere accessible so it doesn't have to be passed around
async function fetchProfile(token) {
    const result = await fetch("https://api.spotify.com/v1/me", {
        method: "GET", headers: { Authorization: `Bearer ${token}` }
    });

    return await result.json();
}

async function fetchTopTracks(token) {
    const result = await fetch("https://api.spotify.com/v1/me/top/tracks", {
        method: "GET", headers: { Authorization: `Bearer ${token}` }
    });

    return await result.json();
}

async function fetchTrackFeatures(token, trackId) {
    const result = await fetch(`https://api.spotify.com/v1/audio-features/${trackId}`, {
        method: "GET", headers: { Authorization: `Bearer ${token}` }
    });

    return await result.json();
}

async function analyzeTracks(tracks, accessToken) {
    const trackFeatures = [];
    for (let track of tracks) {
        const songInfo = await fetchTrackFeatures(accessToken, track.id);
        console.log('song info:', songInfo);
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