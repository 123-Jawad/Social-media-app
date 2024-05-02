
document.addEventListener("DOMContentLoaded", function () {
    const userData = localStorage.getItem('userData');
    if (!userData) {
        window.location.href = 'login.html'; // Redirect to index.html if user data exists
    }

    const postsContainer = document.getElementById("postsContainer");
    const loadMoreBtn = document.querySelector(".load-more-btn");
    let skip = 10; // Initial skip to load the first set of posts after the initial 10
    const limit = 10;

    // Event listener for search input
    searchInput.addEventListener("keyup", function (event) {
        if (event.key === "Enter") {
            const searchQuery = searchInput.value.trim();
            if (searchQuery !== "") {
                fetch(`https://dummyjson.com/posts/search?q=${searchQuery}`)
                    .then((res) => res.json())
                    .then((searchData) => {
                        console.log("Search Results:", searchData);
                        // Clear existing posts
                        postsContainer.innerHTML = '';
                        if (searchData && Array.isArray(searchData.posts)) {
                            searchData.posts.forEach((post) => {
                                fetch(`https://dummyjson.com/users/${post.userId}`)
                                    .then((res) => res.json())
                                    .then((userData) => {
                                        const postElement = createPost(post, userData);
                                        postsContainer.appendChild(postElement);

                                        // Fetch and append comments for each search post
                                        const commentsList = postElement.querySelector('.comments-list');
                                        fetchComments(post.id, commentsList);
                                    })
                                    .catch((error) => {
                                        console.error("Error fetching user data:", error);
                                    });
                            });
                        } else {
                            console.error("Error: Invalid search results format", searchData);
                        }
                    })
                    .catch((error) => {
                        console.error("Error searching posts:", error);
                    });
            }
        }
    });

    // Event listener for adding comments when send icon is clicked
    document.addEventListener("click", function (event) {
        if (event.target.classList.contains("fa-paper-plane")) {
            const commentInput = event.target.parentElement.querySelector("input");
            const commentText = commentInput.value.trim();
            const commentsList = event.target.closest(".comment").querySelector(".comments-list");

            if (commentText !== "") {
                // Create a new comment element
                const commentDiv = document.createElement('div');
                commentDiv.classList.add('comment-item', 'flex', 'px-4', 'py-1');

                // Add the comment text
                const commentTextElement = document.createElement('div');
                commentTextElement.classList.add('w-full');
                commentTextElement.textContent = commentText;
                commentDiv.appendChild(commentTextElement);

                // Create edit and delete icons
                const editIcon = document.createElement('i');
                editIcon.classList.add('material-icons', 'edit-icon','hover:underline', 'text-xs', 'cursor-pointer','mx-2');
                editIcon.textContent = 'Edit';
                editIcon.addEventListener('click', () => {
                    // Handle edit action
                    editComment(null, commentTextElement);
                });

                const deleteIcon = document.createElement('i');
                deleteIcon.classList.add('material-icons', 'delete-icon','hover:underline', 'text-xs','cursor-pointer');
                deleteIcon.textContent = 'Delete';
                deleteIcon.addEventListener('click', () => {
                    // Handle delete action
                    deleteComment(null, commentDiv);
                });

                // Append edit and delete icons to the new comment div
                commentDiv.appendChild(editIcon);
                commentDiv.appendChild(deleteIcon);

                // Append the new comment to the comments list
                commentsList.appendChild(commentDiv);

                // Clear the input field after adding the comment
                commentInput.value = "";
            } else {
                console.error("Error: Empty comment not allowed");
            }
        }
    });

    function createPost(post, userData) {
        const postContainer = document.createElement("div");
        postContainer.classList.add("post", "my-2", "p-4", "bg-white", "rounded", "shadow");
        postContainer.innerHTML = `
        <div class="flex bg-white hover:bg-gray-200" style="border-bottom: 1px solid #EFF3F4;">
               <div class="content">
                 <div class="flex">
                       <div class="postimg w-8">
                         <img class="rounded-full" style="margin-left: 15px;" src="${userData.image}" alt="Author Avatar">
                   </div>
                      <span class="font-bold hover:underline cursor-pointer text-black mx-5 mt-1 text-sm">${userData.username}</span>
                      <span class="text-gray-500 text-sm ml-6 mt-1"> ${userData.email}</span>
                    </div>
                    <div class="postimg m-4 ml-0">
                      <img class="rounded-xl mx-2" src="https://source.unsplash.com/random/${post.id}" alt="">
                    </div>
                    <div class="icons flex justify-between mx-4 my-4 text-sm text-gray-600">
                      <div class="icon flex items-center justify-center hover:text-blue-500 hover:bg-gray-200 hover:rounded-full p-1 hover:cursor-pointer">
                        <span class="material-symbols-outlined" >chat_bubble</span>
                        <span class="material-symbols-outlined" id="commentLength"></span>${post.reactions}
                      </div>
                      <div class="icon flex items-center justify-center hover:text-green-500 hover:bg-gray-200 hover:rounded-full p-1 hover:cursor-pointer">
                        <span class="material-symbols-outlined">repeat</span>14.6k
                      </div>
                      <div class="icon flex items-center justify-center hover:text-pink-500 hover:bg-gray-200 hover:rounded-full p-1 hover:cursor-pointer">
                        <span class="material-symbols-outlined">Favorite</span> ${post.reactions}
                      </div>
                      <div class="icon flex items-center justify-center hover:text-blue-500 hover:bg-gray-200 hover:rounded-full p-1 hover:cursor-pointer">
                        <span class="material-symbols-outlined">bar_chart</span>34.9k
                      </div>
                    </div>
                    <div class="p-3 text-sm text-gray-500">${post.body}</div>
                     <div class="comment">
                     <div class="w-4/5 rounded-xl" style="background: #EFF3F4; margin-left: 10px;">
                       <input
                         type="text"
                         class="w-4/5 outline-none rounded-xl text-black px-4 py-2 mx-2"
                         placeholder="Write a Comment" style="background: #EFF3F4;"
                       />
                       <i
                         class="fa-solid fa-paper-plane text-blue-400 pl-1 text-lg cursor-pointer" style="margin-left: 25px;"
                       ></i></div>
                       <h6 class="text-sm pt-2 cursor-pointer show-comments px-4"
                       >
                         All Comments
                   </h6>
                       <div class="comments-list text-gray-500 text-sm pt-2"></div>
                  </div>
                   </div>
                 </div>
              `;
        return postContainer;
    }

    function editComment(commentId, commentTextElement) {
        // Create an input field for editing the comment
        const commentInput = document.createElement('input');
        commentInput.type = 'text';
        commentInput.classList.add('w-full', 'outline-none', 'rounded', 'bg-gray-100', 'px-2', 'py-1');
        commentInput.value = commentTextElement.textContent;

        // Replace the comment text with the input field
        commentTextElement.textContent = '';
        commentTextElement.appendChild(commentInput);

        // Handle save action on input blur
        commentInput.addEventListener('blur', () => {
            saveComment(commentId, commentInput, commentTextElement);
        });
    }

    function saveComment(commentId, commentInput, commentTextElement) {
        const updatedComment = commentInput.value.trim();

        if (updatedComment !== '') {
            // Update the comment text
            commentTextElement.textContent = updatedComment;
            console.log(`Comment ${commentId} updated: ${updatedComment}`);
        } else {
            // Revert to the original comment text if the updated comment is empty
            commentTextElement.textContent = commentInput.defaultValue;
            console.error("Error: Empty comment not allowed");
        }
    }

    function deleteComment(commentId, commentElement) {
        // Delete the comment from the UI
        commentElement.remove();
        console.log(`Comment ${commentId} deleted`);
    }

    function fetchComments(postId, commentsList) {
        console.log("Fetching comments for postId:", postId);
        fetch(`https://dummyjson.com/comments/post/${postId}`)
            .then((res) => res.json())
            .then((commentsData) => {
                console.log("Comments Data:", commentsData); // Check if commentsData exists

                // Append new comments
                if (commentsData && Array.isArray(commentsData.comments)) {
                    commentsData.comments.forEach((comment) => {
                        // Create a div for each comment
                        const commentDiv = document.createElement('div');
                        commentDiv.classList.add('comment-item', 'flex', 'px-4', 'py-1');

                        // Add the comment text
                        const commentText = document.createElement('div');
                        commentText.classList.add('w-full');
                        commentText.textContent = comment.body;
                        commentDiv.appendChild(commentText);

                        // Create edit and delete icons
                        const editIcon = document.createElement('i');
                        editIcon.classList.add('material-icons', 'edit-icon', 'text-xs','hover:underline', 'cursor-pointer','mx-2');
                        editIcon.textContent = 'Edit';
                        editIcon.addEventListener('click', () => {
                            // Handle edit action
                            editComment(comment.id, commentText);
                        });

                        const deleteIcon = document.createElement('i');
                        deleteIcon.classList.add('material-icons', 'delete-icon', 'text-xs','hover:underline', 'cursor-pointer', 'text-red-500');
                        deleteIcon.textContent = 'Delete';
                        deleteIcon.addEventListener('click', () => {
                            // Handle delete action
                            deleteComment(comment.id, commentDiv);
                        });

                        // Append edit and delete icons to the comment div
                        commentDiv.appendChild(editIcon);
                        commentDiv.appendChild(deleteIcon);

                        // Append the comment div to the comments list
                        commentsList.appendChild(commentDiv);
                    });
                } else {
                    console.error("Error: No comments data or invalid format");
                }
            })
            .catch((error) => {
                console.error("Error fetching comments data:", error);
            });
    }

    function fetchPosts() {
        fetch(`https://dummyjson.com/posts?limit=${limit}&skip=${skip}&select=title,reactions,userId,body`)
            .then((res) => res.json())
            .then((postsData) => {
                if (postsData && Array.isArray(postsData.posts)) {
                    postsData.posts.forEach((post) => {
                        fetch(`https://dummyjson.com/users/${post.userId}`)
                            .then((res) => res.json())
                            .then((userData) => {
                                const postElement = createPost(post, userData);
                                postsContainer.appendChild(postElement);

                                // Fetch and append comments for each post
                                const commentsList = postElement.querySelector('.comments-list');
                                fetchComments(post.id, commentsList);
                            })
                            .catch((error) => {
                                console.error("Error fetching user data:", error);
                            });
                    });
                    skip += limit; // Increment skip for the next set of posts
                } else {
                    console.error("Error: Invalid posts data format", postsData);
                }
            })
            .catch((error) => {
                console.error("Error fetching posts data:", error);
            });
    }

    loadMoreBtn.addEventListener("click", fetchPosts);

    // Initial load of first 10 posts
    fetch(`https://dummyjson.com/posts?limit=${limit}&skip=0&select=title,reactions,userId,body`)
        .then((res) => res.json())
        .then((postsData) => {
            if (postsData && Array.isArray(postsData.posts)) {
                postsData.posts.forEach((post) => {
                    fetch(`https://dummyjson.com/users/${post.userId}`)
                        .then((res) => res.json())
                        .then((userData) => {
                            const postElement = createPost(post, userData);
                            postsContainer.appendChild(postElement);

                            // Fetch and append comments for each post
                            const commentsList = postElement.querySelector('.comments-list');
                            fetchComments(post.id, commentsList);
                        })
                        .catch((error) => {
                            console.error("Error fetching user data:", error);
                        });
                });
            } else {
                console.error("Error: Invalid posts data format", postsData);
            }
        })
        .catch((error) => {
            console.error("Error fetching initial posts data:", error);
        });
});


