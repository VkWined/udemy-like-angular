import { Component, OnInit } from '@angular/core';
import { CartService } from 'src/app/services/cart.service';
import { OrderService } from 'src/app/services/order.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  cartItems: any[] = [];
  total: number = 0;
  userId!: string;

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private authService: AuthService
  ) { }

  async ngOnInit() {
    this.userId = this.authService.getUserId() as string;
    this.cartItems = await this.cartService.getCartItems(this.userId);
    this.total = this.cartItems.reduce((total, item) => total + item.price, 0);
  }

  async checkout() {
    try {
      await this.orderService.createOrder(this.userId, this.cartItems);
      await this.cartService.clearCart(this.userId);
      console.log('Checkout successful');
    } catch (error) {
      console.error('Error during checkout: ', error);
    }
  }
  
}
