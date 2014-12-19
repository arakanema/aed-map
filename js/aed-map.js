  function initialize() {
    // settings
    var aedImage = "marker.png";
    var defaultPosition = "33.296098, 131.479716";
    var mapIdName = "aedmap";
    var filename = "aed-map.csv";
    var opts = {
        zoom: 14,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    var thisMap = new google.maps.Map(document.getElementById(mapIdName), opts);
  
    // for single page style.
    $(".navbar-nav > li > a").click( function () {
      $(".navbar-nav > li").removeClass("active");
      var contentName = $(this).parent()[0].className;
      $(this).parent().addClass("active");
      $(".row > div").css("display", "none");
      $("#" + contentName).css("display", "block");
      document.title = $(this).text();
    });

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition( function(position) {
        thisMap.setZoom(thisMap.getZoom() + 3);
        var initialLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        setMarkers(thisMap, initialLocation, aedImage, mapIdName, filename);
      });
    } else {
      var initialLocation = [defaultPosition.split(',')[0], defaultPosition.split(',')[1]]
      initialLocation = new google.maps.LatLng(initialLocation[0], initialLocation[1]);
      setMarkers(thisMap, initialLocation, aedImage, mapIdName, filename);
    }

    function createMarker(map, latlng, icon, content) {
      var marker = new google.maps.Marker({
        position: latlng,
        map: map,
        icon: icon,
        title: content.title,
        visible: true
      });
      google.maps.event.addListener(marker, "click", function() {
        var infowindow = new google.maps.InfoWindow({
          content: content.html
        });
        infowindow.open(map, marker);
      });
      marker.setMap(map);
    }

    function setMarkers(map, centerPosition, aedImage, mapIdName, filename) {
      var AED = function() {
        this.id;
        this.location;
        this.address;
        this.phone;
        this.longitude;
        this.latitude;
        this.content = function() {
          var markerInfo = {
            title: this.location,
            html: ""
          };
          markerInfo.html += "<div class='scrollFix'>";
          markerInfo.html += "<div class='location'>" + this.location + "</div>";
          markerInfo.html += "<div class='phone'><a href='tel:" + this.phone + "'>" + this.phone + "</a></div>";
          markerInfo.html += "<div class='address'>" + this.address + "</div>";
          markerInfo.html += "</div>";
          return markerInfo;
        }
      }

      map.setCenter(centerPosition);

     $.get(filename, function(csvdata) {
        csvdata = csvdata.replace(/\r/gm, "");
        var line = csvdata.split("\n");
        var items = [];
        line.shift(); // skip header
        for (var i in line) {
          if (line[i].length == 0) continue;
          var cols = line[i].split(",");
          var aed = new AED();
          aed.id = cols[0];
          aed.location = cols[1];
          aed.address = cols[2]
          aed.phone = cols[3];
          aed.longitude = cols[4];
          aed.latitude = cols[5];
          items.push(aed);
        }
        for (var i = 0; i < items.length; i++) {
          var latlng = new google.maps.LatLng(items[i].latitude, items[i].longitude);
          createMarker(map, latlng, aedImage, items[i].content());
        }
      });
    }

  }

