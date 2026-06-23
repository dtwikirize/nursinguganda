// wp-content/plugins/imci-handbook-search/js/imci-search.js
jQuery(document).ready(function($) {

    // Check if the suggestion data is available
    if (typeof imciSearchData !== 'undefined' &&
        imciSearchData.suggestions &&
        Array.isArray(imciSearchData.suggestions) &&
        imciSearchData.suggestions.length > 0) {

        var availableTags = imciSearchData.suggestions;

        // Initialize autocomplete ONLY if the element exists
        if ($("#imci_query_input").length) {
             $("#imci_query_input").autocomplete({
                source: availableTags,
                minLength: 2 // Start suggesting after 2 characters are typed
             });
        }
    }
}); // End of document ready