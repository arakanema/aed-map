// loading
function csvToArray(filename, cb) {
  $.get(filename, function(csvdata) {
    csvdata = csvdata.replace(/\r/gm, "");
    var line = csvdata.split("\n"),
        ret = [];
    // skip header
    line.shift();
    for (var i in line) {
      if (line[i].length == 0) continue;
      var row = line[i].split(",");
      ret.push(row);
    }
    cb(ret);
  });
}

function setMarkersToGoogleMap(items, apikey, markerImage, defaultPosition) {
  // 現在地を取得できるなら取得
}

// main
$(document).ready( function () {
  // Googleマップ APIキー
  var apikey = "";

  // AEDのマーカー画像を指定
  var aedImg = "marker.png";

  // 現在地が取得できない場合の中心座標
  var defaultPosition = "";

  // for single page style.
  $(".navbar-nav > li > a").click( function () {
    $(".navbar-nav > li").removeClass("active");
    var contentName = $(this).parent()[0].className;
    $(this).parent().addClass("active");
    $(".row > div").css("display", "none");
    $("#" + contentName).css("display", "block");
    document.title = $(this).text();
  });

  // AED object
  var AED = function() {
    this.id;
    this.location;
    this.address;
    this.phone;
    this.longitude;
    this.latitude;
  }

  // set AED object from csv file
  csvToArray("./aed-map.csv", function(data) {
    var aed = new AED();
    var aedList = new Array();
    for (var i = 0; i < data.length; i++) {
      aed.id        = data[i][0];
      aed.location  = data[i][1];
      aed.address   = data[i][2];
      aed.phone     = data[i][3];
      aed.longitude = data[i][4];
      aed.latitude  = data[i][5];
      aedList.push(aed);
    }
    setMarkersToGoogleMap(aedList, aedImg, apikey, defaultPosition);
  });
});


