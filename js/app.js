/**
 * Created by Sharon on 09/25/16.
 */
var app = angular.module('app', ['ui.router']);
//邮件
app.factory('DataService', ['$rootScope',function ($rootScope ) {

    // create store
    var myStore = new store();

    // create shopping cart
    var myCart = new shoppingCart("Temp");
    var myAddress = [];

    // return data object with store and cart
    return {
        store: myStore,
        cart: myCart,
        address:myAddress
    };
}]);

var cartService = [ '$scope', 'DataService','$state', function(scope, DataService,state) {
    scope.products = DataService.store.products;
    scope.cart = DataService.cart;
    scope.address = DataService.address;
    scope.shippingFee = DataService.cart.shippingFee;
    scope.clearCart = DataService.cart.clearCart;
    //scope.shippingSelected =DataService.cart.shippingSelected;

    scope.shippingOptions = [
        "UPS",
        "Fedex"
    ];

    scope.clear = function(){

         DataService.cart = new shoppingCart("Temp");
         scope.cart.items = DataService.cart.items;
        return DataService.cart;

    };
    // add an item to the shopping cart

    scope.addItem = function(n,p,q) {
        var quantity = q;
        if (quantity != 0) {

            // update quantity for existing item
            var found = false;
            for (var i = 0; i < DataService.cart.items.length && !found; i++) {
                var item = DataService.cart.items[i];
                if (item.name == n) {
                    found = true;
                    item.qty = item.qty + q;
                    if (item.qty <= 0) {
                        DataService.cart.items.splice(i, 1);
                    }
                };
            };
            // new item, add now
            if (!found) {
                var itemT = new product(n,p,q);
                /*itemT.name = n;
                 itemT.price = p;
                 itemT.qty = q;*/
                DataService.cart.items.push(itemT);
            };
        };
    };
    scope.getDisappear = function(flag){
        if (flag == 0)
        {
            return false;
        };
        return true;
    };

    scope.showCart = function(){
        var flag = false;
        if (scope.totalItems() != 0)
        {
            flag = true;
        }
        return flag;
    };
    scope.removeItem  = function(index){
        DataService.cart.items.splice(index, 1)
    };
    scope.totalItems = function(){
        var count = 0;
        angular.forEach(DataService.cart.items, function(item) {
            count += (item.qty );
        });

        return DataService.cart.totalItems = count;
    };

    scope.extraCharge = function(){
        var eC = 20.00;
        var flag = true;

        if (scope.totalItems() >= 10){
            eC = 0.00;
        }

        return DataService.cart.extraCharge = eC;
    };
    scope.taxFee = function(){
        var tax ;
        if(DataService.address.state == "MD")
        {
            //;
            tax = 0.05*(scope.subTotal());
        }
        if(DataService.address.state != "MD" && DataService.address.state!= null )
        {
            tax = 0.00;
        }
        return DataService.address.taxFee = tax;
    };

    scope.subTotal = function(){
        var ttl = 0.00;
        angular.forEach(DataService.cart.items, function(item) {
            ttl += (item.qty * item.price);
        });

        return DataService.cart.subTotal = ttl;
    };
    scope.totalWeight = function(){
        var totalWeight = 0.00;
        for (var i = 0; i < DataService.cart.items.length; i++) {
            var item = DataService.cart.items[i];
            if (item.name == "Desk") {
                var perDesk = 15;
                totalWeight += perDesk*item.qty
            }
            if (item.name == "Sofa") {
                var perSofa = 115;
                totalWeight += perSofa*item.qty
            }
            if (item.name == "Chair") {
                var perChair = 10;
                totalWeight += perChair*item.qty
            }
            if (item.name == "Bookcase") {
                var perBookcase = 20;
                totalWeight += perBookcase*item.qty
            }

        }
        return DataService.cart.totalWeight = totalWeight;
    };
    //scope.setShippingSelected = function(options){

    scope.getShippingFee = function () {

        var sFee;
        // shipping is free if inside Maryland
        if(DataService.address.state == "MD"){
            if(scope.shippingSelected== "UPS") {
                sFee = 8+0.05*scope.totalWeight();
            }
            if(scope.shippingSelected == "Fedex") {
                sFee = 12+0.05*scope.totalWeight();
            }
        };
        if(DataService.address.state != "MD" && DataService.address.state!= null )
        {
            if(scope.shippingSelected == "UPS") {
                sFee = 10+0.05*scope.totalWeight();
            }
            if(scope.shippingSelected== "Fedex") {
                sFee = 15+0.05*scope.totalWeight();
            }
        }
        return sFee;
    };
    scope.total = function(){
        var total;
        total = scope.subTotal()+scope.getShippingFee()+scope.extraCharge()+scope.taxFee();
        return DataService.cart.totalCost = total;
    };
    scope.options=['AL','AK','AZ','AR','CA','CO','CT','DC','DE','FL','GA',
        'HI','ID','IL','IN','IA','KS','KY','LA','ME','MD',
        'MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ',
        'NM','NY','NC','ND','OH','OK','OR','PA','RI','SC',
        'SD','TN','TX','UT','VT','VA','WA','WV','WI','WY'];
    // function to submit the form after all validation has occurred
    scope.submitted = false;
    scope.submitForm = function(isValid) {

        // check to make sure the form is completely valid
        if (isValid) {
            //var tempUser = new user();
            //tempUser.fName = scope.user.fName;
            //shoppingCart.user.push(tempUser);
            return scope.submitted = true;

        }
    };


    scope.confirmAddr = function(add){

        var temp = add;
        DataService.address.push(temp);
        state.go('order');

    };
    scope.submitCart = function (name) {
        return DataService.cart = new shoppingCart(name);

    };

}];

app.controller("StoreProduct",cartService);


app.config(['$stateProvider', '$urlRouterProvider',function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/');
    $stateProvider
        .state('store', {
            url:'/',
            templateUrl: 'template/store.html',
            controller: 'StoreProduct'
        })
        .state('address', {
            url:'/address',
            templateUrl: 'template/myAddress.html',
            controller: 'StoreProduct'
        })
        .state('order',{
            url:'/order',
            templateUrl: 'template/orderInfor.html',
            controller: 'StoreProduct'

        });

}]);
