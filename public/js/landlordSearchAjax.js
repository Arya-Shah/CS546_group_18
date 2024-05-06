/* 
All of the functionality will be done in this client-side JS file.  
You will make client - side AJAX requests to the API and use jQuery to target and create elements on the page. You can use a client-side fetch or axios request instead of AJAX)
*/

//TO DO: ADD APPROPRIATE ROUTES WHERE FLAGGED WITH "TO DO"

(function ($){

  //References to form, input, ul, div, and a elements
  let searchLandlordForm = $('#searchLandlordForm'),
      searchType = $('#searchType'),
      errorDiv = $('#errorDiv'),
      searchResults = $('#searchResults'),
      landlordDetails = $('#landlordDetails'),
      rootLink = $('#rootLink'),
      sortDropdown = $('#sortInput');

  // Function to handle changes in search type dropdown
  searchType.on('change', function () {
    if (this.value === 'state') {
      $('#cityInput').hide();
      $('#stateDropdown').show();
    } else {
      $('#cityInput').show();
      $('#stateDropdown').hide();
    }
  });

  //Ensure rootLink is hidden
  rootLink.hide();

  //EVENT: Intercept form submission
  searchLandlordForm.submit(function (event) {

    //Prevent default
    event.preventDefault();

    //Empty and hide elements
    errorDiv.empty().hide();
    searchResults.empty().hide(); 
    landlordDetails.empty().hide();
    rootLink.hide();

    // Check if search type is selected
    let searchTypeValue = searchType.val().trim();
    if (searchTypeValue === '' || (searchTypeValue !== 'city' && searchTypeValue !== 'state')) {
        errorDiv.text('Please select a search type (city or state).').show();
    return;
    }

    let requestConfig = {};
    //Check if city or state was chosen
    if (searchTypeValue === 'city'){

      let cityInput = $('#cityInput');
      let cityInputValue = cityInput.val().trim();
      
      //Show Error is city input not provided.
      if (cityInputValue === '') {
        errorDiv.text('Please provide a city name.').show();
        return;
      }

      //Create configuration
      requestConfig = {
        method: 'GET',
        url: `property/searchLandlordsByCity/${cityInputValue}`
      }

    } else if (searchTypeValue === 'state'){

      let stateInput = $('#stateInput');
      let stateInputValue = stateInput.val().trim();

      // Show Error if state input not provided
      if (stateInputValue === '') {
        errorDiv.text('Please select a state.').show();
        return;
      }

      //Create configuration
      requestConfig = {
        method: 'GET',
        url: `property/searchLandlordsByState/${stateInputValue}`
      }

    }

    //AJAX Call

    $.ajax(requestConfig).then(function(responseMessage) {

      if(responseMessage.Response && Array.isArray(responseMessage.Search)){

          //Sort
          let selectedSort = sortDropdown.val();

          if (selectedSort){
            responseMessage.Search.sort((a, b) => {
              return a.averageRatings[selectedSort] - b.averageRatings[selectedSort];
            });
          }
          

          responseMessage.Search.forEach((landlord) => {
            
            let listItem = $(`<li><a href="/landlord/${landlord.landlordId}" data-id="${landlord.landlordId}">${landlord.firstname}, ${landlord.lastname}</a>, ${landlord.city}, ${landlord.state}</li>`);

            // Construct the ratings information
            let ratingsInfo = 
            `<ul>
                <li>Kindness Rating: ${landlord.averageRatings.averageKindnessRating}</li>
                <li>Maintenance Responsiveness Rating: ${landlord.averageRatings.averageMaintenanceResponsivenessRating}</li>
                <li>Overall Communication Rating: ${landlord.averageRatings.averageOverallCommunicationRating}</li>
                <li>Professionalism Rating: ${landlord.averageRatings.averageProfessionalismRating}</li>
                <li>Handiness Rating: ${landlord.averageRatings.averageHandinessRating}</li>
                <li>Deposit Handling Rating: ${landlord.averageRatings.averageDepositHandlingRating}</li>
            </ul>`;

            // Append ratings information to the list item
            listItem.append(ratingsInfo);

            searchResults.append(listItem);

          });

          //Show searchResults
          searchResults.show();

          //Hide searchLandlordForm
          searchLandlordForm.hide();

          //Show RootLink
          rootLink.show();

      } else {

        errorDiv.text('Error in connecting with search results.').show();

        return;

      };

    });
  });

})(window.jQuery);
