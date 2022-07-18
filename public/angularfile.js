var app = angular.module('app',['ui.router','ngSanitize']);
app.config(function($stateProvider,  $urlRouterProvider){
 $urlRouterProvider.otherwise('/home');
 //UI Routing
	$stateProvider
	  .state('mainpage',{
			views:{
				'navbar':{templateUrl:'./templates/navbar.html',	controller:'navbarCtrl',},
				'bodycontent':{templateUrl:'./templates/mainbody.html', controller:'generalhomeCtrl',},
			}
			})
		.state('mainpage.home',{//HOME PAGE
			url:"/home",
			views:{
				'banner':{templateUrl:'./templates/banner.html',},
				'catcol':{templateUrl:'./templates/categorycart.html',	controller:'catcartCtrl',},
				'maincol':{templateUrl:'./templates/albumpagehome.html',	controller:'albumpagehomeCtrl',},
			}
			})
		.state('mainpage.genre',{//LIST PER GENRE DISPLAY
			url:"/genre/:genre",
			views:{
				'banner':{templateUrl:'./templates/itempath.html',	controller:'itempathCtrl',},
				'catcol':{templateUrl:'./templates/categorycart.html',	controller:'catcartCtrl',},
				'maincol':{templateUrl:'./templates/listpergenre.html',	controller:'listpergenreCtrl',},
			}
			})
		.state('mainpage.info',{//PAGE WITH INFO ON ONE SPECIFIC ALBUM
			url:"/info/:genre?albumname?id",
			views:{
				'banner':{templateUrl:'./templates/itempath.html',	controller:'itempathCtrl',},
				'catcol':{templateUrl:'./templates/categorycart.html',	controller:'catcartCtrl',},
				'maincol':{templateUrl:'./templates/albuminfo.html',	controller:'albuminfoCtrl',},
			}
			})
    .state('wishlistpage',{
  		url:"/mywishlist",
  		views:{
  			'navbar':{templateUrl:'./templates/navbar.html',	controller:'navbarCtrl',},
  			'bodycontent':{templateUrl:'./templates/wishlistpage.html', controller:'wishlistpageCtrl',},
  		}
  	})
		.state('loginpage',{
			url:"/login",
			views:{
				'navbar':{templateUrl:'./templates/navbar.html',	controller:'navbarCtrl',},
				'bodycontent':{templateUrl:'./templates/login.html',	controller:'loginCtrl',},
			}
			})
		.state('checkoutpage',{
			url:"/checkout",
			views:{
				'navbar':{templateUrl:'./templates/navbar.html',	controller:'navbarCtrl',},
				'bodycontent':{templateUrl:'./templates/checkout.html',	controller:'checkoutCtrl',},
			}
			});
});


//FACTORIES GROUPED BY CATEGORY OF NEED --- COMMUNICATE WITH THE SERVER OR THE LOCAL STORAGE
app.factory('albumFactory',['$http',function($http) {
	var myModel = {};
	var data = null;
	myModel.getAlbums = function(pagenumber) {
    if(pagenumber != 1 && pagenumber != 2){
      pagenumber = 0;
    }
		return $http.get('http://localhost:3000/albums/getallalbums/'+pagenumber);
	}
	myModel.getAlbumByGenre = function(genre) {
		return $http.get('http://localhost:3000/albums/getallalbumsgenre/'+genre);
	}
  myModel.getAlbumById = function(id) {
		return $http.get('http://localhost:3000/albums/search/'+id);
	}
	myModel.getAlbumByNameOrArtist = function(queryobject) {
		return $http.post('http://localhost:3000/albums/search', queryobject);
	}
	myModel.setParam = function(newData) {
		data = newData;
	}
	myModel.getParam = function() {
		return data;
	}

	return myModel;
}]);

