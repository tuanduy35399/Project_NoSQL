export const API = fetch('https://jsonplaceholder.typicode.com/comments')
                .then(response => response.json())

