var message;
var map;
var marker = [];
var infoWindow = [];
var currentInfoWindow = null;
var currentPosition;
var position_latitude;
var position_longitude;
var destination;
var labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
var labelIndex = 0;
 
// 位置情報取得
function initMap(){
  geocoder = new google.maps.Geocoder();
  directionsDisplay = new google.maps.DirectionsRenderer;
  directionsService = new google.maps.DirectionsService();
  
  get_location();
}

 
// ( 1 )位置情報を取得します。
function get_location(){
  document.getElementById("area_name").innerHTML = '位置情報を取得します';
  if (navigator.geolocation) {
    // 現在の位置情報取得を実施 正常に位置情報が取得できると、
    // successCallbackがコールバックされます。
    navigator.geolocation.getCurrentPosition(successCallback,errorCallback);
  } else {
    message = "本ブラウザではGeolocationが使えません";
    document.getElementById("area_name").innerHTML = message;
  }
}
// ( 2 )位置情報が正常に取得されたら
function successCallback(pos) {
  // currentPosition = pos.coords;
  position_latitude = pos.coords.latitude;
  position_longitude = pos.coords.longitude;
   
  // 位置情報が取得出来たらGoogle Mapを表示する
  initialize(position_latitude,position_longitude);
}
 
function errorCallback(error) {
  message = "位置情報が許可されていません";
  document.getElementById("area_name").innerHTML = message;
}
 
// ( 3 )Google Map API を使い、地図を読み込み
function initialize(x,y) {
  document.getElementById("area_name").innerHTML = 'google map情報を取得中';
   
  // Geolocationで取得した座標を代入
  var myLatlng = new google.maps.LatLng(x,y);
  var mapOptions = {
    zoom: 12,
    center: myLatlng,
    mapTypeId: "roadmap",
  }
  // MapTypeId に、地図タイプを指定
  // HYBRID 衛星画像と主要な通りが表示されます
  // ROADMAP 通常の地図画像が表示されます
  // SATELLITE 衛生画像が表示されます。
  // TERRAIN 地形や植生などのマッピングをします。
 
  map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
   
  var marker = new google.maps.Marker({
    position: myLatlng,
    map: map,
    title:"Your position",
  });
  get_area_name(myLatlng);
  
  $("#floating-panel").css("display", "block");
  
  set_marker()
}
 
function get_area_name(latLng_now){
  // 座標から住所名を取得
  geocoder.geocode({latLng: latLng_now}, function(results, status){
    if(status == google.maps.GeocoderStatus.OK){
      document.getElementById("area_name").innerHTML = results[0].formatted_address+'付近にいます';
    } else {
      console.log("Geocode 取得に失敗しました reason: " + status);
    }   
  });
}

// google Map Geocodingで住所や、店舗名で緯度経度を得る
// ただし、google map geocodingは処理が非同期で実現されているので
// 注意すること
function codeAddress(name, address, url) {
  
  if (geocoder) {
    geocoder.geocode( { 'address': address,'region': 'jp'}, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        var bounds = new google.maps.LatLngBounds();
        for (var r in results) {
          if (results[r].geometry) {
            var latlng = results[r].geometry.location;
            bounds.extend(latlng);
            
            var debug = address + ", lat:" + latlng.lat() + ", lng:" + latlng.lng();
            console.log(debug);
          }
        }
      } else if (status == google.maps.GeocoderStatus.OVER_QUERY_LIMIT) {
        setTimeout(function() { codeAddress(address); }, 100);
      } else{
        console.log("Geocode 取得に失敗しました reason: " + status);
      }
    });
  }
}

