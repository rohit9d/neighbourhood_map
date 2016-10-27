//var m1 = new model();

//console.log(m1.categories.restaurants[1].name);
var model1 = [];

function yelp(loc){
  console.log("inside yelp");
    var yelp_url = 'https://api.yelp.com/v2/search?';
    var parameters = {
        oauth_consumer_key: 'xCCtCzq4GT7uNMZnMjDxOA',
        oauth_token: 'n6pj5YvpD-tYWU6i1ilcZlhzf-5Yw8KP',
        oauth_nonce: nonce_generate(),
        oauth_timestamp: Math.floor(Date.now()/1000),
        oauth_signature_method: 'HMAC-SHA1',
        oauth_version : '1.0',
        callback: 'cb',              // This is crucial to include for jsonp implementation in AJAX or else the oauth-signature will be wrong.
        term: 'food',
        location: loc
    };

    var encodedSignature = oauthSignature.generate('GET',yelp_url, parameters, 'CQfHTVODlycYgankSnp5XdMV59k', 'bKgw38bvFpN3OfluQDTR3zu4ADc');
    parameters.oauth_signature = encodedSignature;

    var settings = {
        url: yelp_url,
        data: parameters,
        cache: true,                // This is crucial to include as well to prevent jQuery from adding on a cache-buster parameter "_=23489489749837", invalidating our oauth-signature
        dataType: 'jsonp',
        success: function(results) {
            loc1.lat = results.region.center.latitude;
            loc1.lng = results.region.center.longitude;
            map.setCenter(loc1);
            map.setZoom(8);
            change_model(results);
        },
        error: function() {
          // Do stuff on fail
        }
    };

    // Send AJAX query via jQuery library.
    $.ajax(settings);
    //console.log(finish);

}
function nonce_generate() {
  return (Math.floor(Math.random() * 1e12).toString());
};
function change_model(results){
    var stores = results.businesses;
    var st ={'name': ' ','info': ' ','img': ' ','location': { 'lat': ' ', 'lng' : ' '}, 'id': 0};

    for(var i=0; i<10 ; i++) {
        //console.log(results.businesses[i].name);
        st.name = stores[i].name;
        st.info = stores[i].snippet_text;
        st.img = stores[i].image_url;
        st.address = stores[i].location.address;
        st.location.lat = stores[i].location.coordinate.latitude;
        st.location.lng = stores[i].location.coordinate.longitude;
        st.id = i;
        //console.log(st);
        model1.push(st);
        //console.log(model1.stores[2].name);
        console.log(model1[i].name);

    }
    console.log(model1[8].name);

};
//yelp();
