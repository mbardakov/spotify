export function analyzeTrackFeatures(trackFeatures) {
	const dimensions = ['danceability', 'energy', 'speechiness', 'acousticness', 'liveness', 'valence', 'instrumentalness'];
	const analysis = {};
	for (const dimension of dimensions) {
			const rawData = trackFeatures.map(track => track[dimension]);
		const mean = getMean(rawData);
		const deviation = getStandardDeviation(rawData);
		analysis[dimension] = {mean, deviation};
		console.log(`tracks have an average ${dimension} of ${roundPlaces(mean, 2)} with a deviation of ${roundPlaces(deviation, 2)}`);
	}
	return analysis;
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

export function getMean(arr) {
	return arr.reduce((accumulator, current) => accumulator + current, 0) / arr.length;
}

export function getStandardDeviation(arr) {
	const mean = getMean(arr);
	return Math.sqrt(arr.reduce((accumulator, current) => accumulator + Math.pow((current - mean), 2), 0) / arr.length);
}

export function roundPlaces(number, digits) {
    return (Math.round(number * Math.pow(10, digits))) / Math.pow(10, digits);
}