app.factory('userFactory',['$http',function($http) {
	var myModel = {};
	var data = null;
	myModel.registerNewUser = function(info) {
		return $http.post('http://localhost:3000/users/register', info);
	}
	myModel.loginUser = function(info) {
		return $http.post('http://localhost:3000/users/authenticate', info);
	}
	myModel.logout = function() {
		return $http.get('http://localhost:3000/users/logout');
	}
	myModel.sendOrder = function(info) {
		return $http.post('http://localhost:3000/users/order', info);
	}
  myModel.checkIfLoggedIn = function() {
		return $http.get('http://localhost:3000/users/checkifloggedin');
	}


  myModel.getLogId = function() {
		var getmemory = localStorage.getItem("loggedid");
    if(!getmemory){
      return null;
    }else{
      return getmemory;
    }
	}

	myModel.deleteLogId = function() {
		localStorage.removeItem("loggedid");
	}


	myModel.addLogId = function(id) {
    logobj= id;
    localStorage.setItem("loggedid",logobj);
	}

	myModel.setParam = function(newData) {
		data = newData;
	}
	myModel.getParam = function() {
		return data;
	}

	return myModel;
}]);

app.factory('cartFactory',['$rootScope',function($rootScope) {

    var prepForBroadcast = function() {
        $rootScope.$broadcast('handleBroadcast');
    };



	var myModel = {};
	var data = null;
	myModel.getCart = function() {
			var getmemory = localStorage.getItem("cartdata");
			var parseddata = JSON.parse(getmemory);
			return parseddata;
	}
	myModel.removeFromCart = function(id) {
		var getmemory = localStorage.getItem("cartdata");
		var parseddata = JSON.parse(getmemory);
		for(i=0; i < parseddata.length; i++){
			if(parseddata[i]._id == id){
        parseddata.splice(i, 1);
			}
		}
		var strdata = JSON.stringify(parseddata);
		localStorage.setItem("cartdata",strdata);
    prepForBroadcast();
	}
	myModel.deleteCart = function() {
		localStorage.removeItem("cartdata");
    prepForBroadcast();
	}

	myModel.addToCart = function(data) {
		var getmemory = localStorage.getItem("cartdata");

		var flag = true;
		if(!getmemory){
			parseddata = [];
		}else{
      var parseddata = JSON.parse(getmemory);
			for(i=0; i < parseddata.length; i++){
				if(parseddata[i]._id == data._id){
					parseddata[i].quantity = parseddata[i].quantity + data.quantity;
					flag = false;
				}
		}}
		if(flag == true){
			parseddata.push(data);
		}
		var strdata = JSON.stringify(parseddata);
		localStorage.setItem("cartdata", strdata);
    prepForBroadcast();
	}

	myModel.setParam = function(newData) {
		data = newData;
	}
	myModel.getParam = function() {
		return data;
	}

	return myModel;

}]);

app.factory('wishlistFactory',[function() {
	var myModel = {};
	var data = null;
	myModel.getWishlist= function() {
			var getmemory = localStorage.getItem("wishlistdata");
			var parseddata = JSON.parse(getmemory);
			return parseddata;
	}

  myModel.inWishlist = function(id) {
		var getmemory = localStorage.getItem("wishlistdata");
    var flag = false;
    if(!getmemory){
      parseddata = [];
    }else{
      var parseddata = JSON.parse(getmemory);
  		for(i=0; i < parseddata.length; i++){
  			if(parseddata[i]._id == id){
  				flag = true;
  			}
  		}}
    if(flag == true){
      return true;
    }else{
      return false;
    }
	}


	myModel.removeFromWishlist = function(id) {
		var getmemory = localStorage.getItem("wishlistdata");
		var parseddata = JSON.parse(getmemory);
		for(i=0; i < parseddata.length; i++){
			if(parseddata[i]._id == id){
				parseddata.splice(i, 1);
			}
		}
		var strdata = JSON.stringify(parseddata);
		localStorage.setItem("wishlistdata",strdata);
	}
	myModel.deleteWishlist = function() {
		localStorage.removeItem("wishlistdata");
	}

	myModel.addToWishlist = function(data) {
    var getmemory = localStorage.getItem("wishlistdata");
    var flag = false;
    if(!getmemory){
      parseddata = [];
    }else{
      var parseddata = JSON.parse(getmemory);
  		for(i=0; i < parseddata.length; i++){
  			if(parseddata[i]._id == data._id){
  				parseddata.splice(i, 1);
          flag=true;
  			}
  		}}
    if(flag == false){
      parseddata.push(data);
    }
		var strdata = JSON.stringify(parseddata);
		localStorage.setItem("wishlistdata",strdata);
    if(flag == false){
      return "added";
    }else{
      return "removed";
    }
	}

	myModel.setParam = function(newData) {
		data = newData;
	}
	myModel.getParam = function() {
		return data;
	}

	return myModel;
}]);

