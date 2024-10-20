document.addEventListener('DOMContentLoaded', () => {
    const postsContainer = document.getElementById('posts');
    const postForm = document.getElementById('post-form');
    const postTitle = document.getElementById('post-title');
    const postContent = document.getElementById('post-content');

    function fetchPosts() {
        fetch('/api/posts')
            .then(response => response.json())
            .then(posts => {
                postsContainer.innerHTML = posts.map(post => `
                    <article class="mb-4">
                        <h2>${post.title}</h2>
                        <p>${post.content}</p>
                    </article>
                `).join('');
            });
    }

    postForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const title = postTitle.value;
        const content = postContent.value;

        fetch('/api/posts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title, content }),
        })
        .then(response => response.json())
        .then(() => {
            postTitle.value = '';
            postContent.value = '';
            fetchPosts();
        });
    });

    fetchPosts();
});