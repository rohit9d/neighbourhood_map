var map, bounds, vm, largeInfoWindow,highIcon, clickIcon, marker, finish, yelp_request;
var loc1 = {
    'lat': '',
    'lng': ''
};
var empty = false;
var hover = false;
var click = false;
var loca;
var markers = [];
var model1 = [];
var ViewModel = function() {
    var menu = $('#menu');
    var sidebar = $('.sidebar')
    //hamburgar menu
    menu.click(function() {
        sidebar.toggleClass('open');
    });
    var self = this;
    this.query = ko.observable('');
    this.mylocation = ko.observable('Enter a location');
    this.restaurants = ko.observableArray([]);
    this.currentrestaurant = ko.observable();
    this.changelocation = function(value) {
        self.restaurants.removeAll();
        var i = 0;
        //emptying the markers array and model array on change of location to avoid previous markers
        while (i < markers.length && empty == false) {
            console.log("emptying");
            markers[i].setMap(null);
            markers[i] = {};
            model1[i] = {};
            i++;
        };
        empty = true;
        //run only if searchbar is not empty else reply to enter a valid location
        if (value != '') {
            yelp(value);
            yelp_request = setTimeout(function() {
                for (var i = 0; i < model1.length; i++) {
                    self.restaurants.push(model1[i]);
                }
                //new instance of bounds to dynamically reset bounds everytime for a new location
                bounds = new google.maps.LatLngBounds();

                add_markers_to_map(model1);
            }, 3000);
        } else {
            console.log("enter a valid location")
        }
    }
    this.showinfo = function(current) {
        self.currentrestaurant = current;
        populateInfoWindow(markers[self.currentrestaurant.id], largeInfoWindow);
    };
    // filter restaurants acoording to search and display markers accordingly
    this.search = function(value) {
        self.restaurants.removeAll();
        for (var i in model1) {
            markers[i].setMap(null);
            if (model1[i].name.toLowerCase().indexOf(value.toLowerCase()) >= 0) {
                //push restaurants matched to value and corresponding markers
                self.restaurants.push(model1[i]);
                markers[i].setMap(map);
            }
        }

    }
}

var vm = new ViewModel();
vm.query.subscribe(vm.search);
vm.mylocation.subscribe(vm.changelocation);
ko.applyBindings(vm);
mapdiv = $("#map");

//global funcitons
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: 0,
            lng: 0
        },
        zoom: 2
    });

    largeInfoWindow = new google.maps.InfoWindow();
    highlightedIcon = makeMarkerIcon('ed4b74');
    clickedIcon = makeMarkerIcon('f79336');
    //referemce from code pen to resize on window resize
    google.maps.event.addDomListener(window, "resize", function() {
        var center = map.getCenter();
        google.maps.event.trigger(map, "resize");
        map.setCenter(center);

    });


};

populateInfoWindow = function(marker, infowindow) {
    if (infowindow.marker != marker) {
        infowindow.marker = marker;
        infowindow.setContent('<div class="InfoWindow">' + '<h2 class="name">' + marker.title + '</h2>' + '<span class ="info" >' + marker.info + '</span>' + '<img src="' + marker.img + '"' + '</div>');
        infowindow.open(map, marker);

    }
    infowindow.addListener('closeclick', function() {
        marker.setIcon();
        infowindow.close();
        click = false;
    });

}

function makeMarkerIcon(markerColor) {
    var markerImage = new google.maps.MarkerImage(
        'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|' + markerColor +
        '|40|_|%E2%80%A2',
        new google.maps.Size(23, 36),
        new google.maps.Point(0, 0),
        new google.maps.Point(10, 34),
        new google.maps.Size(23, 36));
    return markerImage;
}
add_markers_to_map = function(restaurant) {
    empty = false;

    for (var i = 0; i < restaurant.length; i++) {
        marker = new google.maps.Marker({
            position: restaurant[i].location,
            map: map,
            title: restaurant[i].name,
            animation: google.maps.Animation.DROP,
            id: restaurant[i].id,
            info: restaurant[i].info,
            img: restaurant[i].img
        });
        markers[i] = marker;
        bounds.extend(marker.position);
        markers[i].setMap(map);
        bounds.extend(markers[i].position);
        marker.addListener('click', function() {
            this.setIcon(clickedIcon);
            click = true;
            populateInfoWindow(this, largeInfoWindow);
        });
        marker.addListener('mouseover', function() {
            if (click == false) {
                this.setIcon(highlightedIcon);
                hover = true;
            }

        });
        marker.addListener('mouseout', function() {
            if (click != true) {
                this.setIcon();
                hover = false;
            }
        });
        map.fitBounds(bounds);
    };
};