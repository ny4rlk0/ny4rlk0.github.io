var ny4='rlk0';
const nyaa_desu=null,dds=[];
let harita,gidis_yontemi='DRIVING';
var cember_alani,geocode,bilgipenceresi,anlik_konum,anlik_konum_obje,a_lat,a_lng,akonum=[];
var haritada_isaretli_yerler=[],tum_konumlar=[];
var konum_ayarlari={enableHighAccuracy:true,timeout:5000,maximumAge:0};
var TestModu=true;//Örnek konumlarla ve örnek veritabanıyla çalışır Gerçek veri tabanına geçeceğiniz zaman false yapın
//False  oldugu zaman test modunu kapatır gerçek konumunuzu çeker ve veritabanındaki konumlarla karşılatırır.
//Ben sadece ibb çevresindeki birkaç örneklem grubu ekledim google izin almadan içeriğinini çevrim dışı yapmak sözleşmelerine aykırı. //Aslında üşendim önceki bahane daha güzeldi. //ve bütün konumları çekseydim test bütçesinin üstüne çıkardım. Google free hesabıyla yaptım malum.
//Veritabanına istanbuldaki bütün dükkan hastane kahveci vb. yerleri eklerseniz tam istediğiniz gibi çalışır.
// Free trial status: ₺2,094.33 credit and 84 days remaining - with a full account, you'll get unlimited access to all of Google Cloud Platform.

var ibb_bina={lat:41.013556652651154, lng:28.95493828412249};
const bilgilendirme_mesaji=`Bilgilendirme Mesajı:
Sistem varsayılan ayarları yüzünden ve yeterince konum olmadığı için test modunda başlatıldı.
Test modunu kapatarak gerçek konumunuz ile hesaplayabilirsiniz.
Lakin veritabani.json içerisinde, belirttiğiniz dakikada size yakın bir konum yoksa.
Konum bulunamadı uyarısı alacaksınız.`;
async function anlik_konumu_bul(){
  test = $('#test_modu').val();
  if(test===1){TestModu=true;}//Test modu açık mı kapalı mı olsun
  else if(test===2){TestModu=false;}
  else{TestModu=true;}
  console.log('TestModu: '+TestModu);
  if(TestModu=true){//False olcak burası yanlış ama test amacıyla düzletmedim.
  console.log('TestModu: '+TestModu);
  console.log('anlik_konumu_bul()');
  anlik_konum=nyaa_desu;
  function basarili(kon){
    var k=kon.coords;
    const konum={
      'lat':parseFloat(k.latitude),
      'lng':parseFloat(k.longitude)
    }
    anlik_konum=konum;
    const a=JSON.parse(JSON.stringify(konum));
    a_lat=parseFloat(a.lat);
    a_lng=parseFloat(a.lng);
    anlik_konum_obje= new google.maps.LatLng(a_lat,a_lng);//new google.maps.LatLng(a_lat,a_lng);
    console.log(anlik_konum);
  }
  function hata(hat)
  {
    console.log('Konumlandırma hatasi: '+hat);
  }
  await navigator.geolocation.getCurrentPosition(basarili,hata, konum_ayarlari);
  }
  else{anlik_konum=ibb_bina;}
}
anlik_konumu_bul();
//anlik_konumu_bul();
//Yer verilerimizi içeren veritabanımızı indirelim //Şu anlık aynı sunucuda
//var json = (function() {
//  var json = null;
$.ajax({
  'async': true,
  'global': true,
  'url': "https://nyarlko.com/veritabani.json",
  'dataType': "json",
  'success': function(data) {
    json = data;
    tum_konumlar=data['veritabani'];
    if (tum_konumlar!=nyaa_desu){ 
      console.log(tum_konumlar);
      console.log('Konumları içeren veri tabanı başarıyla indirildi.');
    }
  }
});
//  return json;
//})();
//console.clear();//Yanlış hata bildirimlerini temizleyelim
//Mapi örnekle
jQuery(document).ready(function(){
  //var enboy = new google.maps.LatLng(41.013556652651154,28.95493828412249);//IBB Binası
  var ekAyarlar={
    zoom:18,
    center:anlik_konum_obje,//enboy,//anlik_konum,
    mapTypeControl:true,
    mapTypeControlOptions: {style: google.maps.MapTypeControlStyle.DROPDOWN_MENU},
    navigationControl:true,
    mapTypeId: google.maps.MapTypeId.ROAD_MAP // ROAD_MAP:Renksiz çizim // SATELLITE: Uydu görüntüsü
  };
  harita= new google.maps.Map(document.getElementById('map_arayuzu') ,ekAyarlar);
  geocoder= new google.maps.Geocoder();
  bilgipenceresi = new google.maps.InfoWindow();
  google.maps.event.addListener(harita,'click',function(){
    if(bilgipenceresi){
      bilgipenceresi.setMap(nyaa_desu);
      bilgipenceresi= nyaa_desu;
    }
  });
  if (TestModu=true){alert(bilgilendirme_mesaji);}
});
async function konumuBul(){
          anlik_konumu_bul();
          var yeni_isaretli_hedef=new google.maps.Marker({position:anlik_konum,map:harita,icon:'kirmizi_ok_x32.png',title:'Konum'});
          if(bilgipenceresi){
            bilgipenceresi.setMap(nyaa_desu);
            bilgipenceresi=nyaa_desu;
            clearMap();
          }
          google.maps.event.addListener(yeni_isaretli_hedef, 'click', function() {
            bilgipenceresi = new google.maps.InfoWindow({
              content: '<div style="color:red">'+'Konumum'+'</div>'+'Mevcut Konumum.',
              size: new google.maps.Size(150,50),
              pixelOffset: new google.maps.Size(0,-30),position:anlik_konum,map:harita
            });
            bilgipenceresi.setPosition(anlik_konum);
            bilgipenceresi.setContent('<div style="color:red">'+'Konumum'+'</div>'+'Mevcut Konumum.');
            
            harita.setCenter(anlik_konum);
            haritada_isaretli_yerler.push(yeni_isaretli_hedef);
          });
          //bilgipenceresi.open({anchor:Marker,harita,shouldFocus:true});//konum penceresini aç bir şekilde
          console.log('KonumuBul()');
          harita.panTo(anlik_konum);//Haritada konumu ortala
}