app.factory('checkoutFactory',['$http',function($http) {
	var myModel = {};
	var data = null;
  var orderinfo = {}
	myModel.getInfo = function() {
    return orderinfo;
  }

  myModel.saveInfo = function(orderdata) {
    for(var i in orderdata){
      orderinfo.i = orderdata.i;
    }
  }

  myModel.deleteInfo = function() {
    orderinfo = {};
  }

	myModel.setParam = function(newData) {
		data = newData;
	}
	myModel.getParam = function() {
		return data;
	}

	return myModel;
}]);


//CONTROLLERS ASSOCIATED WITH EACH VIEW OF STATE
app.controller('navbarCtrl',['$state', '$scope','albumFactory', 'cartFactory', 'userFactory', '$rootScope', function($state, $scope,albumFactory, cartFactory, userFactory, $rootScope){
  $scope.loggedin;
  var checklogin = function(){
    userFactory.checkIfLoggedIn().then( function(params) {
      if(params.data.msg == "logged in"){
        $scope.loggedin = true;
      }else{
        $scope.loggedin = false;
      }
      continuenavbar($scope.loggedin);
    });
  }
  checklogin();

  var continuenavbar = function(logged){
    $scope.loggedin = logged;

    $scope.logout = function(){
      var logoutstatus = userFactory.logout();
      $scope.loggedin = false;
      userFactory.deleteLogId();
      $state.go('mainpage.home');
    }

    $scope.initcart=function(){
        $scope.getCart = cartFactory.getCart();
      if($scope.getCart == null){
        $scope.getCart = 0;
      }else{
        var itemcounter = 0;
        for (var i in $scope.getCart){
          itemcounter = itemcounter + $scope.getCart[i].quantity;
        }
        return $scope.getCart = itemcounter;
      }
    }

    $scope.initcart();

    $scope.$on('handleBroadcast', function() {
        $scope.initcart();
      });


  	$scope.navalbums=[];
  	$scope.getnavresults = function(){
  		if($scope.navsearch.trim() != "" && $scope.navsearch.length >= 3){
  			albumFactory.getAlbumByNameOrArtist({"research": $scope.navsearch.trim()})
  			.then( function(params) { // success
  				 $scope.navalbums = params.data;
  		  });

  		}else{
  			$scope.navalbums=[];
  		}
  	}
  }



}]);

app.controller('generalhomeCtrl',['$scope','albumFactory', 'cartFactory', function($scope, albumFactory, cartFactory){
	$scope.albumdata = [];
	albumFactory.getAlbums(1).then( function(params) {
		 $scope.albumdata = params.data;
	});
  $scope.addonetocart = function (i){
    i.quantity = 1;
    cartFactory.addToCart(i);

  }
}]);

app.controller('catcartCtrl',['$scope','albumFactory', 'cartFactory', function($scope, albumFactory, cartFactory){
  $scope.initcart=function(){
    $scope.getShopCart = cartFactory.getCart();
    $scope.cartQty = $scope.cartTotal = 0;

  	for (var i in $scope.getShopCart){
  		$scope.cartQty = $scope.cartQty + $scope.getShopCart[i].quantity;
  		$scope.cartTotal = $scope.cartTotal + ($scope.getShopCart[i].quantity * $scope.getShopCart[i].price);
  	}
  }

  $scope.initcart();

  $scope.$on('handleBroadcast', function() {
      $scope.initcart();
    });




  $scope.deletefromcart = function(id){
    cartFactory.removeFromCart(id);
  }

}]);

