/**
 * Created by Sharon on 09/25/16.
 */
function shoppingCart(cartName) {
    this.cartName = cartName;
    this.clearCart = false;
    this.completeCart = false;
    this.loginF   = false;
    //this.checkoutParameters = {};
    this.items = [];
    this.totalWeight = [];
    this.subTotal = [];
    this.shippingSelected = [];
    this.totalItems = [];
    //
    this.taxFee =[];
    this.shippingFee = [];
    this.extraCharge =[];
    this.totalCost =[];

    // load items from local storage when initializing
   // this.loadItems();

    // save items to local storage when unloading
}