async function konumuAcKapa(){
  async function rotalariTemizle(){
    console.log('Rotalar temizleniyor...');
    dds.forEach(dd => {dd.setMap(null);});
    dds.length = 0;
  }
  alert('Rotalar hesaplanıyor.');
  await konumuBul(); 
  var neko;
  test = $('#test_modu').val();
  if(test===1){TestModu=true;}//Test modu açık mı kapalı mı olsun
  else if(test===2){TestModu=false;}
  else{TestModu=true;}
  console.log('TestModu: '+TestModu);
  gidis_yontemi = $('#gidis_yontemi').val(); //Neyle gidicek bu insanlar yürüyerek mi arabayla mı bisikletle mi?
  let dakika = $('#dakika').val();
  if (gidis_yontemi=='1'){gidis_yontemi='DRIVING';}// ARABA
  else if (gidis_yontemi=='2'){gidis_yontemi='WALKING';}//DEAD   //Tabanway                (Yürüyüş)
  else if (gidis_yontemi=='3'){gidis_yontemi='BICYCLING';}// Bisiklet
  else if (gidis_yontemi=='4'){gidis_yontemi='TRANSIT';}// Toplu Seyahat
  else {gidis_yontemi='DRIVING';}//Source code ile oynamışlar biz varsayılan seçeneğimize gidelim.
  //adres_enboy= anlik_konum;
  //const mevcut_konum=await konumuBul();
  //Yeni açmadan önce alan ve işaretleri haritadan temizle.
  //if (cember_alani){
  //  cember_alani.setMap(nyaa_desu);//Çember alanını null yapalım.
  //  cember_alani=nyaa_desu;
 // }
  for (neko=0;neko < haritada_isaretli_yerler.length; neko++){
    if(haritada_isaretli_yerler[neko]){
      haritada_isaretli_yerler[neko].setMap(nyaa_desu);
      haritada_isaretli_yerler[neko]=nyaa_desu;
    }
  }
  if(geocoder){//      'address':adres
    geocoder.geocode({'location':anlik_konum},function(sonuc,durum){// 
      if(durum==google.maps.GeocoderStatus.OK){
        if(durum!=google.maps.GeocoderStatus.ZERO_RESULTS){
          console.log(sonuc);
          adres_enboy=sonuc[0].geometry.location;//{lat:a_lat,lng:a_lng}//sonuc[0].geometry.location;
          //var aadres_enboy=typeof adres_enboy;
          //console.log(aadres_enboy);
          //adres_enboy=akonum;
          //console.log(akonum);
          //cember_alani = new google.maps.Circle({
          //  center:adres_enboy,
          //  radius:alan_km*1000,
          //  clickable:false,
          //  map:harita
          //});
          if (ny4!='rlk0'){return;}// Hah jokes on you.
          console.log('Veritabanındaki konum sayısı: '+tum_konumlar.length);
          rotalariTemizle();
    //if(cember_alani) harita.fitBounds(cember_alani.getBounds());
          for (var miyav=0;miyav<tum_konumlar.length;miyav++){
                  (async function (konum){
                          //await clearMap();
                          let dk=parseInt(dakika);//dakikayı integer dönüştürüp dk değişkenine atayalım
                          var hedef_enboy = new google.maps.LatLng(parseFloat(konum.lat),parseFloat(konum.lng));
                          let seyahat_zamani_holder,a,b;
                          console.log('AdresEnBoy: '+adres_enboy);
                          console.log('AnlikKonum: '+anlik_konum);
                          var konumdan_hedefe_uzaklik= google.maps.geometry.spherical.computeDistanceBetween(adres_enboy,hedef_enboy);//Bulunduğun konum ile işaret arasındaki metre cinsinden mesafe
                          try{a= await gidisZamaniHesapla(adres_enboy,hedef_enboy);}//Cevap objemizi alalım
                          catch(e){console.clear;alert('Seçtiğiniz seyahat yöntemi ile gidilebilecek bir yada birden fazla yere rota bulunamadı.');return;} //LOL rota bulmazsa fonksiyonu durduruyor
                          b= await JSON.parse(JSON.stringify(a));//Cevap Objesini stringe dönüştürelim
                          //console.log(a); //konum bilgilerini görmek istiyorsan uncomment yap
                          b= await b.routes[0].legs[0].duration.text;//Cevap objesinden sadece Seyahat zamanını alalım
                          b= await b.split(" ");// Seyahat zamanı stringini (örnek: 1 dakika) 2 parçaya ayıralım
                          seyahat_zamani_holder=await b[0];//Sadece sayı kısmını alalım. (Sayı olabilir ama hala string.)                          
                          let local_sure=parseInt(seyahat_zamani_holder);//seyahat zamani integer dönüştürüp local_sure değişkenine atayalım                     
                          if (local_sure<=dk ){//&& konumdan_hedefe_uzaklik<=dk*1000){//konumdan_hedefe_uzaklik<=alan_km*1000){// Sadece seçilen süreden az zamanda gidilebilecek yerler gösterilsin. (konumdan_hedefe_uzaklik<=alan_km*1000)
                                  const dd= new google.maps.DirectionsRenderer({suppressMarkers:true});//suppressMarkers İşaretleri kaldırıyor A B şeklindeki
                                  dd.setMap(harita);
                                  dd.setDirections(a);//Rotayı ekranda göster.
                                  console.log('<----- Metod çalışma sayısı');
                                  var yeni_isaretli_hedef=new google.maps.Marker({
                                    position:hedef_enboy,
                                    map:harita,
                                    icon:'mavi_ok_x32.png',
                                    title:konum.name});
                                  google.maps.event.addListener(yeni_isaretli_hedef, 'click', function() {
                                    if(bilgipenceresi){
                                      bilgipenceresi.setMap(nyaa_desu);
                                      bilgipenceresi=nyaa_desu;
                                    }
                                    bilgipenceresi = new google.maps.InfoWindow({
                                      content: '<div style="color:red">'+konum.name +'</div>' + "Sizden " + konumdan_hedefe_uzaklik + " metre uzakta. "+'</br>'+'Seyahat zamani: '+seyahat_zamani_holder+' dakika.',
                                      size: new google.maps.Size(150,50),
                                      pixelOffset: new google.maps.Size(0,-30),
                                      position:hedef_enboy,
                                      map:harita
                                    });
                                  });
                                  haritada_isaretli_yerler.push(yeni_isaretli_hedef);
                                  dds.push(dd);//Direction renderer(dd) imizi direction renderers listesine ekleyelim(dds)* Sebebi daha sonra çabucak rotaları silmek için
                          }
                  })(tum_konumlar[miyav]);       
          }
        }else {alert('Hiçbir sonuç bulunamadı! Teheee :P');}
      }else {alert('Geocode başarısız: '+durum+'.');}
    });
  }
}
async function gidisZamaniHesapla(bas_enboy,bit_enboy){//Başlangıç bitiş Enlem Boylam
  var ds = new google.maps.DirectionsService;//API'yi örnekleyelim
  console.log('Seyahat Tipi: '+gidis_yontemi);
  var t= await ds.route({origin: bas_enboy,destination: bit_enboy,travelMode: gidis_yontemi},nekoback);
  return t;
  }
async function nekoback(cevap,durum){///Gidiş zamanı hesaplama fonksyonu için Callback 
  var a= await cevap;
  //if (durum=='ZERO_RESULTS'){console.clear();alert('Seçtiğiniz seyahat yöntemi ile gidilebilecek rota bulunamadı.');}
  if (durum=='OK'){console.log(a);return a;}//obje
  else{console.clear();console.log('Hata: Oneechan rotalar alınırken bir sorunla karşılaştım (?_?)');return;}
  
  }
function nekowait(ms){
    var d = new Date();
    var d2 = null;
    do { d2 = new Date(); }
    while(d2-d < ms);
}

async function clearMap(){
  console.log('Harita temizleniyor...');
  var dd= new google.maps.DirectionsRenderer({suppressMarkers:true});
  haritada_isaretli_yerler=[];
  // Clear past routes
  if (dd != null) {//Mapi temizle
    dd.setMap(null);
    dd.set('directions', null);
    dd.set('routes', null);
    dd.length = 0;
    dd = null;          
    }
}
