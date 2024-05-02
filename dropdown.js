
    // Dropdown open when click on More button
    function toggleDropdownmorebtn(icon) {
        // Find the dropdown menu relative to the clicked icon
        var dropdown = icon.nextElementSibling;
        dropdown.classList.toggle('hidden');
    }
    
    document.addEventListener('click', function(event) {
        var dropdown = document.querySelector('.dropdown');
    
        // Check if the click event target is outside the dropdown or the More button
        if (dropdown && !dropdown.contains(event.target) && event.target.className !== 'hidden md:block') {
            dropdown.classList.add('hidden');
        }
    });
    //  Dropdown open on when click on profile 
    document.addEventListener('DOMContentLoaded', function() {
        var userProfile = document.querySelector('.userprofile');
        var dropdown = document.querySelector('.dropdownprofile');
    
        // Function to toggle dropdown visibility
        function toggleDropdown() {
            dropdown.classList.toggle('hidden');
        }
    
        // Event listener to show/hide dropdown when clicking on user profile
        userProfile.addEventListener('click', function() {
            toggleDropdown();
        });
    
        // Event listener to hide dropdown when clicking outside
        document.addEventListener('click', function(event) {
            if (!userProfile.contains(event.target) && !dropdown.contains(event.target)) {
                dropdown.classList.add('hidden');
            }
        });
    });
       
    