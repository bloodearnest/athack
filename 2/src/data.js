


async function readCharacters() {
    const response = await fetch('/characters.json', {
        method: 'GET',
        mode: 'cors',
    });
    if (!response.ok) {
        throw new Error("HTTP error " + response.status);
    }
    return response.json();
}


export {
    readCharacters,
}