function set_marker(){
  markers = [
          {name: "l'atelier de maison de canpagne<br>（ラトリエ・ドゥ・メゾン・ドゥ・カンパーニュ）", address: "東京都目黒区自由が丘1-19-23", lat:35.6134571, lng:139.66999399999997, url: "http://lateliermaisoncampagne.com/shop/jiyugaoka.php"},
          {name: "T’sレストラン", address: "東京都目黒区自由が丘2-9-6　Luz自由が丘　B1F", lat:35.6090306, lng:139.66809290000003, url: "http://ts-restaurant.jp/"},
          {name: "T’s たんたん 東京駅京葉ストリート店", address: "東京都千代田区丸の内1-9-1　JR東京駅１階八重洲南口改札内", lat:35.6797559, lng:139.76692219999995, url: "http://www.nre.co.jp/Portals/0/shop/tantan/"},
          {name: "AIN SOPH.Soar IKEBUKURO<br>（アインソフ ソア 池袋店）", address: "東京都豊島区東池袋3-5-7 ユニオンビルディング101", lat:35.7313972, lng:139.7171075, url: "http://ain-soph.jp/soar"},
          {name: "AIN SOPH.GINZA（アインソフ ギンザ 本店）", address: "東京都中央区銀座4-12-1", lat:35.6702088, lng:139.7679339, url: "http://ain-soph.jp/ginza/"},
          {name: "AIN SOPH.Ripple KABUKICYO<br>（アインソフ リプル 歌舞伎町店）", address: "東京都新宿区歌舞伎町2-46-8", lat:35.6978257, lng:139.70072449999998, url: "http://ain-soph.jp/ripple"},
          {name: "AIN SOPH.JOURNEY SHINJYUKU<br>（アインソフ ジャーニー 新宿店）", address: "東京都新宿区新宿3-8-9 新宿Qビル B1F.1F.2F", lat:35.6906539, lng:139.70672490000004, url: "http://ain-soph.jp/journey"},
          {name: "slowfood&wine KiboKo", address: "東京都新宿区新宿2-5-8 志村ビル 4Ｆ", lat:35.6897105, lng:139.70690360000003, url: "https://kiboko.owst.jp/"},
          {name: "ORGANIC TABLE BY LAPAZ", address: "東京都渋谷区神宮前3-38-11 原宿ニューロイヤルビル1F15号", lat:35.672211, lng:139.71301500000004, url: "http://www.lapaz-tokyo.com/"},
          {name: "こまきしょうどう", address: "東京都千代田区練塀町8-2", lat:35.699947, lng:139.77326040000003, url: "http://konnichiha.net/komakishokudo/"},
          {name: "ささやカフェ", address: "東京都墨田区横川1-1-10", lat:35.7036249, lng:139.8088881, url: "http://www.sasaya-cafe.com/"},
          {name: "Cafe Amrita（カフェ アムリタ）", address: "東京都墨田区押上1-22-3", lat:35.7107244, lng:139.81529290000003, url: "http://tabelog.com/tokyo/A1312/A131203/13176962/"},
          {name: "marugo deli ebisu（マルゴデリ恵比寿）", address: "東京都渋谷区恵比寿西1-17-1　プルミエール恵比寿 1F", lat:35.6484176, lng:139.70730290000006, url: "http://www.maru5ebisu.jp/"},
          {name: "vegebon", address: "東京都目黒区東が丘2-13-8", lat:35.6297827, lng:139.66361080000001, url: "https://tabelog.com/tokyo/A1317/A131707/13173881/"},
          {name: "Cafe MOLTY", address: "東京都荒川区町屋3‐23‐18", lat:35.7494535, lng:139.7847792, url: "http://tabelog.com/tokyo/A1324/A132401/13091729/"},
          {name: "Lotus&Flower's One", address: "東京都杉並区和田3-60-11　倉島ビル2F", lat:35.6974956, lng:139.66026550000004, url: "http://www.lotus-one.jp/"},
          {name: "Ballon", address: "東京都目黒区中目黒3-2-19 ラミアール中目黒104", lat:35.6413186, lng:139.69977289999997, url: "https://tabelog.com/tokyo/A1317/A131701/13210690/"},
          {name: "Mano-e-Mano（マーノ エ マーノ）", address: "東京都豊島区南池袋1-28-2 池袋パルコ8F", lat:35.7307756, lng:139.71243920000006, url: "http://mano-e-mano.jp/"},
          {name: "ダンスキューブ・カフェ", address: "東京都中央区勝どき4-13-4 ダンスキューブ勝どき2F", lat:35.6567206, lng:139.77489179999998, url: "https://www.chacott-jp.com/j/special/cafe/index.html"},
          {name: "koé green 自由が丘店", address: "東京都目黒区自由が丘2-9-19 KOE HOUSE 1F", lat:35.6096911, lng:139.66734999999994, url: "https://green.koe.com/"},
          {name: "SEKAI CAFE -Oshiage-", address: "東京都墨田区業平2-16-8", lat:35.7091245, lng:139.81170429999997, url: "http://sekai-cafe.com/oshiage/"},
          {name: "SEKAI CAFE -Asakusa-", address: "東京都台東区浅草1-18-8　大番ビル", lat:35.711499, lng:139.795661, url: "http://sekai-cafe.com/asakusa/"},
          {name: "フロマエカフェ", address: "東京都荒川区西日暮里4-21-7 コート池上1F", lat:35.7317357, lng:139.76450909999994, url: "http://fromae.blog.jp"},
          {name: "よかしこや今風庵", address: "東京都文京区千駄木3-36-12　団子坂下", lat:35.72478, lng:139.76300000000003, url: "http://www.comfoo.biz/pc/index.htm"},
          {name: "カフェむぎわらい", address: "東京都荒川区東日暮里1-5-6", lat:35.7310585, lng:139.79065760000003, url: "http://mugiwarai.la.coocan.jp/"},
          {name: "Bojun tomigaya", address: "東京都渋谷区富ヶ谷1-35-20 富ヶ谷スプリングス2F", lat:35.6673836, lng:139.68838549999998, url: "http://www.chayam.co.jp/restaurant/bojun.html"},
          {name: "ホブゴブリン六本木", address: "東京都港区六本木3-16-33 青葉六本木ビル1F", lat:35.661901, lng:139.73625000000004, url: "http://www.hobgoblin.jp"},
          {name: "ホブゴブリン赤坂", address: "東京都港区赤坂2-13-19 多聞堂ビルB1", lat:35.672683, lng:139.73823889999994, url: "http://www.hobgoblin.jp"},
          {name: "ホブゴブリン渋谷", address: "東京都渋谷区道玄坂 1-3-11 一番ビル3F", lat:35.6582785, lng:139.69963329999996, url: "http://www.hobgoblin.jp/"},
          {name: "daylight kitchen", address: "東京都渋谷区桜丘町23-18 ビジョナリーアーツ1F", lat:35.6558646, lng:139.69987259999994, url: "http://www.daylightkitchen.jp/"},
          {name: "Spice Box", address: "東京都千代田区内神田1-15-12 第二斉木ビル 1F", lat:35.6922333, lng:139.76589379999996, url: "http://tabelog.com/tokyo/A1310/A131002/13191118/"},
          {name: "LISTEN FOOD CAFE", address: "東京都港区赤坂 3-10-13 センチュリオンホテル 赤坂ヴィンテージ 1F", lat:35.6738463, lng:139.7376971, url: "http://listenfood.com/"},
          {name: "地球を旅するCAFE -Today is my life!-", address: "東京都新宿区高田馬場2-12-5", lat:35.7131492, lng:139.70758969999997, url: "http://chikyu-tabi-cafe.com/"},
          {name: "和のかし 巡", address: "東京都渋谷区上原3-2-1", lat:35.6675759, lng:139.6814025, url: "http://www.wa-meguri.com/"},
          {name: "MOR Happiness（モアハピネス）", address: "東京都三鷹市下連雀1-27-25", lat:35.6939009, lng:139.5687858, url: "http://morhappiness.com/"},
          {name: "Pain de BRUN（パン ド ブラン）", address: "東京都杉並区久我山5-6-16 シンエイマンション1F", lat:35.687679, lng:139.601905, url: "http://www.paindebrun.com/"},
          {name: "高木屋老舗", address: "東京都葛飾区柴又7-7-4", lat:35.7575005, lng:139.87667090000002, url: "http://www.takagiya.co.jp/"},
          ];
  
  for (var i = 0; i < markers.length; i++) {
    var markerLatLng = new google.maps.LatLng(markers[i].lat, markers[i].lng);
    labelIndex = 17,
    marker[i] = new google.maps.Marker({  //　マーカーの追加
      position: markerLatLng,   //　マーカーを立てる位置を指定
      map: map,    //　マーカーを立てる地図を指定
      label: labels[labelIndex++ % labels.length],
    });
    
    infoWindow[i] = new google.maps.InfoWindow({ // 吹き出しの追加
      content: "<div class='sample'>" + "<a href =" + markers[i].url + " target = '_blank'>" + markers[i].name + "</a> <br>" + markers[i].address + "</div>" // 吹き出しに表示する内容
    });
    markerEvent(i, markerLatLng);
    
    // マーカーリストのlat, lng確認時に使用
    // codeAddress(markers[i].name, markers[i].address, markers[i].url);
  }
  
  sortList(markers);
}

