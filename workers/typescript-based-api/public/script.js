document.getElementById('searchButton').addEventListener('click', async function () {
	const word = document.getElementById('wordInput').value;
	const resultSection = document.getElementById('resultSection');
	const definition = document.getElementById('definition');

	if (word.trim() === '') {
		alert('Please enter a word');
		return;
	}

	const response = await fetch('/api/etymology', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ word }),
	});
	resultSection.style.display = 'block';
	definition.innerText = '';
	const reader = response.body.pipeThrough(new TextDecoderStream()).getReader();
	while (true) {
		const { value, done } = await reader.read();
		if (done) {
			console.log('Stream done');
			break;
		}
		definition.innerText += value;
	}
});
