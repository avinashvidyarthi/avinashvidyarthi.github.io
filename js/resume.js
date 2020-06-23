(function($) {
  "use strict"; // Start of use strict

  // Smooth scrolling using jQuery easing
  $('a.js-scroll-trigger[href*="#"]:not([href="#"])').click(function() {
    if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
      if (target.length) {
        $('html, body').animate({
          scrollTop: (target.offset().top)
        }, 1000, "easeInOutExpo");
        return false;
      }
    }
  });

  // Closes responsive menu when a scroll trigger link is clicked
  $('.js-scroll-trigger').click(function() {
    $('.navbar-collapse').collapse('hide');
  });

  // Activate scrollspy to add active class to navbar items on scroll
  $('body').scrollspy({
    target: '#sideNav'
  });

})(jQuery); // End of use strict



if('serviceWorker' in navigator){
  navigator.serviceWorker.register("/sw.js").then((e)=>{
  })
}

window.addEventListener('beforeinstallprompt',function(event){
  event.preventDefault();
})


// showing enable notification btn
if('notification' in window && 'serviceWorker' in navigator){
  if(window.Notification.permission!=='granted'){
    $(".enabled-notification").addClass('d-none');
    $(".enable-notification").removeClass('d-none');
  }
}

function contactMe(){
  const name =$("#name");
  const subject = $("#subject");
  const message = $("#message");

  let url = "mailto:avinashvidyarthi@gmail.com?subject="+subject.val()+"&body=Hi Avinash,%0D%0A";
  url+=message.val();
  url+="%0D%0A%0D%0AThanks and Regards%0D%0A"+name.val();
  window.location=url;

  name.val('');
  subject.val('');
  message.val('');
}

function showContact(){
  if('notification' in window && 'serviceWorker' in navigator){
    if(window.Notification.permission!=='granted'){
      $(".enable-notification").removeClass('d-none');
    }
    else{
      $(".enabled-notification").removeClass('d-none');
    }
  }
}

function configurePushSub(){
  var sw_reg=null;
  navigator.serviceWorker.ready
  .then((swReg)=>{
    sw_reg=swReg;
    return swReg.pushManager.getSubscription();
  })
  .then((sub)=>{
    if(sub===null){
      // create subscription
      // nU7KY-0jXCZ9693s52p27xqR69jhjJ3lcw49ypWG9C0
      var vapidKey="BKrd_OpQgyPWKHmyyHshZvRCOVMum_wDI7z4zQ-ZWvcHljHhnxMc14ir7G8B96xTXPrCu9xHKiTkSvoudXQTgRo";
      var convertedVapidKey=urlBase64ToUint8Array(vapidKey);
      return sw_reg.pushManager.subscribe({
        userVisibleOnly:true,
        applicationServerKey:convertedVapidKey
      });
    }
  })
  .then((newSub)=>{
    // store into server
    return fetch("https://us-central1-avinashvidyarthi.cloudfunctions.net/app/store-subs",{
      method:'POST',
      body:JSON.stringify(newSub)
    });
  })
  .then((res)=>{
    if(res.ok){
      welcomeNotification();
    }
  })
  .catch((err)=>{
    // console.log(err);
  })
}

function welcomeNotification(){
  if('serviceWorker' in navigator){
    var options={
      body:"You'll now get notifications from me.",
      icon:"../img/icons/icons-96x96.png",
      badge:"../img/icons/icons-96x96.png",
      vibrate:[100,50,200],
      data:{
        url:"https://avinashvidyarthi.github.io"
      }
    }
    navigator.serviceWorker.ready.then((swReg)=>{
      swReg.showNotification("Successfully Subscribed!",options);
    })
  }
  
}


function enableNotification(){
  if('notification' in window && 'serviceWorker' in navigator){
    window.Notification.requestPermission().then((choice)=>{
      if(choice==='granted'){
        $(".enable-notification").addClass('d-none');
        configurePushSub();
        showContact();
      }
    });
  }
}


function urlBase64ToUint8Array(base64String) {
  var padding = '='.repeat((4 - base64String.length % 4) % 4);
  var base64 = (base64String + padding)
      .replace(/\-/g, '+')
      .replace(/_/g, '/');

  var rawData = window.atob(base64);
  var outputArray = new Uint8Array(rawData.length);

  for (var i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}