app.controller('albumpagehomeCtrl',['$scope','albumFactory', 'cartFactory', function($scope, albumFactory, cartFactory){

}]);

app.controller('itempathCtrl',['$scope', '$stateParams', function($scope, $stateParams){

  $scope.genre = $stateParams.genre;
  $scope.albumname = $stateParams.albumname;
}]);


app.controller('albuminfoCtrl',['$scope','albumFactory', 'cartFactory', '$stateParams', 'wishlistFactory', function($scope, albumFactory, cartFactory, $stateParams, wishlistFactory){
  $scope.albumid = $stateParams.id;
  $scope.alreadyinwishlist = wishlistFactory.inWishlist($scope.albumid);
  if($scope.alreadyinwishlist == false){
    $scope.heartlogo = "heartlogo";
  }else{
    $scope.heartlogo = "heartlogofilled";
  }
  $scope.getalbuminfo = [];
  albumFactory.getAlbumById($scope.albumid).then( function(params){
     $scope.getalbuminfo = params.data;
  });
  $scope.addtocart = function (){
    $scope.getalbuminfo.quantity = $scope.qtytoorder;
    if($scope.getalbuminfo.quantity > 0){
      cartFactory.addToCart($scope.getalbuminfo);
    }
  }
  $scope.addtowishlist = function (){
      $scope.addorremovewish = wishlistFactory.addToWishlist($scope.getalbuminfo);
      if($scope.addorremovewish == "added"){
        $scope.heartlogo = "heartlogofilled";
      }else if ($scope.addorremovewish == "removed") {
        $scope.heartlogo = "heartlogo";
      }
  }

}]);

app.controller('listpergenreCtrl',['$scope','albumFactory', 'cartFactory', '$stateParams',function($scope, albumFactory, cartFactory, $stateParams){
	$scope.genre = $stateParams.genre;
	$scope.getalbumgenrelist = [];
  albumFactory.getAlbumByGenre($scope.genre).then( function(params) {
     $scope.getalbumgenrelist = params.data;
  });

  $scope.addonetocart = function(i){
    i.quantity = 1;
    cartFactory.addToCart(i);
  }

}]);

app.controller('wishlistpageCtrl',['$state', '$scope', 'cartFactory', 'wishlistFactory', function($state, $scope, cartFactory, wishlistFactory){
  $scope.wishdata = wishlistFactory.getWishlist();
  $scope.wishlistqty = 0;
  if($scope.wishdata){
    $scope.wishlistqty = $scope.wishdata.length;
  }
  $scope.addonetocart = function (i){
    i.quantity = 1;
    cartFactory.addToCart(i);
  }
  $scope.removefromwish = function (i){
    wishlistFactory.removeFromWishlist(i);
    $state.reload();
  }

}]);

