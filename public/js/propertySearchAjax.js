/* 
All of the functionality will be done in this client-side JS file.  
You will make client - side AJAX requests to the API and use jQuery to target and create elements on the page. You can use a client-side fetch or axios request instead of AJAX)
*/

//TO DO: ADD APPROPRIATE ROUTES WHERE FLAGGED WITH "TO DO"

(function ($){

  //References to form, input, ul, div, and a elements
  let searchPropertyForm = $('#searchForm'),
      searchType = $('#searchType'),
      searchQuery = $('#searchQuery'),
      errorDiv = $('#errorDiv'),
      searchResults = $('#searchResults'),
      propertyDetails = $('#propertyDetails'),
      rootLink = $('#rootLink');

  //Ensure rootLink is hidden
  rootLink.hide();

  //EVENT: Intercept form submission
  searchPropertyForm.submit(function (event) {

    //Prevent default
    event.preventDefault();

    //Empty and hide elements
    errorDiv.empty().hide();
    searchResults.empty().hide(); 
    propertyDetails.empty().hide();
    rootLink.hide();

    //Handle empty input
    //console.log(searchQuery.val());
    let searchQueryValue = searchQuery.val().trim();
    if(searchQueryValue === ''){
      errorDiv.text('Please provide a search term.').show();
      return;
    } 

    //Check searchType. Construct configurations based on value.

    let requestConfig = {};

    if (searchType.val() === 'address'){

      requestConfig = {
        method: 'GET',
        url: `property/searchPropertyByAddress/${searchQueryValue}`
      }

    } else if ((searchType.val() === 'city')) {

      requestConfig = {
        method: 'GET',
        url: `property/searchPropertyByCity/${searchQueryValue}`
      }

    } else if ((searchType.val() === 'state')) {

      requestConfig = {
        method: 'GET',
        url: `property/searchPropertyByState/${searchQueryValue}`
      }
      
    } else if ((searchType.val() === 'zip')){

      requestConfig = {
        method: 'GET',
        url: `property/searchPropertyByZip/${searchQueryValue}`
      }

    } else if ((searchType.val() === 'name')){

      requestConfig = {
        method: 'GET',
        url: `property/searchPropertyByName/${searchQueryValue}`
      }

    } 

    //console.log('Request Config:', requestConfig);

    //AJAX Call
    /*$.ajax(requestConfig).then(function(responseMessage) {

        console.log('Response Message:', responseMessage);

        if(responseMessage.Response && Array.isArray(responseMessage.Search)){

            responseMessage.Search.forEach((property) => {

              let listItem = $(`<li> <a href="javascript:void(0)" data-id="${property.propertyId}">${property.name}, ${property.type}, ${property.city}, ${property.state}</a></li>`);

              searchResults.append(listItem);

            });

            //Show searchResults
            searchResults.show();

            //Show RootLink
            rootLink.show();

        } else {

          errorDiv.text('Error in connecting with search results. (AJAX CALL)').show();

          return;

        };*/

      $.ajax(requestConfig).then(function(properties) {

        if(properties && Array.isArray(properties)){

            properties.forEach((property) => {

              
                //let listItem = $(`<li> <a href="#" data-id="${property.propertyId}">${property.propertyName}, ${property.propertyCategory}, ${property.city}, ${property.state}</a></li>`);
                let listItem = $(`
                <li>
                    <a href="/property/id/${property.propertyId}">${property.propertyName}<br></a>
                    ${property.propertyCategory},<br>
                    ${property.city}, ${property.state}<br>
                    Bedrooms: ${property.bedrooms}<br>
                    Bathrooms: ${property.bathrooms}
                </li>
              `);
                searchResults.append(listItem);

            });
            // Show searchResults
            searchResults.show();

            // Show RootLink
            rootLink.show();

        } else {
            errorDiv.text('Error: Invalid response from server.').show();
        }

    });
  });
/*
  //EVENT: Hide the rootLink when it's clicked
  rootLink.click(function(event) {
    rootLink.hide(); 
  });

  //EVENT: Property link clicked

  searchResults.on('click', 'a', function(event) {

    //Prevent default
    event.preventDefault();

    //Empty and hide elements
    searchResults.hide();
    propertyDetails.empty();

     //Pull propertyId from the a element
    let propertyId = $(this).data('id');

    //TO DO: USE PROPERTY ID HERE. CONSTRUCT URL PATH ACCORDING TO ROUTES
    //Create  request configuration 
    requestConfig = {
      method: 'GET',
      url: `property/searchPropertyById/${propertyId}`
    };
    console.log(requestConfig);
    //AJAX Call

    $.ajax(requestConfig).then(function(responseMessage) {
      console.log(responseMessage);
      if(responseMessage.Response){

        let htmlToInsert = `
          <article>

              <h1>${responseMessage.propertyName || 'ResponseMessage Name Not Available'}</h1>

              <a href="/property/${responseMessage.propertyId}">See property's individual listing.</a>

              <section>
                  <h2>Location</h2>
                  <p>${responseMessage.address ? responseMessage.address : 'Address Not Available'}, ${responseMessage.city ? responseMessage.city : 'City Not Available'}, ${responseMessage.state ? responseMessage.state : 'State Not Available'}, ${responseMessage.zipcode ? responseMessage.zipcode : 'ZIP Code Not Available'}</p>
                  <p>Longitude: ${responseMessage.longitude ? responseMessage.longitude : 'Longitude Not Available'}</p>
                  <p>Latitude: ${responseMessage.latitude ? responseMessage.latitude : 'Latitude Not Available'}</p>
              </section>
              
              <section>
                  <h3>Details</h3>
                  <dl>
                      <dt>Category:</dt>
                          <dd>${responseMessage.propertyCategory ? responseMessage.propertyCategory : 'Category Not Available'}</dd>
                      <dt>Bedrooms:</dt>
                          <dd>${responseMessage.bedrooms ? responseMessage.bedrooms : 'Bedrooms Not Available'}</dd>
                      <dt>Bathrooms:</dt>
                          <dd>${responseMessage.bathrooms ? responseMessage.bathrooms : 'Bathrooms Not Available'}</dd>
                  </dl>
              </section>

              <section>
                  <h3>Written Reviews</h3>
                  <ul>
                      ${responseMessage.reviews && responseMessage.reviews.length > 0 ?
                          responseMessage.reviews.map(review => `<li>${review.reviewText}</li>`).join('') :
                          '<li>No Reviews Available</li>'}
                  </ul>
              </section>

              <section>
                  <h3>Average Review Ratings</h3>
                  <dl>
                      <dt>Location Desirability:</dt>
                          <dd>${responseMessage.averageRatings && responseMessage.averageRatings.averageLocationDesirabilityRating ? responseMessage.averageRatings.averageLocationDesirabilityRating : 'Rating Not Available'}</dd>
                      <dt>Owner Responsiveness:</dt>
                          <dd>${responseMessage.averageRatings && responseMessage.averageRatings.averageOwnerResponsivenessRating ? responseMessage.averageRatings.averageOwnerResponsivenessRating : 'Rating Not Available'}</dd>
                      <dt>ResponseMessage Condition:</dt>
                          <dd>${responseMessage.averageRatings && responseMessage.averageRatings.averageResponseMessageConditionRating ? responseMessage.averageRatings.averageResponseMessageConditionRating : 'Rating Not Available'}</dd>
                      <dt>Community:</dt>
                          <dd>${responseMessage.averageRatings && responseMessage.averageRatings.averageCommunityRating ? responseMessage.averageRatings.averageCommunityRating : 'Rating Not Available'}</dd>
                      <dt>Amenities:</dt>
                          <dd>${responseMessage.averageRatings && responseMessage.averageRatings.averageAmenitiesRating ? responseMessage.averageRatings.averageAmenitiesRating : 'Rating Not Available'}</dd>
                  </dl>
              </section>

              <section>
                  <h3>Comments</h3>
                  <ul>
                      ${responseMessage.comments && responseMessage.comments.length > 0 ?
                          responseMessage.comments.map(comment => `<li>${comment}</li>`).join('') :
                          '<li>No Comments Available</li>'}
                  </ul>
              </section>

          </article>`;


      // Append HTML to propertyDetails element and show
      propertyDetails.append(htmlToInsert);
      propertyDetails.show();

      } else {
        errorDiv.text('Error in connecting with property details page. (AJAX CALL 2)').show();
        return;
      };
  });
});*/

})(window.jQuery);