function markerEvent(i, markerAddress) {
  marker[i].addListener('click', function() {
    eventExe(i, markerAddress);
  });
}

function eventExe(i, markerAddress) {
  if(currentInfoWindow) { // 前の吹き出しを閉じる
    currentInfoWindow.close();
  }
  infoWindow[i].open(map, marker[i]); // 吹き出しの表示
  currentInfoWindow = infoWindow[i];
  
  // ルート表示
  directionsDisplay.setMap(map);
  currentPosition = {
    lat: position_latitude,
    lng: position_longitude
  }
  calcRoute(currentPosition, markerAddress); 
  destination = markerAddress;
  // 移動手段選択
  document.getElementById('mode').addEventListener('change', function() {
    calcRoute(currentPosition, destination); 
  });
}

function calcRoute(start, end) {
  var selectedMode = document.getElementById('mode').value;
  var request = {
    origin: start,
    destination: end,
    // travelMode: selectedMode,
    travelMode: google.maps.TravelMode[selectedMode],
    // travelMode: 'DRIVING',
  };
  directionsService.route(request, function(result, status) {
    // console.log(result, status);
    // console.log("origin:lat ", result.request.origin.location.lat());
    // console.log("origin:lng ", result.request.origin.location.lng());
    // console.log("destination:lat ", result.request.destination.location.lat());
    // console.log("destination:lng ", result.request.destination.location.lng());
    if (status == 'OK') {
      directionsDisplay.setDirections(result);
    }
  });
}