app.controller('checkoutCtrl',['$state', '$scope', 'albumFactory', 'cartFactory', 'checkoutFactory', '$rootScope', 'userFactory', function($state, $scope, albumFactory, cartFactory, checkoutFactory, $rootScope, userFactory){
  $scope.loggedin;
  var checklogin = function(){
    userFactory.checkIfLoggedIn().then( function(params) {
      if(params.data.msg == "logged in"){
        $scope.loggedin = true;
      }else{
        $scope.loggedin = false;
      }
      $scope.getShopCart = cartFactory.getCart();
      continuecheckoutpage($scope.loggedin, $scope.getShopCart);
    });
  }
  checklogin();

  var continuecheckoutpage = function(logged, cart){
    $scope.loggedin = logged;
    $scope.getShopCart = cart;
    if($scope.loggedin != true){
      window.alert("Please sign in...");
      $state.go('loginpage');
    }else if ($scope.loggedin == true) {


      if($scope.getShopCart == null || $scope.getShopCart.length < 1){
        window.alert("Your cart is empty...");
        $state.go('mainpage.home');
      }
      $scope.cartTotal = 0;
      for (var i in $scope.getShopCart){
    		$scope.cartTotal = $scope.cartTotal + ($scope.getShopCart[i].quantity * $scope.getShopCart[i].price);
    	}
      $scope.orderdata = checkoutFactory.getInfo();
      $scope.checkoutpage = $scope.orderdata.checkoutpage;
      $scope.checkouterror={};

      if($scope.checkoutpage == undefined){
        $scope.checkoutpage = 1;
      }
      $scope.changebil = function(){
        $scope.checkoutpage = 1;
      }
      $scope.changepay = function(){
        $scope.checkoutpage = 2;
      }
      $scope.continuestep1 = function(){
        $scope.checkouterror={};
        var isallok = true;
        if($scope.orderdata.biladdress != undefined){
          var biladdresssplit = $scope.orderdata.biladdress.trim().split(" ");
        }
        if($scope.orderdata.biladdress == undefined || ((isNaN(biladdresssplit[0]) && biladdresssplit[0].length<3)  && (isNaN(biladdresssplit[biladdresssplit.length-1]) && biladdresssplit[1].length<3)) || (biladdresssplit.length < 2)){
          isallok = false;
          $scope.checkouterror.biladdress = "inputerror";
        }
        if($scope.orderdata.bilcity == undefined || $scope.orderdata.bilcity.trim().length < 3 || !isNaN($scope.orderdata.bilcity.trim())){
          isallok = false;
          $scope.checkouterror.bilcity = "inputerror";
        }
        if($scope.orderdata.bilzip == undefined || $scope.orderdata.bilzip.trim().length < 3 || isNaN($scope.orderdata.bilzip.trim())){
          isallok = false;
          $scope.checkouterror.bilzip = "inputerror";
        }

        if($scope.orderdata.bilphone == undefined || $scope.orderdata.bilphone.trim().length < 7 || $scope.orderdata.bilphone.trim().length > 14 || isNaN($scope.orderdata.bilphone.trim())){
          isallok = false;
          $scope.checkouterror.bilphone = "inputerror";
        }

        if(isallok == true){
          $scope.orderdata.checkoutpage = 2;
          checkoutFactory.saveInfo($scope.orderdata);
          $scope.checkoutpage = 2;
        }
      }

      $scope.continuestep2 = function(){
        var isallok = true;
        $scope.checkouterror={};
        if($scope.orderdata.bilpayment == "checkormoneyorder"){
          $scope.orderdata.bilnameoncard = $scope.orderdata.bilcreditcardtype = $scope.orderdata.bilcreditcardnumber = $scope.orderdata.bilexpmonth = $scope.orderdata.bilexpyear = $scope.orderdata.bilcvv = "";
        }else if ($scope.orderdata.bilpayment == "creditcard") {
          if($scope.orderdata.bilnameoncard != undefined){
            var nameoncardsplit = $scope.orderdata.bilnameoncard.trim().split(" ");
          }
          if($scope.orderdata.bilnameoncard == undefined || nameoncardsplit.length<2 || (nameoncardsplit[0].length<2 || !isNaN(nameoncardsplit[0])) || (nameoncardsplit[1].length<2 || !isNaN(nameoncardsplit[1]))){
            isallok = false;
            $scope.checkouterror.bilnameoncard = "inputerror";
          }

          if($scope.orderdata.bilcreditcardtype == undefined || ($scope.orderdata.bilcreditcardtype != 'visa' && $scope.orderdata.bilcreditcardtype != 'mastercard' && $scope.orderdata.bilcreditcardtype != 'americanexpress')){
            isallok = false;
            $scope.checkouterror.bilcreditcardtype = "inputerror";
          }

          if($scope.orderdata.bilexpmonth == undefined || $scope.orderdata.bilexpmonth < 1 || $scope.orderdata.bilexpmonth > 12){
            isallok = false;
            $scope.checkouterror.bilexpmonth = "inputerror";
          }

          if($scope.orderdata.bilexpyear == undefined || $scope.orderdata.bilexpyear < 2017 || $scope.orderdata.bilexpyear > 2025){
            isallok = false;
            $scope.checkouterror.bilexpyear = "inputerror";
          }

          if($scope.orderdata.bilcreditcardnumber == undefined || $scope.orderdata.bilcreditcardnumber.trim().length != 16 || isNaN($scope.orderdata.bilcreditcardnumber.trim())){
            isallok = false;
            $scope.checkouterror.bilcreditcardnumber = "inputerror";
          }

          if($scope.orderdata.bilcvv == undefined || $scope.orderdata.bilcvv.trim().length < 2 || $scope.orderdata.bilcvv.trim().length > 4 || isNaN($scope.orderdata.bilcvv.trim())){
            isallok = false;
            $scope.checkouterror.bilcvv = "inputerror";
          }

        }else{isallok = false;}

        if(isallok == true){
          $scope.orderdata.checkoutpage = 3;
          checkoutFactory.saveInfo($scope.orderdata);
          $scope.checkoutpage = 3;

        }
      }

      $scope.continuestep3 = function(){
        $scope.loading = true;
        var myid = userFactory.getLogId();
        var datatosend = {
          "customer_id": myid,
          "address": $scope.orderdata.biladdress.trim(),
          "city": $scope.orderdata.bilcity.trim(),
          "zip": $scope.orderdata.bilzip.trim(),
          "telephone": $scope.orderdata.bilphone.trim(),
          "payment_method":$scope.orderdata.bilpayment,
          "name_card": $scope.orderdata.bilnameoncard.trim(),
          "creditcard_number": $scope.orderdata.bilcreditcardnumber,
          "creditcard_type": $scope.orderdata.bilcreditcardtype,
          "expiration": $scope.orderdata.bilexpmonth+"/"+$scope.orderdata.bilexpyear,
          "cvv": $scope.orderdata.bilcvv.trim(),
          "order": JSON.stringify($scope.orderdata),
          "total_price": $scope.cartTotal
        };

        userFactory.sendOrder(datatosend).then( function(params) {
           if(params.data.success == true){
             $scope.loading = false;
             $scope.orderdata = {};
             cartFactory.deleteCart();
             window.alert("Your order has been completed with success!");
             $state.go('mainpage.home');
           }else if(params.data.success == false){
             $scope.loading = false;
             window.alert("There was a problem completing your order, retry...");
           }else{
             window.alert("Could not connect to Server");
           }
         });
       }
     }
   }
}]);

