/*const bookmarkForm = document.getElementById('bookmarkForm');
const addBookmarkRadio = document.getElementById('addBookmark');
const removeBookmarkRadio = document.getElementById('removeBookmark');

if(bookmarkForm){

    bookmarkForm.addEventListener('submit', async (event) => {
    
        event.preventDefault(); 

        const propertyId = bookmarkForm.dataset.propertyId;

    if (addBookmarkRadio.checked || removeBookmarkRadio.checked) {

        if (addBookmarkRadio.checked) {
            bookmarkForm.action = `/user/addBookmark/${propertyId}`;
        } 
        
        else if (removeBookmarkRadio.checked) {
            bookmarkForm.action = `/user/removeBookmark/${propertyId}`;
        }

        bookmarkForm.submit();
    }
    });
}*/