function sortList(markers) {
  // 距離の割り出しを行い、各データにdistance属性を設定
  $.each(markers, function(i, marker) {
    marker.index = i;  //id属性
    marker.distance = getDistance(marker.lat, marker.lng, position_latitude, position_longitude, 0) / 1000; //kmで算出
  });
  
  // 現在地からの距離が小さい順にソート
  markers.sort(function(a, b) {
    return (a.distance < b.distance) ? -1 : 1;
  });
  
  // データを出力
  var html = "";
  
  $.each(markers, function(i, marker) {
    html += '<tr id="' + marker.index + '" data-lat="' + marker.lat + '" data-lng="' + marker.lng + '">';
      html += '<td>' + (i + 1) + '</td>';
      html += '<td class="marker">' + marker.name + '</td>';
      html += '<td>' + marker.distance + 'km</td>';
    html += '</tr>';
  });
  
  $("#data-list").append(html);
  
  // リストの店名をクリックするとマーカーの吹き出しを表示する
  $(".marker").on('click', function() {
    var id = $(this).parent().attr("id");
    // console.log($(this).text());
    // console.log(id);
    var lat = $(this).parent().attr("data-lat");
    var lng = $(this).parent().attr("data-lng");
    // console.log(lat);
    // console.log(lng);
    var markerAddress = new google.maps.LatLng(lat, lng);
    eventExe(id, markerAddress);
    
    // マップトップへ移動
    var top = $("#map_canvas").offset().top;
    $("html,body").animate({scrollTop:top}, 300);
  });
}

function getDistance(lat1, lng1, lat2, lng2, precision){
  var distance = 0;
  if( ( Math.abs(lat1 - lat2) < 0.00001 ) && ( Math.abs(lng1 - lng2) < 0.00001 ) ) {
    distance = 0;
  }else{
    lat1 = lat1 * Math.PI / 180;
    lng1 = lng1 * Math.PI / 180;
    lat2 = lat2 * Math.PI / 180;
    lng2 = lng2 * Math.PI / 180;

    var A = 6378140;
    var B = 6356755;
    var F = ( A - B ) / A;

    var P1 = Math.atan( ( B / A ) * Math.tan(lat1) );
    var P2 = Math.atan( ( B / A ) * Math.tan(lat2) );

    var X = Math.acos( Math.sin(P1) * Math.sin(P2) + Math.cos(P1) * Math.cos(P2) * Math.cos(lng1 - lng2) );
    var L = ( F / 8 ) * ( ( Math.sin(X) - X ) * Math.pow( (Math.sin(P1) + Math.sin(P2) ), 2) / Math.pow( Math.cos(X / 2), 2 ) - ( Math.sin(X) - X ) * Math.pow( Math.sin(P1) - Math.sin(P2), 2 ) / Math.pow( Math.sin(X), 2) );

    distance = A * ( X + L );
    var decimal_no = Math.pow(10, precision);
    distance = Math.round(decimal_no * distance / 1) / decimal_no;
  }
  return distance;
}

$(function() {
  // レストランリストへ移動
  $("#move_to_list").on('click', function() {
    var list = $(".list").offset().top;
    $("html,body").animate({scrollTop: list}, 300);
  })
});