app.controller('loginCtrl',['$state', '$scope', 'userFactory', '$rootScope', function($state, $scope, userFactory, $rootScope){
  $scope.loggedin;
  var checklogin = function(){
    userFactory.checkIfLoggedIn().then( function(params) {
      if(params.data.msg == "logged in"){
        $scope.loggedin = true;
      }else{
        $scope.loggedin = false;
      }
      continuelogregispage($scope.loggedin);
    });
  }
  checklogin();

  var continuelogregispage = function(logged){
    $scope.loggedin = logged;

    if($scope.loggedin == true){
      window.alert("You are already logged in!");
      $state.go('mainpage.home');
    }else if ($scope.loggedin == false) {

      $scope.showmodal = false;
      $scope.regisdata = {};
      $scope.logindata = {};
      $scope.regerror={};
      $scope.loginerror={};

      $scope.openmodal = function(){
        $scope.showmodal = true;
      }

      $scope.closemodal = function(){
        $scope.showmodal = false;
      }

      $scope.loginuser = function(){
        $scope.loginerror={};
        var emailregex = new RegExp(/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/);
        var allisok = true;
        if($scope.logindata.email == undefined || emailregex.test($scope.logindata.email.trim()) == false){
          allisok = false;
          $scope.loginerror.email = "inputerror";
        }
        if($scope.logindata.pswd == undefined || $scope.logindata.pswd.trim().length < 6 || !isNaN($scope.logindata.pswd.trim()) || $scope.logindata.pswd.trim() == "Password"){
          allisok = false;
          $scope.loginerror.pswd = "inputerror";
        }else{
          var str = $scope.logindata.pswd.trim();
          var counter = 0;
          for(var i=0; i < str.length; i++){
            if(str[i] == str[i].toLowerCase()){
              counter++;
            }
          }
          if(counter == str.length){
            allisok = false;
            $scope.loginerror.pswd = "inputerror";
          }
        }
          if(allisok == true){
            $scope.loading = true;
            $scope.loginerror = {};
            var datatosend = {"email": $scope.logindata.email.trim(), "password": $scope.logindata.pswd.trim()};
            userFactory.loginUser(datatosend).then( function(params) {
      				 if(params.data.success == true){
                 $scope.loading = false;
                 $scope.logindata = {};
                 userFactory.addLogId(params.data._id);
                 window.alert("Success, you are now logged in!!");
                 $state.go('mainpage.home');
               }else if(params.data.success == false){
      				   $scope.loading = false;
                 window.alert("There was a problem letting you in... This is not racism, please retry...");
      				 }else{
                 window.alert("Could not connect to Server");
               }
      		  });
          }
        }

      $scope.registeruser = function(){
        $scope.regerror={};
        $scope.loading = false;
        var emailregex = new RegExp(/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/);
        var allisok = true;
        if($scope.regisdata.fname == undefined || $scope.regisdata.fname.trim().length < 2 || !isNaN($scope.regisdata.fname.trim()) || $scope.regisdata.fname.trim() == "First Name"){
          allisok = false;
          $scope.regerror.fname = true;
        }
        if($scope.regisdata.lname == undefined || $scope.regisdata.lname.trim().length < 2 || !isNaN($scope.regisdata.lname.trim()) || $scope.regisdata.lname.trim() == "Last Name"){
          allisok = false;
          $scope.regerror.lname = true;
        }
        if($scope.regisdata.email == undefined || emailregex.test($scope.regisdata.email.trim()) == false){
          allisok = false;
          $scope.regerror.email = true;
        }

        if($scope.regisdata.pswd == undefined || $scope.regisdata.pswdconf == undefined || $scope.regisdata.pswd.trim().length < 6 || !isNaN($scope.regisdata.pswd.trim()) || $scope.regisdata.pswd.trim() == "Password" || $scope.regisdata.pswd.trim() != $scope.regisdata.pswdconf.trim()){
          allisok = false;
          $scope.regerror.pswd = true;
        }else{
          var str = $scope.regisdata.pswd.trim();
          var counter = 0;
          for(var i=0; i < str.length; i++){
            if(str[i] == str[i].toLowerCase()){
              counter++;
            }
          }
          if(counter == str.length){
            allisok = false;
            $scope.regerror.pswd = true;
          }
          if(allisok == true){
            $scope.loading = true;
            var datatosend = {"first_name":$scope.regisdata.fname.trim(), "last_name": $scope.regisdata.lname.trim(), "email": $scope.regisdata.email.trim(), "password": $scope.regisdata.pswd.trim()};
            userFactory.registerNewUser(datatosend).then( function(params) {
      				 if(params.data.success == true){
                 $scope.loading = false;
                 $scope.regisdata = {};
                 $scope.showmodal = false;
                 window.alert("Success, you are now registered!! You can now login!");
               }else if(params.data.success == false){
      				   $scope.loading = false;
                 window.alert("There was a problem registering you... This is not racism, please retry and check if you are not already one of ours...");
      				 }else{
                 window.alert("Could not connect to Server");
               }
      		  });
        }}}
      }}
  }]);
